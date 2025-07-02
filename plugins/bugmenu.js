const { cmd } = require('../command');

cmd({
  pattern: "bugmenu",
  category: "menu",
  desc: "Show BUG MENU commands list with video",
  filename: __filename,
  react: "⚠️"
}, async (conn, m, { reply }) => {
  try {
    const bugMenuText = `
⬛⫷ *BUG MENU* ⫸⬛
⚔️ .ᴅᴀᴡᴇɴs-xʏ <ɴᴜᴍʙᴇʀ>
⚔️ .ᴊᴇsᴜs-ʙᴜɢ
⚔️ .ᴊᴇsᴜs-ᴄʀᴀsʜ
⚔️ .ᴊᴇsᴜs-ɪᴏs
⚔️ .ᴊᴇsᴜs-x-ᴅᴀᴡᴇɴs
⚔️ .ᴘᴀɪʀsᴘᴀᴍ <ɴᴜᴍʙᴇʀ> <ᴀᴍᴏᴜɴᴛ>
⚔️ .xᴅᴀᴠᴇ <ᴄʜᴀɴɴᴇʟ ɪᴅ>
⚔️ .xᴋɪʟʟᴇʀ-ᴜɪ <ɴᴜᴍʙᴇʀ>
🕸️╌╌╌╌╌╌╌╌╌╌╌╌╌
    `.trim();

    const videoUrl = 'https://files.catbox.moe/m296z6.mp4'; // Mete URL videyo a isit la

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: bugMenuText,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363419768812867@newsletter',
          newsletterName: 'JESUS-CRASH-V1',
          serverMessageId: 143
        }
      },
      quoted: m
    });
  } catch (error) {
    console.error("Error sending bug menu video:", error);
    await reply("❌ Sorry, something went wrong while sending the bug menu video.");
  }
});
