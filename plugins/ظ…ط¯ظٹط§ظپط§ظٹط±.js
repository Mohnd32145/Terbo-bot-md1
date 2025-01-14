const axios = require('axios');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { mediafiredl } = require('@bochilteam/scraper');

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const sticker = 'https://qu.ax/Wdsb.webp';
  const wm = 'Mediafire Bot';
  const vs = '1.0.0';
  const img = { getRandom: () => 'https://example.com/default-thumbnail.jpg' };
  const redes = { getRandom: () => 'https://example.com' };

  if (!args[0]) {
    return conn.reply(m.chat, `⚠️ عايز رابط صحيح من Mediafire، مثال:\n${usedPrefix + command} https://www.mediafire.com/file/cv64tns6co3272q/Lolibot.zip/file`, m, { contextInfo: { externalAdReply: { mediaUrl: null, mediaType: 1, description: null, title: wm, previewType: 0, thumbnail: img.getRandom(), sourceUrl: redes.getRandom() } } });
  }

  m.react(`🚀`);

  try {
    const res = await fetch(`https://delirius-api-oficial.vercel.app/api/mediafire?url=${args[0]}`);
    if (!res.ok) throw new Error(`خطأ في HTTP! الحالة: ${res.status}`);
    const data = await res.json();
    const fileData = data.data;
    const caption = `┏━━『 𝐌𝐄𝐃𝐈𝐀𝐅𝐈𝐑𝐄 』━━•\n┃❥ اسم الملف :\n┃${fileData.filename}\n┃——————«•»——————\n┃❥ الحجم :\n┃${fileData.size}\n\n┃——————«•»——————\n┃❥ النوع :\n┃${fileData.mime}\n╰━━━⊰ 𓃠 ${vs} ⊱━━━━•\n\n> ⏳ استنى شوية علشان تحمل الملف`.trim();
    m.reply(caption);
    await conn.sendFile(m.chat, fileData.link, fileData.filename, '', m, null, { mimetype: fileData.mime, asDocument: true });
    m.react(`✅`);
  } catch (error) {
    console.error('API Error:', error.message);
    try {
      const resEX = await mediafiredl(args[0]);
      const captionES = `┏━━『 𝐌𝐄𝐃𝐈𝐀𝐅𝐈𝐑𝐄 』━━•\n┃❥ اسم الملف :\n┃${resEX.filename}\n┃——————«•»——————\n┃❥ الحجم :\n┃ ${resEX.filesizeH}\n\n┃——————«•»——————\n┃❥ النوع :\n┃${resEX.ext}\n\n╰━━━⊰ 𓃠 ${vs} ⊱━━━━•\n\n> ⏳ استنى شوية علشان تحمل الملف`.trim();
      m.reply(captionES);
      await conn.sendFile(m.chat, resEX.url, resEX.filename, '', m, null, { mimetype: resEX.ext, asDocument: true });
      m.react(`✅`);
    } catch (error) {
      console.error('Mediafiredl Error:', error.message);
      try {
        const res = await mediafireDl(args[0]);
        const { name, size, mime, link } = res;
        const caption = `┏━━『 𝐌𝐄𝐃𝐈𝐀𝐅𝐈𝐑𝐄 』━━•\n┃❥ اسم الملف :\n┃${name}\n┃——————«•»——————\n┃❥ الحجم :\n┃${size}\n\n┃——————«•»——————\n┃❥ النوع :\n┃${mime}\n\n╰━━━⊰ 𓃠 ${vs} ⊱━━━━•\n\n> ⏳ استنى شوية علشان تحمل الملف`.trim();
        m.reply(caption);
        await conn.sendFile(m.chat, link, name, '', m, null, { mimetype: mime, asDocument: true });
        m.react(`✅`);
      } catch (error) {
        console.error('Fallback Error:', error.message);
        conn.sendFile(m.chat, sticker, 'error.webp', '', m, null, { asDocument: false });
        m.react(`❌`);
      }
    }
  }
};

handler.help = ['mediafire', 'mediafiredl'];
handler.tags = ['downloader'];
handler.command = /^(ميديا_فاير|ميديافاير|ميديا-فاير)$/i;
handler.register = true;
handler.limit = 3;

export default handler;

async function mediafireDl(url) {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    const link = $('#downloadButton').attr('href');
    const name = $('#downloadButton').text().trim();
    const size = $('#downloadButton').next().text().trim();
    const mime = (await axios.head(link)).headers['content-type'];
    return { name, size, mime, link };
  } catch (error) {
    throw new Error('Error while fetching Mediafire data');
  }
}