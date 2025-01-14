import { webp2png } from '../lib/webp2mp4.js'

let handler = async (m, { conn, usedPrefix, command }) => {
  const notStickerMessage = `*يرجى الرد على الملصق الذي تريد تحويله إلى صورة باستخدام الأمر ${usedPrefix + command}*`
  
  if (!m.quoted) throw notStickerMessage
  
  const q = m.quoted || m
  let mime = q.mediaType || ''
  
  if (!/sticker/.test(mime)) throw notStickerMessage
  
  let media = await q.download().catch(() => null)
  if (!media) throw '*تعذر تحميل الملصق. حاول مرة أخرى.*'
  
  let out = await webp2png(media).catch(() => null) || Buffer.alloc(0)
  if (out.length === 0) throw '*حدث خطأ أثناء تحويل الملصق إلى صورة.*'
  
  await conn.sendFile(m.chat, out, 'image.png', null, m)
}

handler.help = ['toimg (رد)']
handler.tags = ['sticker']
handler.command = ['لصوره', 'صورة', 'لصورة']

export default handler