const items = ['limit', 'exp', 'joincount', 'money', 'potion', 'trash', 'wood', 'rock', 'string', 'petFood', 'emerald', 'diamond', 'gold', 'iron', 'common', 'uncoommon', 'mythic', 'legendary', 'pet']
let confirmation = {} 

async function handler(m, { conn, args, usedPrefix, command }) {
    if (confirmation[m.sender]) return m.reply('انت بتعمل تحويل دلوقتي')
    
    let user = global.db.data.users[m.sender]
    const item = items.filter(v => v in user && typeof user[v] == 'number')
    
    let lol = `\`⧼⧼⧼ 💱 تحويل 💱 ⧽⧽⧽\`
    
> *${usedPrefix + command} نوع الكمية @الاسم*

\`❏ مثال :\`
* *${usedPrefix + command} exp 30 @0*

┏•「 *✅ الموارد المتاحة* 」
┃
┃ 💎 ماس = limit
┃ 🪙 فلوس = money 
┃ ⚡ خبرة = exp 
┗•
`.trim()
    
    const type = (args[0] || '').toLowerCase()
    if (!item.includes(type)) return m.reply(lol,  m.chat, {mentions: conn.parseMention(lol)}, {quoted: m })

    const count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, (isNumber(args[1]) ? parseInt(args[1]) : 1))) * 1
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : args[2] ? (args[2].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : ''
    
    if (!who) return m.reply(`${ag} *من فضلك حدد المستخدم*`)
    if (!(who in global.db.data.users)) return m.reply(`${fg}*المستخدم ${who} مش موجود في قاعدة البيانات*`)
    if (user[type] * 1 < count) return m.reply(`${fg}*مش عندك كفاية من ${type} عشان تعمل التحويل*`)
    
    let mentionedJid = [who]
    let username = conn.getName(who)
    
    let confirm = `\`انت على وشك تعمل التحويل ده\`

> 💹 *${count} ${type} لـ* *@${(who || '').replace(/@s\.whatsapp\.net/g, '')}* ? 

\`عايز تكمل؟\`
> عندك 60 ثانية!!

> اكتب: (ايوة) عشان تكمل
> اكتب: (لا) عشان تلغي\n\n> ${wm}`.trim()
    
    let c = `${wm}\nعندك 60 ثانية!!`
    await conn.reply(m.chat, confirm, m, { mentions: [who] })
    confirmation[m.sender] = {
        sender: m.sender, 
        to: who, 
        message: m, 
        type, 
        count, 
        timeout: setTimeout(() => (m.reply('*انتهى الوقت*'), delete confirmation[m.sender]), 60 * 1000)
    }
}

handler.before = async m => {
    if (m.isBaileys) return
    if (!(m.sender in confirmation)) return
    if (!m.text) return
    
    let { timeout, sender, message, to, type, count } = confirmation[m.sender]
    if (m.id === message.id) return
    
    let user = global.db.data.users[sender]
    let _user = global.db.data.users[to]
    
    if (/^لا|no$/i.test(m.text)) { 
        clearTimeout(timeout)
        delete confirmation[sender]
        return m.reply('*تم الإلغاء*')
    }
    
    if (/^ايوة|si$/i.test(m.text)) { 
        let previous = user[type] * 1
        let _previous = _user[type] * 1
        user[type] -= count * 1
        _user[type] += count * 1
        
        if (previous > user[type] * 1 && _previous < _user[type] * 1) 
            m.reply(`✅ *تم التحويل بنجاح:*\n\n*${count} ${type} لـ* @${(to || '').replace(/@s\.whatsapp\.net/g, '')}`, null, { mentions: [to] })
        else {
            user[type] = previous
            _user[type] = _previous
            m.reply(`*حصل خطأ أثناء تحويل ${count} ${type} لـ* *@${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`, null, { mentions: [to] })
        }
        
        clearTimeout(timeout)
        delete confirmation[sender]
    }
}

handler.help = ['transfer'].map(v => v + ' [نوع] [كمية] [@الاسم]')
handler.tags = ['اقتصاد']
handler.command = ['تحويل', 'transfer', 'darxp', 'dar', 'enviar', 'transferir'] 
handler.disabled = false
handler.register = true

export default handler

function special(type) {
    let b = type.toLowerCase()
    let special = (['common', 'تحويل', 'mythic', 'legendary', 'pet'].includes(b) ? ' Crate' : '')
    return special
}

function isNumber(x) {
    return !isNaN(x)
                  }