import { store } from '../store.js' // تأكد من استيراد `store` إذا كنت تستخدم `Baileys v6+`
import db from '../database.js' // تأكد من استيراد قاعدة البيانات إذا كنت تستخدمها

export async function before(m, { conn }) {
    let chat = db.data.chats[m.chat] || {}

    if (chat.antiedit) {
        try {
            // التحقق مما إذا كانت الرسالة المعدلة
            if (m.message?.protocolMessage?.type === 2) {
                let key = m.message.protocolMessage.key

                // الحصول على الرسالة القديمة من `store`
                let oldMessageData = await store.loadMessage(key.remoteJid, key.id)
                if (!oldMessageData) return // لا يوجد سجل للرسالة القديمة
                
                let oldMessage = oldMessageData.message?.extendedTextMessage?.text || oldMessageData.message?.conversation || ''
                let newMessage = m.message.protocolMessage.editedMessage?.conversation || m.message.protocolMessage.editedMessage?.extendedTextMessage?.text || ''

                if (!oldMessage || !newMessage || oldMessage === newMessage) return // لا داعي للمتابعة إذا لم يكن هناك تغيير حقيقي
                
                let sender = key.participant || key.remoteJid // الشخص الذي قام بالتعديل
                let response = `📢 *رسالة تم تعديلها!*\n\n`
                response += `👤 *المعدّل:* @${sender.split('@')[0]}\n`
                response += `📜 *قبل:* ${oldMessage}\n`
                response += `🆕 *بعد:* ${newMessage}`

                // إرسال إشعار بالتعديل
                await conn.sendMessage(m.chat, {
                    text: response,
                    mentions: [sender]
                }, { quoted: m })
            }
        } catch (err) {
            console.error('🔴 خطأ في الكشف عن التعديلات:', err)
        }
    }
}