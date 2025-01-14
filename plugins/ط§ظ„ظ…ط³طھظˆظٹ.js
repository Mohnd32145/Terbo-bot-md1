import { canLevelUp, xpRange } from '../src/libraries/levelling.js';
import { levelup } from '../src/libraries/canvas.js';
import fs from 'fs';

const handler = async (m, { conn }) => {
  
  const name = conn.getName(m.sender);
  const usertag = '@' + m.sender.split('@s.whatsapp.net')[0];
  const user = global.db.data.users[m.sender];
  
  if (!canLevelUp(user.level, user.exp, global.multiplier)) {
    const { min, xp, max } = xpRange(user.level, global.multiplier);
    const message = `
مرحبًا بك في نظام التقدم!
أهلاً بك ${usertag}!*

مستواك الحالي هو: ${user.level}
دورك الحالي: ${user.role}
التجربة الحالية: ${user.exp - min}/${xp}

تحتاج إلى ${max - user.exp} نقطة للتقدم إلى المستوى التالي.`.trim();
    
    return conn.sendMessage(m.chat, {text: message, mentions: [m.sender]}, {quoted: m});
  }

  const before = user.level * 1;
  while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++;

  if (before !== user.level) {
    const levelUpMessage = `تهانينا ${name}! لقد وصلت إلى المستوى ${user.level}.`;
    const levelUpDetails = `
تم ترقيتك بنجاح!

مستواك السابق: ${before}
مستواك الحالي: ${user.level}
دورك الحالي: ${user.role}

استمر في التقدم للحصول على المزيد من الميزات!`.trim();

    try {
      const levelUpImage = await levelup(levelUpMessage, user.level);
      conn.sendFile(m.chat, levelUpImage, 'levelup.jpg', levelUpDetails, m);
    } catch (e) {
      conn.sendMessage(m.chat, {text: levelUpDetails, mentions: [m.sender]}, {quoted: m});
    }
  }
};

handler.help = ['levelup'];
handler.tags = ['xp'];
handler.command = ['المستوي'];
export default handler;