import fetch from 'node-fetch';

const handler = async (m, { command, usedPrefix, conn, args, text }) => {

    if (!text) {
        await conn.sendMessage(m.chat, { text: `*❲ ❗ ❳ يرجي إدخال اسم التطبيق للبحث في التطبيقات .*` }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
        return;
    }

    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    try {
        let res = await fetch(`https://api-streamline.vercel.app/dlapk?search=${encodeURIComponent(text)}`);
        let result = await res.json();

        const {
            name,
            package: packageName,
            size,
            icon,
            added,
            updated,
            developer: { name: developerName },
            store: { name: storeName },
            stats: { downloads },
            file: { path: filepath, filesize }
        } = result;

        const appsize = (parseInt(size) / (1024 * 1024)).toFixed(2) + ' MB';

        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

        if (!filepath) {
            await conn.reply(m.chat, '[ ⚠️ ] لم أستطع العثور على رابط تحميل التطبيق، حاول باستخدام اسم آخر.', m);
            await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
            return;
        }

        let cap = `
*◈─┄┄┄┄〘 تحميل التطبيقات 〙┄┄┄┄─◈*

- ◉ الاسم: 〘 ${name} 〙
- ◉ الحزمة: 〘 ${packageName} 〙
- ◉ الحجم: 〘 ${appsize} 〙
- ◉ التحميلات: 〘 ${downloads} 〙
- ◉ الصانع: 〘 ${developerName} 〙
- ◉ المتجر: 〘 ${storeName} 〙
- ◉ الرفع: 〘 ${added} 〙
- ◉ التحديث: 〘 ${updated} 〙

> جاري تحميل تطبيقك ...
        `;

        await conn.sendMessage(m.chat, { image: { url: icon }, fileName: `${name}.png`, caption: cap }, { quoted: m });

        await conn.sendMessage(m.chat, {
            document: { url: filepath },
            mimetype: 'application/vnd.android.package-archive',
            fileName: `${name}.apk`,
            caption: `\nالتطبيق: ${name}\nالحجم: ${appsize}\n`
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '👌🏻', key: m.key } });

    } catch (error) {
        await conn.reply(m.chat, '[ ⚠️ ] حدث خطأ أثناء محاولة تحميل التطبيق، حاول مرة أخرى لاحقًا.', m);
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }
};

handler.command = /^(تطبيق)$/i;
export default handler;