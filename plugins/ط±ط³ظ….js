    import fetch from 'node-fetch'; // أو const fetch = require('node-fetch');

let handler = async (m, { conn, args }) => {
  const cc = "> © شاورما ";
  let response = args.join(' ').split('|');
  if (!args[0]) throw 'ضيف نص أو صورة';

  let res = `https://shadowz-api.vercel.app/ai/text2img?text=${encodeURIComponent(response[0])}`;
  
  try {
    let fetchResponse = await fetch(res);
    if (!fetchResponse.ok) throw `خطأ في الوصول إلى API: ${fetchResponse.statusText}`;
    
    let imageBuffer = await fetchResponse.buffer();
    await conn.sendFile(m.chat, imageBuffer, 'Shadow.jpg', cc, m, false);
  } catch (error) {
    console.error(error);
    throw 'حدث خطأ أثناء محاولة جلب الصورة.';
  }
};

handler.help = ['Shadow'];
handler.tags = ['Shadow'];
handler.command = /^(رسم|ارسم|ارسمي)$/i;

export default handler;