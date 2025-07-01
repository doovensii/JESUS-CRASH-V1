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

// Listener, mache nan tout chat (group & private)
cmd({
  on: 'message',
  filename: __filename,
}, async (conn, m) => {
  try {
    if (!m) return;
    if (m.fromMe) return; // pa reponn mesaj bot li menm

    const body = (
      m.message?.conversation ||
      m.message?.extendedTextMessage?.text ||
      m.body ||
      ''
    ).toLowerCase();

    if (!body) return;

    // Ou ka retire sa si ou vle reponn tou nan group sèlman oswa prive sèlman
    // let isGroup = m.chat.endsWith('@g.us'); // group si ou vle itilize li

    const chatId = m.chat;

    const found = triggerWords.some(word => body.includes(word));
    if (!found) return;

    const now = Date.now();
    const lastSent = cooldowns[chatId] || 0;
    const cooldownTime = 20 * 60 * 1000; // 20 minit

    if (now - lastSent < cooldownTime) return;

    cooldowns[chatId] = now;

    const selected = videoLinks[Math.floor(Math.random() * videoLinks.length)];

    await conn.sendMessage(m.chat, {
      video: { url: selected },
      caption: `👋 Hey there!\nHow can I help you today? 😊`,
    }, { quoted: m });

  } catch (err) {
    console.error('❌ Error sending video:', err);
    await conn.sendMessage(m.chat, {
      text: `❌ Error sending video: ${err.message}`,
    }, { quoted: m });
  }
});
