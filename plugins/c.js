const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "connect",
  category: "tools",
  desc: "Connect to JESUS CRASH V1",
  filename: __filename,
  react: "🔑"
}, async (conn, m, { arg, reply }) => {
  const number = arg?.replace(/\D/g, ""); // Remove all non-digit characters

  if (!number) return reply("❌ Please enter a phone number. Example: .c 13058962443");

  // Send processing message
  await reply("⏳ *Processing...*\n\n🛠️ Connecting...");

  try {
    // Call API with 10 second timeout
    const res = await axios.get(`https://sessions-jesus.onrender.com/pair?number=${number}`, {
      timeout: 10000 // 10 seconds timeout
    });

    const { code } = res.data;

    if (!code) return reply("❌ Error: No connection code received.");

    // Send the code message
    await conn.sendMessage(m.chat, {
      text: `😍 *Connection Successful!*\n\n🔒 A unique code will follow, copy it and activate your session.\n\nEnjoy *JESUS CRASH V1*\n\n🔑 *Your connection code:* *${code}*\n\nSend this code to the bot to start.`,
      quoted: m
    });

    // Final confirmation message
    await reply("✅ *Connection complete!*\nYou can now use the bot with your received code.");
  } catch (e) {
    console.error("Connection error:", e.message || e);
    if (e.code === 'ECONNABORTED') {
      reply("❌ Error: Connection timed out. The API took too long to respond.");
    } else {
      reply("❌ Error during connection.\nPlease make sure the service is available.");
    }
  }
});
