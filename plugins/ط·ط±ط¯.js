let handler = async (m, { conn, participants, usedPrefix, command }) => {

    let kickte = `*مــنشـن الـشـخص يا نجم !*`
    let ownerJids = ['201225655220@s.whatsapp.net', '21228616765@s.whatsapp.net'] // أرقام المطورين
    let botNumber = '201016948771@s.whatsapp.net' // رقم البوت اللي ممنوع طرده

    if (!m.mentionedJid[0] && !m.quoted) return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte)}) 
    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender

    if (user === botNumber) {
        return await m.reply(`*أنا أطرّد نفسي! إزاي يعني؟!*`)
    }

    if (ownerJids.includes(user)) {
        return await m.reply(`*عايز تطرد المطور بتاعي! مستحيل طبعًا 😂*`)
    }

    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
    await m.reply(`*مع السلامة يا نجم، تـم الطـرد بأمر من @${m.sender.split('@')[0]}! 😂✌️*`, null, { mentions: [m.sender] }) 
}

handler.help = ['kick @user']
handler.tags = ['group']
handler.command = ['kick', 'طرد', 'كسمو', 'بره', 'خرجو', 'طلعو', 'غورو', 'مشيه'] 
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler