const { cmd } = require('../command');

cmd({
  pattern: 'tagall',
  desc: 'Mention all group members',
  category: 'group',
  react: '🔊',
  filename: __filename,
}, async (conn, m, { args, isGroup, participants, reply }) => {
  try {
    if (!isGroup) {
      return await reply('❌ This command only works in groups.');
    }

    const text = args.join(' ') || '📢 Attention everyone!';
    const mentions = participants.map(u => u.id);

    await conn.sendMessage(m.chat, {
      text,
      mentions
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    await reply('❌ Failed to tag all members.');
  }
});
