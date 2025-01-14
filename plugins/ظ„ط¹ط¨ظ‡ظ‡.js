let timeout = 120000;
let minimumvirus = 2;

import { createRequire } from 'module';
import fetch from 'node-fetch';

const require = createRequire(import.meta.url);
const fs = require('fs');

// إعداد بيانات اللعبة
let فيروسات = {
  isActive: false,
  players: {},
  حقن: 5,
  اصابه: 5,
};

// توثيق افتراضي
let توثيق = {
  key: {
    participants: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
    fromMe: false,
    id: "Halo",
  },
  message: {
    contactMessage: {
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=0:0\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
    },
  },
  participant: "0@s.whatsapp.net",
};

// المعالج الرئيسي
let handler = async (m, { conn, command, text }) => {
  try {
    let args = text.trim().split(/ +/).slice(1);

    switch (command) {
      case 'فيروس':
        if (فيروسات.isActive) {
          return m.reply('اللعبة قيد التشغيل بالفعل.');
        }
        فيروسات.isActive = true;
        فيروسات.players = {};
        m.reply('🚨 تم بدء لعبة الفيروسات! \n\nاكتب:\n- *.اصابه* لإصابة لاعب.\n- *.حقنه* لعلاج لاعب.\n- *.نتيجه* لعرض النتائج.');
        break;

      case 'اصابه':
        if (!فيروسات.isActive) return m.reply('⚠️ لا يوجد لعبة قيد التشغيل حالياً.');
        let playerToInfect = m.quoted ? m.quoted.sender.split('@')[0] : null;
        if (playerToInfect && !فيروسات.players[playerToInfect]) {
          فيروسات.players[playerToInfect] = فيروسات.اصابه;
          m.reply(`👾 تم إصابة اللاعب @${playerToInfect} بـ ${فيروسات.اصابه} فيروسات.`);
        } else {
          m.reply('⚠️ منشن لاعب أو رد على رسالته للإصابة.');
        }
        break;

      case 'حقنه':
        if (!فيروسات.isActive) return m.reply('⚠️ لا يوجد لعبة قيد التشغيل حالياً.');
        let playerToHeal = m.quoted ? m.quoted.sender.split('@')[0] : null;
        if (playerToHeal && فيروسات.players[playerToHeal]) {
          فيروسات.players[playerToHeal]--;
          if (فيروسات.players[playerToHeal] <= 0) {
            delete فيروسات.players[playerToHeal];
            m.reply(`✅ تم شفاء اللاعب @${playerToHeal} بالكامل!`);
          } else {
            m.reply(`💉 تم تقليل الفيروس لدى @${playerToHeal}. الفيروسات المتبقية: ${فيروسات.players[playerToHeal]}.`);
          }
        } else {
          m.reply('⚠️ منشن لاعب أو رد على رسالته للعلاج.');
        }
        break;

      case 'نتيجه':
        if (!فيروسات.isActive) return m.reply('⚠️ اللعبة لم تبدأ بعد.');
        let leaderboard = '*📊 نتائج اللعبة:*\n\n';
        for (let player in فيروسات.players) {
          let virusCount = '👾'.repeat(فيروسات.players[player]);
          leaderboard += `- @${player}: ${virusCount}\n`;
        }
        m.reply(leaderboard || '⚠️ لا يوجد لاعبين حتى الآن.');
        break;

      default:
        m.reply('❌ أمر غير معروف. جرب الأوامر: *.فيروس*، *.اصابه*، *.حقنه*، *.نتيجه*.');
    }
  } catch (error) {
    console.error(error);
    m.reply('❌ حدث خطأ أثناء تنفيذ الأمر.');
  }
};

// خصائص المعالج
handler.command = /^(فيروس|اصابه|نتيجه|حقنه)$/i;
handler.admin = true;
handler.botAdmin = true;

export default handler;