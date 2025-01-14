import moment from 'moment-timezone';

let usageLimits = {}; // كائن لتخزين الحد الأقصى لكل مجموعة

let handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  let groupId = m.chat; // معرف المجموعة
  let senderId = m.sender; // معرف المرسل
  let usageKey = `${groupId}:${command}`;

  // إذا كان الأمر "تحديد_منشن"
  if (command === 'تحديد_منشن') {
    if (!isOwner) {
      m.reply('❌ هذا الأمر متاح فقط للمطور.');
      return;
    }
    let limit = parseInt(args[0]);
    if (isNaN(limit) || limit <= 0) {
      m.reply('❌ الرجاء إدخال رقم صحيح كحد للاستخدام.');
      return;
    }
    usageLimits[groupId] = limit; // تعيين الحد للمجموعة
    m.reply(`✅ تم تعيين الحد الأقصى لاستخدام أوامر المنشن إلى ${limit} مرة.`);
    return;
  }

  // التحقق من الحد الأقصى
  if (!usageLimits[groupId]) usageLimits[groupId] = 3; // الحد الافتراضي
  if (usageLimits[usageKey] === undefined) usageLimits[usageKey] = usageLimits[groupId];

  if (usageLimits[usageKey] <= 0) {
    m.reply('❌ تم استنفاد الحد الأقصى لاستخدام هذا الأمر في المجموعة. الرجاء التواصل مع المطور لإعادة التعيين.');
    return;
  }

  let pesan = args.join` `;
  let time = moment.tz('Asia/Riyadh').format('hh:mm A');
  let date = moment.tz('Asia/Riyadh').format('YYYY/MM/DD');
  let groupName = m.chat;

  // تصفية الأعضاء حسب الأمر
  let filteredParticipants =
    command === 'منشن_اعضاء'
      ? participants.filter(p => !p.admin)
      : command === 'منشن_مشرفين'
      ? participants.filter(p => p.admin)
      : participants;

  let teks = `
─⟢ـ*
> ˼⚕️˹↜ ${command === 'منشن_اعضاء' ? '🌟 *قــســم الأعضاء العاديين*' : command === 'منشن_مشرفين' ? '👑 *قــســم المشرفين*' : '🌟 *قــســم جميع أعضاء المجموعة*'} ↶
╮────────────────⟢ـ

💠 *اسم المجموعة:* 『 ${groupName} 』
📩 *الرسالة:* 『 ${pesan || '❌ لا توجد رسالة محددة ❌'} 』
📅 *التاريخ:* 『 ${date} 』
🕰️ *الوقت:* 『 ${time} 』
👥 *عدد المستهدفين:* 『 ${filteredParticipants.length} 』

─⟢ـ*
> ˼⚕️˹↜ 🏷️ *قائمة الأعضاء* ↶
╮────────────────⟢ـ
${filteredParticipants.map(mem => `┊⟣｢@${mem.id.split('@')[0]}｣`).join('\n')}
╯────────────────⟢ـ

─⟢ـ*
> ˼⚕️˹↜ 👑 *مسؤول المنشن* ↶
╮────────────────⟢ـ
┊⟣｢@${m.sender.split('@')[0]}｣
╯────────────────⟢ـ

─⟢ـ*
> ˼⚕️˹↜ 🤖 *تحيات 𝑻𝑬𝑹𝑩𝑶* ↶
╮────────────────⟢ـ
✨ *شكرًا لاستخدام خدماتنا! نعمل دائمًا لخدمتك.* ✨
╯────────────────⟢ـ
`;

  // إرسال الرسالة
  conn.sendMessage(m.chat, {
    text: teks,
    mentions: filteredParticipants.map(a => a.id),
    image: { url: 'https://qu.ax/EslaW.jpg' }
  });

  // تقليل العداد
  usageLimits[usageKey] -= 1;
};

handler.help = ['منشن_اعضاء <message>', 'منشن_مشرفين <message>', 'منشن_الكل <message>', 'تحديد_منشن <عدد>'];
handler.tags = ['group'];
handler.command = /^(منشن_اعضاء|منشن_مشرفين|منشن|تحديد_منشن)$/i;
handler.admin = true;
handler.group = true;

export default handler;