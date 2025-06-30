const { cmd } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

cmd({
  pattern: 'pretem',
  desc: 'Re-send any sticker as yours (with custom packname from WhatsApp name)',
  category: 'spam',
  react: '🎭',
  filename: __filename
}, async (bot, mek, m, { reply }) => {
  try {
    const quoted = mek.quoted;

    if (!quoted || quoted.mtype !== 'stickerMessage') {
      return reply('❌ Reply to a sticker to pretend it\'s yours.');
    }

    const media = await bot.downloadMediaMessage(quoted);
    if (!media) return reply('❌ Failed to download sticker.');

    // Pran non itilizatè a sou WhatsApp pou mete kòm packname
    const userName = mek.pushName || 'Unknown';
    const packname = `${userName}`;
    const author = `Ma volonté est un feu indomptable,
mon nom, une légende qui s’écrit à chaque pas.`;

    const sticker = new Sticker(media, {
      pack: packname,
      author,
      type: StickerTypes.FULL,
      quality: 100,
    });

    const stickerBuffer = await sticker.toBuffer();

    await bot.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });

  } catch (err) {
    console.error('[PRETEM ERROR]', err);
    reply('❌ An error occurred while sending the sticker.');
  }
});

