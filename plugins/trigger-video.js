const { cmd } = require('../command');

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

    const isReplyToMe = m.quoted && m.quoted.key?.fromMe;
    const isTaggingMe =
      m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(conn.user?.id);

    if (!isReplyToMe && !isTaggingMe) return;

    const now = Date.now();
    const lastSent = cooldowns[chatId] || 0;
    const cooldownTime = 20 * 60 * 1000; // 20 minutes

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
