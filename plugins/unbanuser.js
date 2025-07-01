const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const banFile = path.join(__dirname, '../lib/banlist.json');
const chancesFile = path.join(__dirname, '../lib/chances.json');

// Kreye fichye si pa egziste
if (!fs.existsSync(banFile)) fs.writeFileSync(banFile, JSON.stringify([]));
if (!fs.existsSync(chancesFile)) fs.writeFileSync(chancesFile, JSON.stringify({}));

// Li done yo
let bannedUsers = JSON.parse(fs.readFileSync(banFile));
let userChances = JSON.parse(fs.readFileSync(chancesFile));

// Fonksyon pou sove
const saveBanlist = () => {
  fs.writeFileSync(banFile, JSON.stringify(bannedUsers, null, 2));
};

const saveChances = () => {
  fs.writeFileSync(chancesFile, JSON.stringify(userChances, null, 2));
};

// Unban command
cmd({
  pattern: 'unban',
  desc: '✅ Unban a user and restore chances.',
  category: 'spam',
  use: '<@tag | number | reply>',
  filename: __filename,
}, async (conn, m, { args, reply }) => {
  const sender = m.sender;

  const isCreator = [
    ...config.OWNER_NUMBER.map(n => n + '@s.whatsapp.net'),
    conn.decodeJid(conn.user.id)
  ].includes(sender);

  if (!isCreator) return reply('🚫 Only the bot owner can use this command.');

  const mentioned = m.mentionedJid?.[0];
  const replied = m.quoted?.sender;
  const numberArg = args[0]?.replace(/\D/g, '');
  const target = mentioned || replied || (numberArg ? numberArg + '@s.whatsapp.net' : null);

  if (!target) return reply('❌ Tag, reply, or provide a number to unban.');

  if (!bannedUsers.includes(target)) {
    return reply(`⚠️ That user is *not currently banned*.`);
  }

  bannedUsers = bannedUsers.filter(user => user !== target);
  saveBanlist();

  userChances[target] = 3;
  saveChances();

  return reply(
    `✅ User *@${target.split('@')[0]}* has been *unbanned* and given back 3 chances.`,
    { mentions: [target] }
  );
});
