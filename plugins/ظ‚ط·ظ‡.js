import fetch from 'node-fetch' 
 let handler  = async (m, { conn, text }) => { 
 try { 
 let res = await fetch('https://cataas.com/cat') 
 let img = await res.buffer() 
 let caption = ` 
 قولي شكرا بقا😂💕
 `.trim() 
 conn.sendFile(m.chat, img, 'cat.jpg', caption, m) 
 } catch (e) { 
 console.log(e) 
 throw '*اسف حدث خطا🤕!*' 
 }} 
 handler.help = ['✓ ◡̈⃝ ✓│قطه🧸💜'] 
 handler.tags = ['game'] 
 handler.command = /^قط|قطة|قطه$/i 
 handler.fail = null 
 export default handler
