import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import { canLevelUp, xpRange } from '../lib/levelling.js';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import moment from 'moment-timezone';

const timezone = 'Africa/Cairo';

let handler = async (m, { conn }) => {
    try {
        const d = new Date();
        const locale = 'ar';
        const week = d.toLocaleDateString(locale, { weekday: 'long' });
        const date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
        const uptime = formatDuration(process.uptime() * 1000);

        const who = m.quoted ? m.quoted.sender : m.mentionedJid?.[0] || m.sender;

        if (!global.db?.data?.users?.[who]) {
            throw new Error("✳️ لم يتم العثور على المستخدم في قاعدة البيانات الخاصة بي");
        }

        const user = global.db.data.users[who];
        const registeredUsersCount = Object.values(global.db.data.users).filter(u => u.registered).length;
        const videoUrl = 'https://telegra.ph/file/381cbc23153d4a979300c.mp4';
        const tagUser = `@${m.sender.split('@s.whatsapp.net')[0]}`;

        const message = `
┏━━⊜ *◡̈⃝˼‏👨🏻‍💻˹ ━━|قسم المطور│━━˼👨🏻‍💻˹◡̈⃝*
┇≡ *◡̈⃝🧸📌 تفضل القائمة يا* : *${tagUser}*
┇≡ *◡̈⃝⌚📌 وقت التشغيل:* ${uptime}
┇≡ *◡̈⃝⏳📌 التاريخ:* ${date}
┇≡ *◡̈⃝🕊📌 عدد المستخدمين:* ${registeredUsersCount}
┇≡ *◡̈⃝🧚🏻‍♀️📌 اسم البوت:* 𝑻𝑼𝑹𝑩𝑶🤺🔥
┇≡ *◡̈⃝⚙️📌 المنصة:* replit
┗━━━━━━━━━━⬣

┏━━⊜
❏..◡̈⃝🔕╎❯ .بان⌉
❏..◡̈⃝🔔╎❯ .بانفك⌉
❏..◡̈⃝🚫╎❯ .بانشات⌉
❏..◡̈⃝⭕╎❯ .بانشاتفك⌉
❏..◡̈⃝💎╎❯ .ضيف الماس⌉
❏..◡̈⃝💱╎❯ .ضيف اكسبي⌉
❏..◡̈⃝🔄╎❯ .اعاده⌉
❏..◡̈⃝📤╎❯ .اخرج⌉
❏..◡̈⃝📥╎❯ .ادخل⌉
❏..◡̈⃝👨🏻‍💻╎❯ .تهكير⌉
❏..◡̈⃝⛔╎❯ .البلوكات⌉
❏..◡̈⃝🔰╎❯ .فكالبلوك⌉
❏..◡̈⃝📵╎❯ .بلوك⌉
❐..◡̈⃝🪄❯  .تسريع⌉
❏..◡̈⃝🖱╎❯ .بريم⌉
❏..◡̈⃝👨‍💻╎❯ .الشتات المحظوره⌉
❏..◡̈⃝🍻╎❯ .المحظورين⌉
❏..◡̈⃝🖲╎❯ .حذف_بريم⌉
❏..◡̈⃝🏃‍♂️╎❯ .تسريع البوت⌉
❏..◡̈⃝🗞╎❯ .نشر⌉
❏..◡̈⃝🧨╎❯ .هاك⌉
┗━━━━━━━━━━⬣
`.trim();

        await conn.sendMessage(m.chat, {
            video: { url: videoUrl }, caption: message,
            mentions: [m.sender, conn.user.jid],
            gifPlayback: true, gifAttribution: 0
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `⚠️ حدث خطأ: ${error.message}`, m);
    }
};

handler.help = ['main'];
handler.command = ['ق6'];

export default handler;

// دالة لتنسيق الوقت
function formatDuration(ms) {
    const h = Math.floor(ms / 3600000) || '--';
    const m = Math.floor(ms / 60000) % 60 || '--';
    const s = Math.floor(ms / 1000) % 60 || '--';
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}

// دالة المعايدة
function ucapan() {
    const currentHour = moment.tz(timezone).format('HH');
    if (currentHour >= 4 && currentHour < 10) return "صباح الخير 🌄";
    if (currentHour >= 10 && currentHour < 15) return "مساء الخير ☀️";
    if (currentHour >= 15 && currentHour < 18) return "مساء الخير 🌇";
    return "مساء الخير 🌙";
}