// ✅ Re-coded & Powered by DAWENS TECH 🎭
const { cmd } = require('../command');

cmd({
  pattern: 'hidetag',
  category: 'group',
  desc: 'Voye mesaj san tag men tout moun resevwa li',
  react: '👻',
  filename: __filename
}, async (conn, m, { args, isGroup, participants, reply }) => {
  try {
    if (!isGroup) return await reply('⛔ Sa sèlman mache nan gwoup.');

    const message = args.join(' ');
    if (!message) return await reply('Ekri mesaj ou vle voye egzanp:\n.hidetag Bonjou tout moun');

    const mentions = participants.map(p => p.id);

    await conn.sendMessage(m.chat, {
      text: message,
      mentions,
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    await reply('❌ Erè pandan m t ap voye mesaj la.');
  }
});
