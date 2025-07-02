const { cmd } = require('../command');

// Fonksyon pou netwaye tèks pou anpeche bug (zero-width, RTL, elatriye)
const cleanText = (text) => {
  return text
    .replace(/[\u200B-\u200F\u061C\u180E\u2060-\u206F]/g, '') // Zero-width & bidi
    .replace(/[^\x20-\x7E\n\r]/g, ''); // Retire tout sa ki pa ascii
};

cmd({
  pattern: "antibug",
  desc: "Activate anti-bug protection",
  category: "spam",
  react: "🛡️",
  filename: __filename
}, async (conn, m, mdata, { reply }) => {
  try {
    const rawText = "✅ *AntiBugs Activated!*\nSuspicious Unicode will now be auto-deleted.";
    const safeText = cleanText(rawText);

    // Sekirite: si yo eseye mete Unicode nan kòmand lan
    if (/[\u200B-\u200F\u061C\u180E\u2060-\u206F]/.test(m.body)) {
      return await reply("⚠️ Unicode bug detected and blocked.");
    }

    await reply(safeText);
  } catch (e) {
    console.error("❌ AntiBug Error:", e);
    await reply("❌ Error activating AntiBug.");
  }
});
