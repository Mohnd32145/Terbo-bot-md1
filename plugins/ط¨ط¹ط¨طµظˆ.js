let handler = async (m, { conn, args }) => {
    if (!m.quoted && !args[0]) throw '*منشن*';
    const mentionedUser = m.quoted
        ? m.quoted.sender
        : args[0]
        ? (args[0].replace(/[@ .+-]/g, '') + '@s.whatsapp.net')
        : '';
    if (!mentionedUser) throw 'تعذر الحصول على منشن المستخدم.';
    let message = `
  *بيبعبص نفسو @${mentionedUser.split('@')[0]} 😂*`.trim();
    conn.sendMessage(m.chat, { text: message, mentions: [mentionedUser] }, { quoted: m });
};
handler.help = ['beauty'];
handler.tags = ['S H A W A R M A'];
handler.command = /^(بعبصو)$/i;
export default handler;