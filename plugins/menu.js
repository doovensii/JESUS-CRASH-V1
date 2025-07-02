const config = require('../config');
const os = require('os');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');

// Small caps
function toSmallCaps(str) {
  const smallCaps = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.toUpperCase().split('').map(c => smallCaps[c] || c).join('');
}

// Random emoji
const emojis = ['🌟','🌹','⚡','🌸','✨','🔥','🌀','🩸','😍','🌚','💍','❤️','🍷'];
const randEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

cmd({
  pattern: "menu",
  alias: ["allmenu", "jesus", "🖤"],
  desc: "Show all bot commands",
  category: "menu",
  react: "🖤",
  filename: __filename
},
async (conn, mek, m, { from, reply, body }) => {
  try {
    const sender = m.sender || mek?.key?.participant || mek?.key?.remoteJid;
    const date = moment().tz("America/Port-au-Prince").format("dddd, DD MMMM YYYY");

    const uptime = () => {
      const sec = process.uptime();
      const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(1);
    const hostName = os.hostname();
    const totalCommands = commands.length;

    // ✨ Detekte prefix si se emoji
    let usedPrefix = config.PREFIX || ".";
    if (m.body) {
      const match = m.body.match(/^(\W+)/); // nenpòt karaktè ki pa lèt/Chif
      if (match && match[1]) usedPrefix = match[1];
    }

    let menuText = `
╔═════◇🌐◇═════╗
    🔥 𝐉𝐄𝐒𝐔𝐒-𝐂𝐑𝐀𝐒𝐇-𝐕𝟏 🔥
╚═════◇🌐◇═════╝
║ 👤 *User*      : @${sender.split("@")[0]}
║ ⏱️ *Uptime*    : ${uptime()}
║ ⚙️ *Mode*      : ${config.MODE || "public"}
║ 💠 *Prefix*    : [${usedPrefix}]
║ 📦 *Plugins*   : ${totalCommands}
║ 🛠️ *RAM*       : ${ramUsage}MB / ${totalRam}MB
║ 🖥️ *Host*      : ${hostName}
║ 👑 *Developer* : DAWENS BOY 🇭🇹
║ 📆 *Date*      : ${date}
╠══════════════════════════════╣
 ✨ *Welcome to JESUS-CRASH-V1*
🧠 Type *${usedPrefix}menu* to explore features.
⚔️ No mercy, just power. 🇭🇹
╚══════════════════════════════╝
`;

    // Organize by category
    const categoryMap = {};
    for (let c of commands) {
      if (!c.category) continue;
      if (!categoryMap[c.category]) categoryMap[c.category] = [];
      categoryMap[c.category].push(c);
    }

    const keys = Object.keys(categoryMap).sort();
for (let k of keys) {
  menuText += `\n\n⬛⫷ *${k.toUpperCase()} MENU* ⫸⬛`;
  const cmds = categoryMap[k].filter(c => c.pattern).sort((a, b) => a.pattern.localeCompare(b.pattern));
  cmds.forEach((cmd) => {
    const usage = cmd.pattern.split('|')[0];
    menuText += `\n⚔️ ${usedPrefix}${toSmallCaps(usage)}`;
  });
  menuText += `\n🕸️╌╌╌╌╌╌╌╌╌╌╌╌╌`;
}

    try {
      await conn.sendMessage(from, {
        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/fuoqii.png' },
        caption: menuText,
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: config.newsletterJid || '120363419768812867@newsletter',
            newsletterName: '𝗝𝗘𝗦𝗨𝗦-𝗖𝗥𝗔𝗦𝗛-𝗩𝟭',
            serverMessageId: 143
          }
        }
      }, { quoted: mek });
    } catch (e) {
      console.error('❌ Image send failed:', e.message);
      await reply(menuText);
    }

    try {
      await conn.sendMessage(from, {
        audio: { url: 'https://files.catbox.moe/8e7mkq.mp4' },
        mimetype: 'audio/mp4',
        ptt: true
      }, { quoted: mek });
    } catch (e) {
      console.error('⚠️ Audio send failed:', e.message);
    }

  } catch (e) {
    console.error('❌ Menu error:', e.message);
    reply(`❌ Menu Error: ${e.message}`);
  }
});
