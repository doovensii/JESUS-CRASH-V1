const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const banFile = path.join(__dirname, '../lib/banlist.json');

cmd({
  pattern: 'unban',
  desc: '✅ Unban a user from the bot.',
  category: 'owner',
  use: '<@tag | number | reply>',
  filename: __filename,
}, async (conn, m, { args, reply }) => {
  const sender = m.sender;
  const isCreator = [...config.OWNER_NUMBER.map(n => n + '@s.whatsapp.net'), conn.decodeJid(conn.user.id)].includes(sender);
  if (!isCreator) return reply('🚫 Only the bot owner can use this command.');

  const mentioned = m.mentionedJid?.[0];
  const replied = m.quoted?.sender;
  const numberArg = args[0]?.replace(/\D/g, '');
  const target = mentioned || replied || (numberArg ? numberArg + '@s.whatsapp.net' : null);

  if (!target) return reply('❌ Tag, reply, or type a number to unban.');

  if (!bannedUsers.includes(target)) {
    return reply(`⚠️ That user is not banned.`);
  }

  // Retire itilizatè nan banlist la
  bannedUsers = bannedUsers.filter(u => u !== target);
  saveBanlist();

  // Retabli chans itilizatè a (opsyonèl, mete 3 chans)
  userChances[target] = 3;
  saveChances();

  return reply(`✅ User *@${target.split('@')[0]}* has been *unbanned* and given 3 chances.`, { mentions: [target] });
});
