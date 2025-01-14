import fetch from 'node-fetch'; // Importing the library for HTTP requests
const handler = (m) => m;

handler.before = async (m) => {
  const chat = global.db.data.chats[m.chat]; // Retrieve chat settings
  if (chat.simi) { // Check if AI functionality is enabled
    if (/^.*false|disnable|(turn)?off|0/i.test(m.text)) return; // Ignore if disabled
    let messageText = m.text; // Store the message text

    // Filter specific keywords to ignore
    if (
      m.text.includes('بوت') || 
      m.text.includes('القائمة') || 
      m.text.includes('تشغيل') || 
      m.text.includes('حالة') || 
      m.text.includes('مساعدة')
    ) return;

    try {
      await conn.sendPresenceUpdate('composing', m.chat); // Show "typing" status

      // Send the text to the primary AI API
      let gpt = await fetch(`https://deliriusapi-official.vercel.app/tools/simi?text=${encodeURIComponent(messageText)}`);
      let res = await gpt.json(); // Parse the response
      await m.reply(res.data.message); // Reply to the user with the generated message
    } catch (error) {
      // Use an alternative API in case of failure
      try {
        // Translate the text to English before sending it (if the first API fails)
        const translation = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(messageText)}`
        );
        const translationResult = await translation.json();
        const senderName = m.pushName || 'User';
        
        // Send the translated text to another AI API
        const aiResponse = await fetch(
          `http://api.brainshop.ai/get?bid=153868&key=rcKonOgrUFmn5usX&uid=${senderName}&msg=${translationResult[0][0][0]}`
        );
        const aiResult = await aiResponse.json();
        
        // Translate the response back to Arabic
        const translateToArabic = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ar&dt=t&q=${encodeURIComponent(aiResult.cnt)}`
        );
        const arabicResponse = await translateToArabic.json();

        // Reply to the user with the Arabic response
        await m.reply(arabicResponse[0][0][0]);
      } catch (error) {
        await m.reply('عذرًا، حدث خطأ أثناء معالجة طلبك.'); // Send an error message
      }
    }
    return true;
  }
  return true;
};

export default handler;