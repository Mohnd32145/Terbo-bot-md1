const time = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handler = async (m, { conn, text, command, usedPrefix }) => {
  if (m.mentionedJid.includes(conn.user.jid)) return;

  const pp = 'https://files.catbox.moe/cssco6.jpg'; // رابط الصورة للتحذير داخل الجروب
  const ppPrivate = 'https://files.catbox.moe/cssco6.jpg'; // رابط الصورة للرسالة الخاصة
  let who;

  // تحديد هوية المستخدم في الجروب أو الشات الخاص
  if (m.isGroup) {
    who = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : text;
  } else {
    who = m.chat;
  }

  // التحقق من صحة هوية المستخدم
  if (!who) {
    const warntext = `*[❗] قم بالرد على رسالة أو منشن المستخدم*\n\n*—◉ مثال:*\n*${usedPrefix + command} @user*`;
    return m.reply(warntext, m.chat, { mentions: conn.parseMention(warntext) });
  }

  // التأكد من وجود سبب للإنذار
  if (!text || text.trim() === "") {
    return m.reply('*[❗] لازم تكتب سبب لل'+command +'*\n\n*—◉ مثال:*\n*' + usedPrefix + command + ' @user [السبب]*');
}

  // جلب بيانات المستخدم من قاعدة البيانات
  const user = global.db.data.users[who] || {};
  const bot = global.db.data.settings[conn.user.jid] || {};

  const sdms = text.replace(/@\d+-?\d* /g, ''); // السبب

  // زيادة عدد التحذيرات
  user.warn = user.warn || 0;
  user.warn += 1;

  // حفظ البيانات في قاعدة البيانات
  global.db.data.users[who] = user;

  // جلب اسم الأدمن الذي قام بالتحذير
  const name = await conn.getName(m.sender);

  // رسالة التحذير داخل الجروب مع الصورة والكابشن
  await conn.sendMessage(m.chat, {
    image: { url: pp }, // الصورة الجديدة
    caption: `
⚠️ *تحذيرات المستخدم* ⚠️

▢ *الأدمن:* ${name}
▢ *المستخدم:* @${who.split`@`[0]}
▢ *التحذيرات:* ${user.warn}/3
▢ *السبب:* ${sdms}

لازم تلتزم بالقواعد 👀

لو خدت *${3 - user.warn}* تحذيرات زيادة، هتطرد من الجروب
`,
    mentions: [who],
  });

  // إرسال رسالة خاصة للمستخدم مع الصورة
  await conn.sendMessage(who, {
    image: { url: ppPrivate }, // الصورة الخاصة
    caption: `⚠️ لقد تلقيت تحذيراً في الجروب بسبب: ${sdms}\nعدد التحذيرات الحالية: ${user.warn}/3\nالتزم بالقواعد لتجنب الطرد.`,
  });

  // التعامل مع تجاوز 3 تحذيرات
  if (user.warn >= 3) {
    if (!bot.restrict) {
      return m.reply(
        '*[❗𝐈𝐍𝐅𝐎❗] المالك لم يقم بتفعيل الطرد، يرجى التواصل معه لتفعيلها*'
      );
    }

    // جلب بيانات المجموعة للتأكد من أن البوت أدمن
    try {
      const groupMetadata = await conn.groupMetadata(m.chat); // جلب بيانات المجموعة
      const botIsAdmin = groupMetadata?.participants.some(p => p.id === conn.user.jid && p.admin === 'admin');
      
      if (!botIsAdmin) {
        return m.reply('⚠️ البوت ليس أدمن في هذه المجموعة ولا يمكنه طرد الأعضاء.');
      }

      // إعادة تعيين عدد التحذيرات
      user.warn = 0;

      m.reply(`⛔ المستخدم وصل لحد التحذيرات *3*، وبالتالي هيتعمل إعادة ضبط للتحذيرات.`);

      await time(3000); // انتظار 3 ثوانٍ

      // محاولة طرد العضو
      await conn.groupParticipantsUpdate(m.chat, [who], 'remove');

      // إرسال رسالة تأكيد الطرد
      m.reply(`♻️ تم طردك من الجروب *${groupMetadata.subject}* لأنك اخدت *3* تحذيرات`, who);
    } catch (error) {
      console.error('فشل في جلب بيانات المجموعة أو طرد العضو:', error);
      return m.reply('⚠️ حدث خطأ أثناء محاولة جلب بيانات المجموعة أو طرد المستخدم. تأكد أن البوت لديه صلاحيات الأدمن.');
    }
  }

  return !1;
};

handler.command = /^(advertir|انذار|تحذير|warn)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;