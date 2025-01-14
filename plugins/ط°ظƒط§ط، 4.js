import fetch from "node-fetch";
import axios from "axios";
import translate from "@vitalets/google-translate-api";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: global.openai_org_id,
  apiKey: global.openai_key,
});
const openai = new OpenAIApi(configuration);

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `[🤖]⌯ اضف سؤال إلى الذكاء الاصطناعي\n\n⌯ مثال:\n⌯ ${usedPrefix + command} تحدث عن حياة الرسول\n⌯ ${usedPrefix + command} أفضل مواقع تعلم البرمجة بالمجان`;
  }

  try {
    conn.sendPresenceUpdate("composing", m.chat);

    // وظيفة لطلب OpenAI
    const getOpenAIChatCompletion = async (inputText) => {
      const openaiAPIKey = global.openai_key;
      const userMessages = global.chatgpt?.data?.users[m.sender] || [];
      userMessages.push({ role: "user", content: inputText });

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiAPIKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "نانو بوت" },
            ...userMessages,
          ],
        }),
      });

      const result = await response.json();
      return result?.choices?.[0]?.message?.content || null;
    };

    // الحصول على الاستجابة
    let respuesta = await getOpenAIChatCompletion(text);
    if (!respuesta) throw new Error("API Error");
    m.reply(respuesta.trim());
  } catch (e) {
    try {
      // المحاولة الثانية: استخدام نموذج آخر
      const botResponse = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        temperature: 0.3,
        max_tokens: 4097,
        stop: ["Ai:", "Human:"],
      });
      const replyText = botResponse.data.choices?.[0]?.text;
      if (!replyText) throw new Error("API Error");
      m.reply(replyText.trim());
    } catch (err) {
      try {
        // المحاولة الثالثة: استخدام واجهات برمجية بديلة
        const fgResponse = await fetch(
          `https://api-fgmods.ddns.net/api/info/openai?text=${text}&apikey=XlwAnX8d`
        );
        const fgJson = await fgResponse.json();
        if (!fgJson?.result) throw new Error("API Error");
        m.reply(fgJson.result.trim());
      } catch (finalError) {
        m.reply(`⌯ حدث خطأ غير متوقع أثناء معالجة طلبك.`);
      }
    }
  }
};

handler.command = /^(سونك|تست|حممم|هوف)$/i;
export default handler;