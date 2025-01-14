import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync, readFileSync } from 'fs';
import path from 'path';

const handler = async (m, { conn, usedPrefix }) => {
  

  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(m.chat, {text: "عذراً، لا يمكنك استخدام هذا الأمر من هذا الجهاز."}, {quoted: m});
  }
  const chatId = m.isGroup ? [m.chat, m.sender] : [m.sender];
  const sessionPath = './MysticSession/';
  try {
    const files = await fs.readdir(sessionPath);
    let filesDeleted = 0;
    for (const file of files) {
      for (const id of chatId) {
        if (file.includes(id.split('@')[0])) {
          await fs.unlink(path.join(sessionPath, file));
          filesDeleted++;
          break;
        }
      }
    }
    if (filesDeleted === 0) {
      await conn.sendMessage(m.chat, {text: "لم يتم العثور على أي ملفات لحذفها 🧞."}, {quoted: m});
    } else {
      await conn.sendMessage(m.chat, {text: `تم حذف ${filesDeleted} ملف بنجاح 🧞.`}, {quoted: m});
    }
  } catch (err) {
    console.error("حدث خطأ أثناء محاولة حذف الملفات:", err);
    await conn.sendMessage(m.chat, {text: "جاري عملية التحديث يتيربو 🧞."}, {quoted: m});
  }
  await conn.sendMessage(m.chat, {text: `تمت العملية بنجاح 🧞.`}, {quoted: m});
};
handler.help = ['csowner'];
handler.tags = ['owner'];
handler.command = /^(تصليح|cs)$/i;
handler.rowner = true;
export default handler;


/*

import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync, readFileSync } from 'fs';
import path from 'path';

const handler = async (m, { conn, usedPrefix }) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language
  const _translate = JSON.parse(readFileSync(`./language/${idioma}.json`))
  const tradutor = _translate.plugins.fix_esperando_mensage

  if (global.conn.user.jid !== conn.user.jid) {
    return conn.sendMessage(m.chat, {text: tradutor.texto1}, {quoted: m});
  }
  const chatId = m.isGroup ? [m.chat, m.sender] : [m.sender];
  const sessionPath = './MysticSession/';
  try {
    const files = await fs.readdir(sessionPath);
    let filesDeleted = 0;
    for (const file of files) {
      for (const id of chatId) {
        if (file.includes(id.split('@')[0])) {
          await fs.unlink(path.join(sessionPath, file));
          filesDeleted++;
          break;
        }
      }
    }
    if (filesDeleted === 0) {
      await conn.sendMessage(m.chat, {text: tradutor.texto2}, {quoted: m});
    } else {
      await conn.sendMessage(m.chat, {text: `${tradutor.texto3[0]} ${filesDeleted} ${tradutor.texto3[1]}`}, {quoted: m});
    }
  } catch (err) {
    console.error(tradutor.texto4, err);
    await conn.sendMessage(m.chat, {text: tradutor.texto5}, {quoted: m});
  }
  await conn.sendMessage(m.chat, {text: `${tradutor.texto6} \n${usedPrefix}s\n${usedPrefix}s\n${usedPrefix}s`}, {quoted: m});
};
handler.help = ['csowner'];
handler.tags = ['owner'];
handler.command = /^(تصليح|cs)$/i;
handler.rowner = true;
export default handler;
*/
