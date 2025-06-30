// utils.js

// Fonksyon delay pou retade ekzekisyon
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fonksyon loading pou montre loading message
const loading = async (dest, conn) => {
    try {
        await conn.sendMessage(dest, { text: "⏳ Loading..." });
    } catch (e) {
        console.error("Error sending loading message:", e);
    }
};

// Fonksyon react pou mete emoji repons sou yon mesaj
const react = async (conn, msg, emoji) => {
    try {
        await conn.sendMessage(msg.key.remoteJid, {
            react: {
                text: emoji,
                key: msg.key,
            }
        });
    } catch (e) {
        console.error("Error reacting to message:", e);
    }
};

// Export tout fonksyon yo
module.exports = {
    delay,
    loading,
    react
};
