import similarity from 'similarity';

const threshold = 0.72;

export async function before(context) {
    const { chat, quoted, text, sender } = context;

    // تحقق من الشروط الأساسية
    if (
        !quoted || 
        !quoted.fromMe || 
        !quoted.text || 
        !text || 
        !/استخدم.*استسلم/i.test(quoted.text)
    ) {
        return true;
    }

    this.tebakbendera = this.tebakbendera || {};

    // تحقق من وجود الجلسة
    if (!(chat in this.tebakbendera)) {
        return this.reply(chat, '*🗿 السؤال خلص يا احول*', context);
    }

    const gameData = this.tebakbendera[chat];
    const correctAnswer = gameData[1].toLowerCase().trim();

    // تحقق من الرد المطابق
    if (quoted.id === gameData[0].id) {
        if (/^(استسلم|surrender)$/i.test(text)) {
            clearTimeout(gameData[3]);
            delete this.tebakbendera[chat];
            return this.reply(chat, '*طلع فاشل و استسلم :( !*', context);
        }

        if (text.toLowerCase().trim() === correctAnswer) {
            global.db.data.users[sender].exp += gameData[2];
            this.reply(chat, `*اجـابـة صـحـيـحـة✅ ❯*\n+${gameData[2]} دولار`, context);
            clearTimeout(gameData[3]);
            delete this.tebakbendera[chat];
        } else if (similarity(text.toLowerCase(), correctAnswer) >= threshold) {
            this.reply(chat, '❗ *اقتربت من الاجابة!*', context);
        } else {
            this.reply(chat, '*اجـابـة خـاطـئـة❌ ❯*', context);
        }
    }

    return true;
}