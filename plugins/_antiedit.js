export async function before(m, {
        conn
    }) {
        let chat = db.data.chats[m.chat]

         if (chat.antiedit) {

            if (m.mtype == "editedMessage") {
            
                let msg = (m.mtype === 'editedMessage') ? m.message.editedMessage.message.protocolMessage.editedMessage.conversation ? m.message.editedMessage.message.protocolMessage.editedMessage.conversation : m.message.editedMessage.message.protocolMessage.editedMessage.extendedTextMessage.text : ''
                
                let json = await conn.loadMessage(m.message.editedMessage.message.protocolMessage.key.id)
                let cap = `[ *NOTICE EDITED MESSAGE* ]

Dari: @${json.key.participant ? json.key.participant.split("@")[0] : json.key.remoteJid.split("@")[0]}
Pesan Sebelumnya: \`${json.message.extendedTextMessage ? json.message.extendedTextMessage.text : json.message.conversation}\`
Pesan di Edit: \`${msg}\``

                await conn.reply(json.key.remoteJid, cap, m, {
                    contextInfo: {
                        mentionedJid: [json.key.participant ? json.key.participant : json.key.remoteJid]
                    }
                })
            }
             }
        }