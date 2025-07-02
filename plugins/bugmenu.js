const { cmd } = require('../command');

cmd({
  pattern: "bugmenu",
  category: "menu",
  desc: "Show BUG MENU commands list with a random video",
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

    // Lis videyo yo
    const videos = [
      { url: 'https://files.catbox.moe/m296z6.mp4', caption: bugMenuText },
      { url: 'https://files.catbox.moe/c7e8am.mp4', caption: '🕸️ Bug Menu - Video 2' },
      { url: 'https://files.catbox.moe/q9cbhm.mp4', caption: '🕸️ Bug Menu - Video 3' }
    ];

    // Chwazi o aza youn nan videyo yo
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];

    await conn.sendMessage(m.chat, {
      video: { url: randomVideo.url },
      caption: randomVideo.caption,
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
