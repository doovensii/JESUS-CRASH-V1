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
const dawensMode = {};

// Dawens ON / OFF
cmd({
  pattern: 'dawens',
  filename: __filename,
  category: 'spam',
  desc: 'Turn dawens video mode on/off',
}, async (conn, m, { args, reply }) => {
  const chatId = m.chat;
  const option = args[0]?.toLowerCase();

  if (option === 'on') {
    dawensMode[chatId] = true;
    return await reply('✅ Dawens mode is now ON');
  } else if (option === 'off') {
    dawensMode[chatId] = false;
    return await reply('🛑 Dawens mode is now OFF');
  } else {
    return await reply(
      `⚙️ *Dawens Mode Control*\n\nTo activate or deactivate Dawens reply-video mode:\n\n• Type: *.dawens on*  ✅\n• Type: *.dawens off* 🛑\n\nExample:\n.dawens on\n\n_Only works in groups where bot is active._`
    );
  }
});

// Listener
cmd({
  on: 'message',
  filename: __filename,
}, async (conn, m) => {
  try {
    if (!m || m.isBot) return;

    const body = m.body?.toLowerCase();
    if (!body) return;

    const chatId = m.chat;
    if (!dawensMode[chatId]) return;

    const now = Date.now();
    const lastSent = cooldowns[chatId] || 0;
    const cooldownTime = 20 * 60 * 1000; // 20 mins

    const found = triggerWords.some(word => body.includes(word));
    if (!found) return;

    if (now - lastSent < cooldownTime) return;

    cooldowns[chatId] = now;

    const selected = videoLinks[Math.floor(Math.random() * videoLinks.length)];

    await conn.sendMessage(m.chat, {
      video: { url: selected },
      caption: `👋 Hey there!\nHow can I help you today? 😊`,
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, {
      text: `❌ Error sending video: ${err.message}`,
    }, { quoted: m });
  }
});
