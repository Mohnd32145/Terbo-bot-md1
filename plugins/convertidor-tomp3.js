import { toAudio } from '../lib/converter.js'

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ''

  if (!/video|audio/.test(mime)) 
    throw `*يرجى الرد على الفيديو أو الصوت الذي تريد تحويله إلى ملف صوتي باستخدام الأمر ${usedPrefix + command}*`

  let media = await q.download().catch(() => null)
  if (!media) 
    throw '*عذرًا، حدث خطأ أثناء تنزيل الملف. حاول مرة أخرى.*'

  let audio = await toAudio(media, 'mp4').catch(() => null)
  if (!audio || !audio.data) 
    throw '*حدث خطأ أثناء تحويل الفيديو إلى صوت. حاول مرة أخرى.*'

  await conn.sendMessage(m.chat, { audio: audio.data, mimetype: 'audio/mpeg' }, { quoted: m })
}

handler.alias = ['tomp3', 'toaudio']
handler.command = /^(لصوت|صوتي|اغنيه)$/i

export default handler