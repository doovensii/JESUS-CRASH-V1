const { cmd } = require('../command');

const triggerWords = [
  'bro', 'hello', 'hi', 'hey', 'bb', 'fr', 'mec', 'mom',
  'pussy', 'gyet mmw', 'chen', 'mdr', 'syeee', 'weee', 'bonjour', 'bonsoir', 'salut'
];

const videoLinks = [
  'https://files.catbox.moe/q9cbhm.mp4',
  'https://files.catbox.moe/c7e8am.mp4',
  'https://files.catbox.moe/xbp15q.mp4',
  'https://files.catbox.moe/m296z6.mp4'
];

const cooldowns = {};

cmd({
  on: 'message',
  filename: __filename,
}, async (conn, m) => {
  try {
    const chatId = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    if (m.key.fromMe) return;

    const msgText =
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      m.message?.imageMessage?.caption ||
      m.message?.videoMessage?.caption ||
      '';

    const lower = msgText.toLowerCase();

    const found = triggerWords.some(word => lower.includes(word));
    if (!found) return;

    const now = Date.now();
    const lastSent = cooldowns[chatId] || 0;
    const cooldownTime = 20 * 60 * 1000; // 20 min

    if (now - lastSent < cooldownTime) return;
    cooldowns[chatId] = now;

    const selected = videoLinks[Math.floor(Math.random() * videoLinks.length)];

    await conn.sendMessage(chatId, {
      video: { url: selected },
      caption: `👋 Hey there!\nHow can I help you today? 😊`,
    }, { quoted: m });
  } catch (err) {
    console.error('❌ Error:', err);
  }
});
