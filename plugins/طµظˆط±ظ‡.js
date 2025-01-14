import { googleImage } from '@bochilteam/scraper';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*[❗خطاء❗] مثال على الأمر ${usedPrefix + command} كانيكي*`;

    // التحقق من الكلمات المحظورة
    const forbiddenKeywords = ['gore', 'cp', 'porno', 'Gore', 'rule', 'CP', 'Rule34'];
    if (forbiddenKeywords.some(keyword => m.text.includes(keyword))) {
        return m.reply('[❗خطاء❗] لا يمكنني إرسال هذا المحتوى، المجموعة محظورة.\nإذا كنت مشرفًا وتريد تنشيطها، اخبر المطور');
    }

    // استعلام عن صورة
    try {
        // إضافة رد فعل مؤقت (🕐) قبل إرسال الصورة
        await conn.sendMessage(m.chat, { react: { text: '🕐', key: m.key } });

        const res = await googleImage(text);
        const image = res[Math.floor(Math.random() * res.length)];
        const link = image;

        await conn.sendFile(m.chat, link, 'result.jpg', `🔎 *النتيجة ل:* ${text}\n🔗 *من* ${link}\n🌎 *محرك البحث:* جوجل`, m);

        // إضافة رد فعل ناجح (✅️) بعد إرسال الصورة
        await conn.sendMessage(m.chat, { react: { text: '✅️', key: m.key } });
    } catch (error) {
        console.error(error);
        m.reply('[❗خطاء❗] حدث خطأ أثناء جلب الصورة، حاول مرة أخرى لاحقاً.');
    }
};

handler.help = ['gimage <query>', 'imagen <query>'];
handler.tags = ['internet', 'tools'];
handler.command = /^(gimage|image|صوره|imagen)$/i;

export default handler;