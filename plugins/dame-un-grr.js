const { cmd } = require('../command');

let grrrrActive = {}; // pou chak chat

cmd({
  pattern: 'dame-un-grrrr',
  category: 'spam',
  react: '🐶',
  desc: 'Aktive grrrr mode',
  filename: __filename,
}, async (conn, m, { reply }) => {
  grrrrActive[m.chat] = true;
  await reply('un que 🐶 (grrrr mode aktif)');
});

// Stop grrrr
cmd({
  pattern: 'stop-grrrr',
  category: 'spam',
  react: '🛑',
  desc: 'Stop grrrr mode',
  filename: __filename,
}, async (conn, m, { reply }) => {
  grrrrActive[m.chat] = false;
  await reply('Grrrr mode dezaktive ✅');
});

// Repon otomatik si aktif
cmd({
  on: 'message', // sa koute tout mesaj
  filename: __filename,
}, async (conn, m, { reply }) => {
  if (!m || !m.chat || m.isBot) return;
  if (grrrrActive[m.chat]) {
    // Ignorer si se yon lòd
    if (m.body && m.body.startsWith('.')) return;

    await reply('un que');
  }
});
