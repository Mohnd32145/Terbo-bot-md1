let handler = async (m, { conn }) => {
  if (global.conn.user.jid === conn.user.jid) {
  } else {
    await conn.reply(m.chat, `*تم ايقاف جميع بوتات التنصيب بنجاح...✅*`, m)
    conn.ws.close()
  }
}

handler.help = ['إيقاف']
handler.tags = ['بوت']
handler.command = ['توقف', 'اطفاء', 'وقف']
handler.owner = true

export default handler