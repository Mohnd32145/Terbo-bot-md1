import fetch from 'node-fetch';

let handler = async (m, { conn, text, command, usedPrefix }) => {
  const url = text;

  // التحقق من وجود رابط
  if (!url) {
    return m.reply(`هذا الأمر خاص بتحميل الفيديوهات من جميع المنصات. مثال:\n${usedPrefix + command} *رابط الفيديو*`);
  }

  let website;

  // تحديد المنصة بناءً على الرابط المدخل
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    website = 'yt'; // YouTube
  } else if (url.includes("facebook.com")) {
    website = 'fb'; // Facebook
  } else if (url.includes("instagram.com")) {
    website = 'ig'; // Instagram
  } else if (url.includes("vt.tiktok.com") || url.includes("tiktok.com")) {
    website = 'tt'; // TikTok
  } else {
    return m.reply(`هذه المنصة غير مدعومة. المنصات المتاحة حاليًا هي:\nYouTube, Facebook, Instagram, TikTok.`);
  }

  await m.reply(`جاري تحميل الفيديو... 🔮`);

  try {
    // استدعاء API لتحميل الفيديو
    let apires = await fetch(`https://jo-animi-apis-for-devs.vercel.app/api/dl?url=${encodeURIComponent(url)}&from=${website}`);
    let res = await apires.json();

    if (res.error) {
      return m.reply(`حدث خطأ: ${res.error}`);
    }

    let title = res.title;
    let videoUrl = res.result;

    // إرسال الفيديو
    await conn.sendFile(m.chat, videoUrl, '', title, m);
  } catch (error) {
    console.error(error); // تسجيل الخطأ للمراجعة
    return m.reply(`حدث عطل في الخادم 😔 يرجى المحاولة لاحقًا.`);
  }
};

handler.help = ["سناب", "تحميل"];
handler.tags = ["down"];
handler.command = /^(snaptube|تحميل)$/i;

export default handler;