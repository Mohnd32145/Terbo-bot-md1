import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'
import MessageType from '@adiwajshing/baileys'
let handler = async (m, { conn}) => {
try {   
if(m.quoted?.sender) m.mentionedJid.push(m.quoted.sender)
if(!m.mentionedJid.length) m.mentionedJid.push(m.sender)
let res = await fetch('https://nekos.life/api/hug')
let json = await res.json()
let { url } = json
let stiker = await sticker(null, url, `+${m.sender.split('@')[0]} 𝐵𝑌:𝑻𝑼𝑹𝑩𝑶﹝⚡️﹞𝑩𝑶𝑻 ${m.mentionedJid.map((user)=>(user === m.sender)? '𝐵𝑌:𝑻𝑼𝑹𝑩𝑶﹝⚡️﹞𝑩𝑶𝑻 ': `+${user.split('@')[0]}`).join(', ')}`)
conn.sendFile(m.chat, stiker, null, { asSticker: true })
} catch (e) { }}
handler.command = /^(استيك-حضن-انمي|حضن-انمي|ملصق-انمي2)$/i
export default handler
