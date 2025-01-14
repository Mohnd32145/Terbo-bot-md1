import ws from 'ws'

async function handler(m, { conn: stars, usedPrefix }) {
  let uniqueUsers = new Map()

  global.conns.forEach((conn) => {
    if (conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED) {
      uniqueUsers.set(conn.user.jid, conn)
    }
  })

  let users = [...uniqueUsers.values()]

  let message = users.map((v, index) => `*${index + 1}.-* @${v.user.jid.replace(/[^0-9]/g, '')}\n*الرابط:* https://wa.me/${v.user.jid.replace(/[^0-9]/g, '')}\n*الاسم:* ${v.user.name || '-'}`).join('\n\n')
  
  let replyMessage = message.length === 0 ? '' : message
  let totalUsers = users.length
  let responseMessage = `*إجمالي البوتات* : ${totalUsers || '0'}\n\n${replyMessage.trim()}`.trim()

  await stars.sendMessage(m.chat, { text: responseMessage, mentions: stars.parseMention(responseMessage) }, { quoted: m })
}

handler.command = ['البوتات', 'بوتات']
handler.help = ['bots']
handler.tags = ['serbot']
export default handler