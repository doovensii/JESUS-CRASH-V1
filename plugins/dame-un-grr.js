const { cmd } = require('../command');

let grrrrActive = {}; // grrrr mode pou chak chat

// Yon lis emoji o aza (eksepte 🐶)
const emojis = ['😼', '🙄', '🤨', '😹', '😫', '😏', '😹'];

cmd({
  pattern: 'dame-un-grrr',
  category: 'spam',
  react: '🐱',
  desc: 'Aktive grrrr mode',
  filename: __filename,
}, async (conn, m, { reply }) => {
  grrrrActive[m.chat] = true;

  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  await reply(`un que ${emoji}`);
});

cmd({
  pattern: 'stop-grrrr',
  category: 'spam',
  react: '🛑',
  desc: 'Sispann grrrr mode',
  filename: __filename,
}, async (conn, m, { reply }) => {
  grrrrActive[m.chat] = false;
  await reply('Grrrr mode dezaktive ✅');
});

// Listener pou tout mesaj
cmd({
  on: 'message',
  filename: __filename,
}, async (conn, m, { reply }) => {
  if (!m || !m.chat || m.isBot) return;
  if (!grrrrActive[m.chat]) return;

  const text = m.body?.toLowerCase() || '';
  if (text.startsWith('.')) return;

  // Si se yon reply, reponn "un que? un que?"
  if (m.quoted) {
    await reply('un que? un que?');
  } else {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    await reply(`un que ${emoji}`);
  }
});
