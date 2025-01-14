import { canLevelUp } from '../lib/levelling.js'
import canvafy from 'canvafy'

export async function before(m) {
    let user = global.db.data.users[m.sender]
    if (!user.autolevelup)
        return !0
    let before = user.level * 1
    while (canLevelUp(user.level, user.exp, global.multiplier))
        user.level++

    // تعديل الرتب لتناسب جو العصابات
    if (user.level <= 2) {
        user.role = 'عضو عصابة مبتدئ🕵️‍♂️'
    } else if (user.level <= 4) {
        user.role = 'مسجل في العصابة🔫'
    } else if (user.level <= 6) {
        user.role = 'مقاتل عصابة💣'
    } else if (user.level <= 8) {
        user.role = 'رجل عصابة مخضرم🔪'
    } else if (user.level <= 10) {
        user.role = 'مساعد رئيس العصابة🎩'
    } else if (user.level <= 12) {
        user.role = 'رئيس عصابة صغير⚡'
    } else if (user.level <= 14) {
        user.role = 'زعيم عصابة سري🔒'
    } else if (user.level <= 16) {
        user.role = 'مجرم محترف💀'
    } else if (user.level <= 18) {
        user.role = 'أمير العصابة👑'
    } else if (user.level <= 20) {
        user.role = 'زعيم عصابة كبير💼'
    } else if (user.level <= 22) {
        user.role = 'اليد اليمنى للزعيم🖤'
    } else if (user.level <= 24) {
        user.role = 'زعيم عصابة قوي⚔️'
    } else if (user.level <= 26) {
        user.role = 'إمبراطور العصابات👹'
    } else if (user.level <= 28) {
        user.role = 'ملك العصابات🌑'
    } else if (user.level <= 30) {
        user.role = 'حاكم الجريمة🏙️'
    } else if (user.level <= 32) {
        user.role = 'إله الجريمة👁️'
    } else if (user.level <= 34) {
        user.role = 'زعيم الظلال🖤'
    } else if (user.level <= 36) {
        user.role = 'أعلى مستوى في العصابة💎'
    } else if (user.level <= 38) {
        user.role = 'نجم الجريمة💥'
    } else if (user.level <= 40) {
        user.role = 'ملك الجريمة الكبرى🖤'
    } else if (user.level <= 42) {
        user.role = 'أمير الظلام🌙'
    } else if (user.level <= 44) {
        user.role = 'زعيم الجريمة الدولية🌎'
    } else if (user.level <= 46) {
        user.role = 'الوحش الأزرق💀'
    } else if (user.level <= 48) {
        user.role = 'نقيب الجريمة⚠️'
    } else if (user.level <= 50) {
        user.role = 'ملك الإجرام 🏰'
    } else if (user.level <= 52) {
        user.role = 'سيد العصابات🎩'
    } else if (user.level <= 54) {
        user.role = 'أمير الجريمة الكبرى💥'
    } else if (user.level <= 56) {
        user.role = 'زعيم الإمبراطورية الجريمة🦹‍♂️'
    } else if (user.level <= 58) {
        user.role = 'ملك الجرائم المظلمة👑'
    } else if (user.level <= 60) {
        user.role = 'سيد الجريمة🖤'
    } else if (user.level <= 62) {
        user.role = 'إمبراطور الفوضى👁️'
    } else if (user.level <= 64) {
        user.role = 'ملك الظلال🖤'
    } else if (user.level <= 66) {
        user.role = 'أب الفوضى👹'
    } else if (user.level <= 68) {
        user.role = 'زعيم اللصوص👾'
    } else if (user.level <= 70) {
        user.role = 'إمبراطور السرقة💎'
    } else if (user.level <= 72) {
        user.role = 'ملك الجريمة المظلمة🌑'
    } else if (user.level <= 74) {
        user.role = 'زعيم العصابة الكبرى💣'
    } else if (user.level <= 76) {
        user.role = 'ملك الجريمة الأخير⚔️'
    } else if (user.level <= 80) {
        user.role = 'الإمبراطور الجهنمي🔥'
    } else if (user.level <= 84) {
        user.role = 'إله العالم السفلي💀'
    } else if (user.level <= 88) {
        user.role = 'ملك الجريمة الأبدي💀'
    } else if (user.level <= 100) {
        user.role = 'الزعيم المطلق للعصابات👑'
    }

    if (before !== user.level) {
        let ini_txt = `🧞*مستوى جديد، القائد!*\n🧞*الرتبة: ${user.role}*\n🧞*المستوى: ${before} → ${user.level}*\n🧞💀*لن يوقفك أحد!*\n🧞𝑻𝑬𝑹𝑩𝑶〔⚡️〕𝑩𝑶𝑻`.trim()
        let nama = await conn.getName(m.sender)
        let status = user.premium ? 'Premium' : 'Free'
        try {
            let image, data, pp
            try {
                pp = await this.profilePictureUrl(m.sender, 'image')
            } catch {
                pp = 'https://i.ibb.co/m53WF9N/avatar-contact.png'
            }
            image = await new canvafy.LevelUp()
                .setAvatar(pp)
                .setBackground("image", "https://telegra.ph/file/2f2c737d63d0e62014701.jpg")
                .setUsername(nama)
                .setBorder("#000000")
                .setAvatarBorder("#ff0000")
                .setOverlayOpacity(0.7)
                .setLevels(before, user.level)
                .build();
            await this.sendMessage(m.chat, { image: image, caption: ini_txt }, { quoted: m })
        } catch {
            await m.reply(ini_txt)
        }
    }
}

export const disabled = false