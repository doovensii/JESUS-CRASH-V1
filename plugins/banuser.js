const fs = require('fs');
const path = require('path');
const banFile = path.join(__dirname, '../lib/banlist.json');

if (!fs.existsSync(banFile)) fs.writeFileSync(banFile, JSON.stringify([]));

let bannedUsers = JSON.parse(fs.readFileSync(banFile));

const saveBanlist = () => {
  fs.writeFileSync(banFile, JSON.stringify(bannedUsers, null, 2));
};

const { cmd } = require('../command');
const config = require('../config');

cmd({
  pattern: 'ban',
  desc: '🚫 Ban a user from using the bot.',
  category: 'spam',
  use: '<@tag | number>',
  filename: __filename,
}, async (conn, m, { args, reply }) => {
  const sender = m.sender;
  const isCreator = [...config.OWNER_NUMBER.map(n => n + '@s.whatsapp.net'), conn.decodeJid(conn.user.id)].includes(sender);
  if (!isCreator) return reply('🚫 Only the bot owner can use this.');

  const target = m.mentionedJid && m.mentionedJid[0]
    || (args[0] && args[0].replace(/\D/g, '') + '@s.whatsapp.net');

  if (!target) return reply('❌ Tag or enter a number to ban.');

  if (bannedUsers.includes(target)) {
    return reply(`❗ User is already banned.`);
  }

  bannedUsers.push(target);
  saveBanlist();
  return reply(`✅ User ${target} has been *banned* from using the bot.`);
});
