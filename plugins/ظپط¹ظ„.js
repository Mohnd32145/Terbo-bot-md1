const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language;

  const optionsFull = `_*إعدادات الميزات*_

التفعيل والتعطيل للميزات التالية:

*الترحيب (أدمن)*:
  - ${usedPrefix}تفعيل الترحيب
  - ${usedPrefix}تعطيل الترحيب

--------------------------------

*العام (مالك)*:
  - ${usedPrefix}تفعيل العام
  - ${usedPrefix}تعطيل العام

--------------------------------

*كشف (أدمن)*:
  - ${usedPrefix}تفعيل كشف
  - ${usedPrefix}تعطيل كشف

--------------------------------

*كشف 2 (أدمن)*:
  - ${usedPrefix}تفعيل كشف2
  - ${usedPrefix}تعطيل كشف2

--------------------------------

*سيمسيمي (أدمن)*:
  - ${usedPrefix}تفعيل سيمسيمي
  - ${usedPrefix}تعطيل سيمسيمي

--------------------------------

*مانع الإباحية (أدمن)*:
  - ${usedPrefix}تفعيل مانع_الإباحية
  - ${usedPrefix}تعطيل مانع_الإباحية

--------------------------------

*حذف (أدمن)*:
  - ${usedPrefix}تفعيل حذف
  - ${usedPrefix}تعطيل حذف

--------------------------------

*مضاد الحذف (أدمن)*:
  - ${usedPrefix}تفعيل مضاد_الحذف
  - ${usedPrefix}تعطيل مضاد_الحذف

--------------------------------

*مانع الروابط (أدمن)*:
  - ${usedPrefix}تفعيل مانع_الروابط
  - ${usedPrefix}تعطيل مانع_الروابط

--------------------------------

*مانع الروابط 2 (أدمن)*:
  - ${usedPrefix}تفعيل مانع_الروابط2
  - ${usedPrefix}تعطيل مانع_الروابط2

--------------------------------

*مضاد العرض مرة واحدة (أدمن)*:
  - ${usedPrefix}تفعيل مضاد_العرض_مرة_واحدة
  - ${usedPrefix}تعطيل مضاد_العرض_مرة_واحدة

--------------------------------

*وضع غير لائق (أدمن)*:
  - ${usedPrefix}تفعيل وضع_غير_لائق
  - ${usedPrefix}تعطيل وضع_غير_لائق

--------------------------------

*وضع الأدمن (مالك)*:
  - ${usedPrefix}تفعيل وضع_الأدمن
  - ${usedPrefix}تعطيل وضع_الأدمن

--------------------------------

*الملصقات التلقائية (أدمن)*:
  - ${usedPrefix}تفعيل الملصقات_التلقائية
  - ${usedPrefix}تعطيل الملصقات_التلقائية

--------------------------------

*الأصوات (أدمن)*:
  - ${usedPrefix}تفعيل الأصوات
  - ${usedPrefix}تعطيل الأصوات

--------------------------------

*تقييد (أدمن)*:
  - ${usedPrefix}تفعيل تقييد
  - ${usedPrefix}تعطيل تقييد

--------------------------------

*أصوات البوت (أدمن)*:
  - ${usedPrefix}تفعيل أصوات_البوت
  - ${usedPrefix}تعطيل أصوات_البوت

--------------------------------

*وضع الذكاء الصناعي (أدمن)*:
  - ${usedPrefix}تفعيل وضع_الذكاء_الصناعي
  - ${usedPrefix}تعطيل وضع_الذكاء_الصناعي

--------------------------------

*الاستماع (أدمن)*:
  - ${usedPrefix}تفعيل الاستماع
  - ${usedPrefix}تعطيل الاستماع

--------------------------------

*قراءة تلقائية (أدمن)*:
  - ${usedPrefix}تفعيل قراءة_تلقائية
  - ${usedPrefix}تعطيل قراءة_تلقائية

--------------------------------

*خاص فقط (مالك)*:
  - ${usedPrefix}تفعيل خاص_فقط
  - ${usedPrefix}تعطيل خاص_فقط

--------------------------------

*مجموعات فقط (مالك)*:
  - ${usedPrefix}تفعيل مجموعات_فقط
  - ${usedPrefix}تعطيل مجموعات_فقط

--------------------------------

*حالة فقط (مالك)*:
  - ${usedPrefix}تفعيل حالة_فقط
  - ${usedPrefix}تعطيل حالة_فقط

--------------------------------

*مانع المكالمات (مالك)*:
  - ${usedPrefix}تفعيل مانع_المكالمات
  - ${usedPrefix}تعطيل مانع_المكالمات

--------------------------------

*مانع الخاص (مالك)*:
  - ${usedPrefix}تفعيل مانع_الخاص
  - ${usedPrefix}تعطيل مانع_الخاص

--------------------------------

*وضع العبارات (أدمن)*:
  - ${usedPrefix}تفعيل وضع_العبارات
  - ${usedPrefix}تعطيل وضع_العبارات

--------------------------------

*ألعاب (أدمن)*:
  - ${usedPrefix}تفعيل ألعاب
  - ${usedPrefix}تعطيل ألعاب

--------------------------------

*مانع الأرقام المزيفة (أدمن)*:
  - ${usedPrefix}تفعيل مانع_الأرقام_المزيفة
  - ${usedPrefix}تعطيل مانع_الأرقام_المزيفة
`.trim();

  const isEnable = /فعل/i.test(command);
  const isDisable = /تعطيل/i.test(command);
  if (!isEnable && !isDisable) return await conn.sendMessage(m.chat, { text: optionsFull }, { quoted: m });
  const chat = global.db.data.chats[m.chat];
  const user = global.db.data.users[m.sender];
  const bot = global.db.data.settings[conn.user.jid] || {};
  const type = (args[0] || '').toLowerCase();
  let isAll = false;
  const isUser = false;
  switch (type) {
    case 'الترحيب': // welcome
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn);
          throw false;
        }
      } else if (!(isAdmin || isOwner || isROwner)) {
        global.dfail('admin', m, conn);
        throw false;
      }
      chat.welcome = isEnable;
      break;
    case 'كشف': // detect
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn);
          throw false;
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn);
        throw false;
      }
      chat.detect = isEnable;
      break;
    case 'كشف2': // detect2
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn);
          throw false;
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn);
        throw false;
      }
      chat.detect2 = isEnable;
      break;
    case 'سيمسيمي': // simsimi
      if (m.isGroup) {
        if (!(isAdmin || isROwner || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.simi = isEnable;
      break;
    case 'مانع_إباحية': // antiporno
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antiporno = isEnable;
      break;
    case 'حذف': // delete
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.delete = isEnable;
      break;
    case 'مضاد_الحذف': // antidelete
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antidelete = isEnable;
      break;
    case 'عام': // public
      isAll = true;
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      global.opts['self'] = !isEnable;
      break;
    case 'مانع_الروابط': // antilink
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antiLink = isEnable;
      break;
    case 'مانع_الروابط2': // antilink2
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antiLink2 = isEnable;
      break;
    case 'مضاد_العرض_مرة_واحدة': // antiviewonce
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.antiviewonce = isEnable;
      break;
    case 'وضع_غير_لائق': // modohorny
      if (m.isGroup) {
        if (!(isAdmin || isROwner || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.modohorny = isEnable;
      break;
    case 'وضع_الأدمن': // modoadmin
      if (m.isGroup) {
        if (!(isAdmin || isROwner || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.modoadmin = isEnable;
      break;
    case 'الملصقات_التلقائية': // autosticker
      if (m.isGroup) {
        if (!(isAdmin || isROwner || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.autosticker = isEnable;
      break;
    case 'الأصوات': // audios
      if (m.isGroup) {
        if (!(isAdmin || isROwner || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.audios = isEnable;
      break;
    case 'تقييد': // restrict
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.restrict = isEnable;
      break;
    case 'أصوات_البوت': // audios_bot
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.audios_bot = isEnable;
      break;
    case 'وضع_الذكاء_الصناعي': // modoia
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.modoia = isEnable;
      break;
    case 'الاستماع': // nyimak
      isAll = true;
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      global.opts['nyimak'] = isEnable;
      break;
    case 'قراءة_تلقائية': // autoread
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      bot.autoread2 = isEnable;
      break;
    case 'خاص_فقط': // pconly
    case 'خاص': // privateonly
      isAll = true;
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      global.opts['pconly'] = isEnable;
      break;
    case 'مجموعات_فقط': // gconly
    case 'مجموعات': // grouponly
      isAll = true;
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      global.opts['gconly'] = isEnable;
      break;
    case 'حالة_فقط': // swonly
    case 'حالة': // statusonly
      isAll = true;
      if (!isROwner) {
        global.dfail('rowner', m, conn);
        throw false;
      }
      global.opts['swonly'] = isEnable;
      break;
    case 'مانع_المكالمات': // anticall
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.antiCall = isEnable;
      break;
    case 'مانع_الخاص': // antiprivado
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.antiprivado = isEnable;
      break;
    case 'وضع_العبارات': // modejadibot
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.modejadibot = isEnable;
      break;
    case 'ألعاب': // juegos
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.juegos = isEnable;
      break;
    case 'مانع_الأرقام_المزيفة': // antifake
      isAll = true;
      if (!(isROwner || isOwner)) {
        global.dfail('owner', m, conn);
        throw false;
      }
      bot.antifake = isEnable;
      break;
    default:
      return await conn.sendMessage(m.chat, { text: optionsFull }, { quoted: m });
  }
  conn.sendMessage(m.chat, {
    text: `_*تم تغيير الإعدادات بنجاح*_\n\n*تم ${isEnable ? 'تفعيل' : 'تعطيل'} ${type}* بنجاح.`,
  }, { quoted: m });
};

handler.command = /^(فعل|تعطيل)$/i;
export default handler;