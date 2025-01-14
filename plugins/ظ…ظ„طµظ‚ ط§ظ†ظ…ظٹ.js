import { sticker } from '../lib/sticker.js';
import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  try {
    // إضافة المستخدم المقتبس إلى قائمة الإشارة
    if (m.quoted?.sender) m.mentionedJid.push(m.quoted.sender);

    // إذا لم يتم الإشارة إلى أحد، يتم إضافة المرسل
    if (!m.mentionedJid.length) m.mentionedJid.push(m.sender);

    // جلب رابط الصورة من API
    let res = await fetch('https://api.waifu.pics/sfw/pat');
    if (!res.ok) throw new Error('خطأ في الاتصال بـ API');

    let json = await res.json();
    let { url } = json;

    // إنشاء الملصق
    let stiker = await sticker(
      null,
      url,
      `+${m.sender.split('@')[0]} 𝐵𝑌:𝑻𝑼𝑹𝑩𝑶﹝⚡️﹞𝑩𝑶𝑻 ${m.mentionedJid
        .map((user) => (user === m.sender ? '𝐵𝑌:𝑻𝑼𝑹𝑩𝑶﹝⚡️﹞𝑩𝑶𝑻' : `+${user.split('@')[0]}`))
        .join(', ')}`
    );

    // إرسال الملصق
    await conn.sendFile(m.chat, stiker, null, { asSticker: true });
  } catch (e) {
    console.error(e);
    m.reply('*[❗] حدث خطأ أثناء إنشاء الملصق. حاول مرة أخرى.*');
  }
};

handler.command = /^(ملصق-انمي)$/i;
export default handler;