const { cmd } = require('../command');

let antiBugOn = false; // Eta inisyal

// Fonksyon netwayaj Unicode malveyan
const cleanText = (text) => {
  return text
    .replace(/[\u200B-\u200F\u061C\u180E\u2060-\u206F]/g, '') // Zero-width & bidi
    .replace(/[^\x20-\x7E\n\r]/g, ''); // Netwaye karaktè move
};

cmd({
  pattern: "antibug",
  desc: "Toggle Anti-Bug Protection",
  category: "protection",
  react: "🛡️",
  filename: __filename
}, async (conn, m, mdata, { reply, arg }) => {
  const commandArg = (arg[0] || '').toLowerCase();

  if (commandArg === "on") {
    antiBugOn = true;
    return await reply("✅ *AntiBug Activated!*\nSuspicious Unicode will now be auto-deleted.");
  } else if (commandArg === "off") {
    antiBugOn = false;
    return await reply("🚫 *AntiBug Deactivated.*\nUnicode protection is now disabled.");
  } else {
    return await reply(`🛡️ *AntiBug Status:* ${antiBugOn ? "ON ✅" : "OFF ❌"}\nUse *.antibug on* or *.antibug off*`);
  }
});

// Middleware pou bloke bug si aktif
cmd({
  pattern: ".*",
  dontAddCommandList: true,
  fromMe: false,
  filename: __filename
}, async (conn, m, mdata, { next }) => {
  if (antiBugOn && /[\u200B-\u200F\u061C\u180E\u2060-\u206F]/.test(m.body)) {
    return await conn.sendMessage(m.chat, {
      text: "⚠️ Unicode Bug Detected and Blocked!",
      quoted: m
    });
  }

  return await next(); // Kontinye si pa gen bug
});
