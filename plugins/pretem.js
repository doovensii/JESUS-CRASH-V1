const { cmd } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

cmd({
  pattern: 'pretem',
  desc: 'Re-send any sticker or video as yours (with custom packname from WhatsApp name)',
  category: 'spam',
  react: '🎭',
  filename: __filename
}, async (bot, mek, m, { reply }) => {
  try {
    const quoted = mek.quoted;

    // Verify if it's a sticker or video
    if (!quoted || !['stickerMessage', 'videoMessage'].includes(quoted.mtype)) {
      return reply('❌ Reply to a *sticker* or a *short video* (max 10s) to pretend it\'s yours.');
    }

    const media = await bot.downloadMediaMessage(quoted);
    if (!media) return reply('❌ Failed to download media.');

    // Get name of user as packname
    const userName = mek.pushName || 'Unknown';
    const packname = `${userName}`;
    const author = `Ma volonté est un feu indomptable,\nmon nom, une légende qui s’écrit à chaque pas.`;

    const sticker = new Sticker(media, {
      pack: packname,
      author,
      type: StickerTypes.FULL, // FULL supports animated if media is video
      quality: 100,
      fps: 10,
      loop: 0,
    });

    const stickerBuffer = await sticker.toBuffer();
    await bot.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });

  } catch (err) {
    console.error('[PRETEM ERROR]', err);
    reply('❌ An error occurred while processing the sticker or video.');
  }
});
