let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    let response = args.join(' ').split('|')
    if (!text) throw ` *❗لازم تدخل نص مع الأمر* `
    await m.react('🕓')
    try {
        let res = `https://api.lolhuman.xyz/api/textprome/blackpink?apikey=${lolkeysapi}&text=${text}`
        await conn.sendFile(m.chat, res, 'thumbnail.jpg', 'تم', m)
        await m.react('✅')
    } catch {
        await m.react('❌')
    }
}
handler.help = ['blackpink *<نص>*']
handler.tags = ['logo']
handler.command = /^(اسود)$/i
handler.limit = 3
handler.register = true 
export default handler
