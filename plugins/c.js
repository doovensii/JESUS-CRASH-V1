const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "connect ?(.*)",
  category: "tools",
  desc: "Connect to JESUS CRASH V1",
  filename: __filename,
  react: "🔑"
}, async (conn, m, { arg, reply }) => {
  const rawInput = arg?.trim() || "";
  const number = rawInput.replace(/\D/g, ""); // remove all non-digit characters

  // Validate number length (must be 11 or more digits)
  if (!number || number.length < 11) {
    return reply("❌ Invalid phone number. Please enter a valid number with at least 11 digits.\nExample: .connect 13058962443");
  }

  // Send processing message
  await reply("⏳ *Processing...*\n\n🛠️ Connecting...");

  try {
    // Call API with 10 second timeout
    const res = await axios.get(`https://sessions-jesus.onrender.com/pair?number=${number}`, {
      timeout: 10000
    });

    const { code } = res.data;

    if (!code) {
      return reply("❌ Error: No connection code received from the server.");
    }

    // Send the connection code to user
    await conn.sendMessage(m.chat, {
      text: `😍 *Connection Successful!*\n\n🔒 A unique code will follow, copy it and activate your session.\n\nEnjoy *JESUS CRASH V1*\n\n🔑 *Your connection code:* *${code}*\n\nSend this code to the bot to start.`,
      quoted: m
    });

    // Final confirmation
    await reply("✅ *Connection complete!*\nYou can now use the bot with your received code.");
  } catch (e) {
    console.error("Connection error:", e.response?.data || e.message || e);

    if (e.code === 'ECONNABORTED') {
      return reply("❌ Error: Connection timed out. The API took too long to respond.");
    }

    return reply("❌ Error during connection.\nPlease make sure the service is available.");
  }
});
