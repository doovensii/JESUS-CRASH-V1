const { cmd } = require('../command');

let grrrrActive = {};       // Grrrr mode pou chak chat
let replyCount = {};        // Konbyen fwa reply fèt
let reactivationTimeout = {}; // Timeout id pou chak chat

const emojis = ['😼', '😫', '😹', '😏', '😍', '🙄', '🤨'];

cmd({
  pattern: 'dame-un-grrr',
  category: 'spam',
  react: '🐱',
  desc: 'Aktive grrrr mode',
  filename: __filename,
}, async (conn, m, { reply }) => {
  grrrrActive[m.chat] = true;
  replyCount[m.chat] = 0;

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
  replyCount[m.chat] = 0;

  if (reactivationTimeout[m.chat]) {
    clearTimeout(reactivationTimeout[m.chat]);
    reactivationTimeout[m.chat] = null;
  }

  await reply('Grrrr mode dezaktive ✅');
});

cmd({
  on: 'message',
  filename: __filename,
}, async (conn, m, { reply }) => {
  if (!m || !m.chat || m.isBot) return;
  if (!grrrrActive[m.chat]) return;

  const text = m.body?.toLowerCase() || '';
  if (text.startsWith('.')) return;

  if (m.quoted) {
    replyCount[m.chat] = (replyCount[m.chat] || 0) + 1;

    if (replyCount[m.chat] === 1) {
      await reply('un que? un que?');
    } else if (replyCount[m.chat] === 2) {
      await reply('Nou kanpe la 😼');
      grrrrActive[m.chat] = false;

      // Apre 30 segonn li retounen
      reactivationTimeout[m.chat] = setTimeout(async () => {
        grrrrActive[m.chat] = true;
        replyCount[m.chat] = 0;

        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        await conn.sendMessage(m.chat, { text: `Mwen tounen... un que ${emoji}` });
      }, 30000);
    }

    return;
  }

  // Si pa gen reply, voye un que ak emoji
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  await reply(`un que ${emoji}`);
});
