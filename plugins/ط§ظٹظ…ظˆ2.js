import { sticker } from '../lib/sticker.js';
import { EmojiAPI } from 'emoji-api';
const emoji = new EmojiAPI();

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let er = `
*[❗] الاستخدام الصحيح للأمر*
*◉ ${usedPrefix + command} <نوع> <إيموجي>*

*—◉ مثال:*
*◉ ${usedPrefix + command} فيس 😎*

*—◉ اختصارات*
- ابل/تفاحه
- فيسبوك/فيس
- جوجل/جو
- واتساب/واتس
`;

    if (!args[0] || !args[1]) throw er;

    let template = args[0].toLowerCase();
    let emojiInput = args[1];

    try {
        let emojiData = await emoji.get(emojiInput);
        if (!emojiData.images || !emojiData.images.length) throw '*[❗] لم يتم العثور على الإيموجي المطلوب.*';

        let url;
        switch (template) {
            case 'ابل':
            case 'تفاحه':
                url = emojiData.images[0].url;
                break;
            case 'فيسبوك':
            case 'فيس':
                url = emojiData.images[6]?.url || emojiData.images[0].url;
                break;
            case 'جوجل':
            case 'جو':
                url = emojiData.images[1]?.url || emojiData.images[0].url;
                break;
            case 'واتساب':
            case 'واتس':
                url = emojiData.images[4]?.url || emojiData.images[0].url;
                break;
            default:
                throw '*[❗] نوع غير مدعوم.*';
        }

        let stiker = await sticker(false, url, global.packname || '', global.author || '');
        await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, { asSticker: true });

    } catch (e) {
        console.error(e);
        throw `*[❗] حدث خطأ أثناء إنشاء الملصق: ${e.message || e}*`;
    }
};

handler.help = ['emoji <type> <emoji>'];
handler.tags = ['sticker'];
handler.command = ['emoji', 'smoji', 'ايموجي2'];

export default handler;