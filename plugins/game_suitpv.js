const handler = (m) => m;
handler.before = async function(m) {
  this.suit = this.suit ? this.suit : {};
  if (db.data.users[m.sender].suit < 0) db.data.users[m.sender].suit = 0;
  const room = Object.values(this.suit).find((room) => room.id && room.status && [room.p, room.p2].includes(m.sender));
  if (room) {
    let win = '';
    let tie = false;
    if (m.sender == room.p2 && /^(نعم|يب|اقبل|اوك|اك|تمام)/i.test(m.text) && m.isGroup && room.status == 'wait') {
      if (/^(لا|ارفض|مشعاوز)/i.test(m.text)) {
        const textno = `⌯ @${room.p2.split`@`[0]} رفض تم الغاء اللعبه `;
        m.reply(textno, null, {mentions: this.parseMention(textno)});
        delete this.suit[room.id];
        return !0;
      }
      room.status = 'play';
      room.asal = m.chat;
      clearTimeout(room.waktu);
      const textplay = `⌯ بدات اللعبة 🎮\n\n1⌯ ادخل شات البوت\n2⌯ اختار القرعه @${room.p.split`@`[0]} 𝚈 @${room.p2.split`@`[0]}\n\n⌯اذا تاخر احد اللاعبين تنتهي اللعبة\n⌯ شات البوت : wa.me/${conn.user.jid.split`@`[0]}`;
      m.reply(textplay, m.chat, {mentions: this.parseMention(textplay)});
      const comienzop = `🌟 اختر قبل اللاعب الاخر\n⌯ حجر\n⌯ ورقه\n⌯ مقص\nالنقاط +${room.poin} خبرة\n${room.poin_lose} خبرة\n
`;
      const comienzop2 = `*اختار قبل الاعب الاخر*
حجر
ورقه
مقص\nالنقاط +${room.poin} خبرة\n${room.poin_lose} خبرة\n`;

      if (!room.pilih) this.sendMessage(room.p, {text: comienzop}, {quoted: m});
      if (!room.pilih2) this.sendMessage(room.p2, {text: comienzop2}, {quoted: m});
      room.waktu_milih = setTimeout(() => {
        const iniciativa = `⌯ لقد اختار الاعب الاخر قبلك اسرع ⚡`;
        if (!room.pilih && !room.pilih2) this.sendMessage(m.chat, {text: iniciativa}, {quoted: m});
        else if (!room.pilih || !room.pilih2) {
          win = !room.pilih ? room.p2 : room.p;
          const textnull = `⌯ @${(room.pilih ? room.p2 : room.p).split`@`[0]} لقد تأخر الاعب الاخر قبلك اسرع ⚡`;
          this.sendMessage(m.chat, {text: textnull}, {quoted: m}, {mentions: this.parseMention(textnull)});
          db.data.users[win == room.p ? room.p : room.p2].exp += room.poin;
          db.data.users[win == room.p ? room.p : room.p2].exp += room.poin_bot;
          db.data.users[win == room.p ? room.p2 : room.p].exp -= room.poin_lose;
        }
        delete this.suit[room.id];
        return !0;
      }, room.timeout);
    }
    const jwb = m.sender == room.p;
    const jwb2 = m.sender == room.p2;
    const g = /تعادل/i;
    const b = /الفائز/i;
    const k = /الخاسر/i;
    const reg = /^(حجر|ورقه|مقص)/i;
    if (jwb && reg.test(m.text) && !room.pilih && !m.isGroup) {
      room.pilih = reg.exec(m.text.toLowerCase())[0];
      room.text = m.text;
      m.reply(`*[ ✔ ] تم ${m.text}  ${room.pilih2 ? `انتظر الاعب الاخر` : 'في الجروب'}`);
      if (!room.pilih2) this.reply(room.p2, '⌯ لقد اختار الخصم، حان دورك للاختيار ⚡', 0);
    }
    if (jwb2 && reg.test(m.text) && !room.pilih2 && !m.isGroup) {
      room.pilih2 = reg.exec(m.text.toLowerCase())[0];
      room.text2 = m.text;
      m.reply(`*[ ✔ ]  ${m.text},\n${room.pilih ? `⌯ النتائج في الجروب` : '⌯ انتظر اللاعب الاخر'}`);
      if (!room.pilih) this.reply(room.p, '⌯لقد اختار الخصم، حان دورك للاختيار ⚡', 0);
    }
    const stage = room.pilih;
    const stage2 = room.pilih2;
    if (room.pilih && room.pilih2) {
      clearTimeout(room.waktu_milih);
      if (b.test(stage) && g.test(stage2)) win = room.p;
      else if (b.test(stage) && k.test(stage2)) win = room.p2;
      else if (g.test(stage) && k.test(stage2)) win = room.p;
      else if (g.test(stage) && b.test(stage2)) win = room.p2;
      else if (k.test(stage) && b.test(stage2)) win = room.p;
      else if (k.test(stage) && g.test(stage2)) win = room.p2;
      else if (stage == stage2) tie = true;
      this.reply(room.asal, `⌯ النتائج : ${tie ? '\n⌯ تعادل 😐' : ''}
*@${room.p.split`@`[0]} (${room.text}) ${tie ? '' : room.p == win ? `  +${room.poin} خبرة` : `  ${room.poin_lose} خبرة*`}
@${room.p2.split`@`[0]} (${room.text2}) ${tie ? '' : room.p2 == win ? `  +${room.poin} خبرة` : `  ${room.poin_lose} خبرة`}
`.trim(), m, {mentions: [room.p, room.p2]} );
      if (!tie) {
        db.data.users[win == room.p ? room.p : room.p2].exp += room.poin;
        db.data.users[win == room.p ? room.p : room.p2].exp += room.poin_bot;
        db.data.users[win == room.p ? room.p2 : room.p].exp += room.poin_lose;
      }
      delete this.suit[room.id];
    }
  }
  return !0;
};
handler.exp = 0;
export default handler;
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}