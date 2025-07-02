const { cmd } = require('../command');

cmd({
  pattern: "rele",
  desc: "Call all group members in a stylish way",
  category: "spam",
  filename: __filename,
  react: "🗣️"
}, async (conn, m, { participants, isGroup, reply }) => {
  if (!isGroup) return await reply("❌ This command is for *groups only*.");

  try {
    const mentions = participants.map(p => p.id);
    const mentionText = `
╭────〔 *🔊 MWEN RELE NOU UI GYET MANMAN NOU* 〕─────⬣
│  👑 *Admin ap rele nou tout!* 
│
${mentions.map((id, i) => `│  ${i + 1}. @${id.split('@')[0]}`).join('\n')}
│
╰───────────────────────────────────────────────────⬣
*⚠️ Pa inyore apèl sa bann chen😭😂!*
`.trim();

    await conn.sendMessage(m.chat, {
      text: mentionText,
      mentions: mentions,
      quoted: m
    });

  } catch (err) {
    console.error("Error in .rele command:", err);
    await reply("❌ Error while tagging everyone.");
  }
});
