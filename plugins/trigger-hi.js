const { cmd } = require('../command');
const path = require('path');
const fs = require('fs');

const triggerWords = [
  'bro', 'hello', 'hi', 'hey', 'bb', 'fr', 'mec', 'mom',
  'pussy', 'gyet mmw', 'chen', 'mdr',
  'syeee', 'weee', 'bonjour', 'bonsoir', 'salut'
];

cmd({
  on: 'message',
  filename: __filename,
}, async (conn, m, { text }) => {
  try {
    const body = text?.toLowerCase();
    if (!body) return;

    if (triggerWords.some(word => body.includes(word))) {
      const videoPath = path.join(__dirname, '../media/hi.mp4');

      if (!fs.existsSync(videoPath)) {
        return await conn.sendMessage(m.chat, {
          text: '⚠️ Video not found in /media/hi.mp4',
        }, { quoted: m });
      }

      await conn.sendMessage(m.chat, {
        video: fs.readFileSync(videoPath),
        caption: `Hello! 👋 Hi! Hey! Bonjour! Bonsoir! Salut!

How can I assist you today? 😊

Feel free to ask me anything or just chat!

I'm here to help and keep the conversation going. Let's have some fun! 🚀`,
      }, { quoted: m });
    }
  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, {
      text: `❌ Error sending video: ${e.message}`,
    }, { quoted: m });
  }
});
