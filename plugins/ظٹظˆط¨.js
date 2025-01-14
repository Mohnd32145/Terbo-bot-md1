import axios from 'axios';
import yts from 'yt-search';
import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
  if (!args[0]) throw '*✨💜 ضيف رابط الفيديو أو اسم الفيديو اللي انت عاوز تحمله، يا حب*';

  try {
    let query = args.join(' ');
    let isUrl = query.startsWith('http');
    let video;

    if (isUrl) {
      // إذا كان الرابط
      video = await yts({ videoId: query.split('v=')[1] });
    } else {
      // إذا كان نص بحث
      let searchResults = await yts(query);
      if (!searchResults || !searchResults.videos.length) throw '*⚠️ لم يتم العثور على نتائج.*';
      video = searchResults.videos[0];
    }

    let { title, videoId, url, thumbnail, duration, views, timestamp } = video;

    // تحميل الفيديو عبر API
    let apiUrl = `https://api.lolhuman.xyz/api/ytvideo2?apikey=${lolkeysapi}&url=${url}`;
    let response = await axios.get(apiUrl);
    let downloadLink = response.data?.result?.link;

    if (!downloadLink) throw '*⚠️ لا يمكن العثور على رابط التحميل.*';

    // تحميل الصورة المصغرة باستخدام node-fetch
    let thumbnailBuffer = await (await fetch(thumbnail)).buffer();

    // إرسال الفيديو
    await conn.sendMessage(
      m.chat,
      {
        video: { url: downloadLink },
        fileName: `${title}.mp4`,
        mimetype: 'video/mp4',
        caption: `✨💜 اتفضل الفيديو:\n🔥 *العنوان:* ${title}\n⏱️ *المدة:* ${timestamp}\n👀 *عدد المشاهدات:* ${views}\n📦 *الرابط:* ${url}`,
        thumbnail: thumbnailBuffer,
      },
      { quoted: m }
    );
  } catch (err) {
    console.error('الخطأ:', err);
    throw '*[❗] خطأ، حاول مرة أخرى أو تحقق من الرابط.*';
  }
};

handler.command = /^fgmp4|فيديو|getvid|yt(v|mp4)?|يوب$/i;
export default handler;