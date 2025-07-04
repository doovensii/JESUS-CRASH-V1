const { cmd } = require('../command');
const { writeFileSync, unlinkSync } = require('fs');
const { fromBuffer } = require('file-type');
const path = require('path');

cmd({
  pattern: "toimage",
  alias: ["img", "photo"],
  category: "convert",
  desc: "Convert sticker to normal image",
  filename: __filename,
}, async (conn, m, { repondre }) => {
  const quoted = m.quoted || m;
  const mime = (quoted.msg || quoted).mimetype || "";

  if (!/webp/.test(mime)) {
    return await repondre("❌ Please reply to a sticker to convert it into an image.");
  }

  try {
    const buffer = await quoted.download();
    const { ext } = await fromBuffer(buffer) || { ext: 'webp' };
    const filename = path.join(__dirname, `../sessions/temp/toimage-${Date.now()}.${ext}`);

    writeFileSync(filename, buffer);

    await conn.sendMessage(m.chat, {
      image: { url: filename },
      caption: "✅ Successfully converted sticker to image!",
    }, { quoted: m });

    // Netwaye fichye tanporè a apre 5 segonn
    setTimeout(() => {
      try {
        unlinkSync(filename);
      } catch (e) {}
    }, 5000);

  } catch (err) {
    console.error(err);
    await repondre("❌ Error occurred during conversion.");
  }
});
