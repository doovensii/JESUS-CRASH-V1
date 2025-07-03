const fs = require("fs");
const path = "./database/level.json";

// 📦 Chaje done si egziste
let levelDB = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};

// 💾 Sove done
function saveDB() {
  fs.writeFileSync(path, JSON.stringify(levelDB, null, 2));
}

// 📊 Jwenn done user lan
function getUser(id) {
  if (!levelDB[id]) {
    levelDB[id] = { exp: 0, level: 1 };
  }
  return levelDB[id];
}

// 📣 Mesaj otomatik pou chak nivo
function mesajNivo(nivo, non) {
  switch(nivo) {
    case 2: return `🔥 Bravo ${non} ! Ou rive nan *Nivo 2*! Keep it up! 🚀`;
    case 3: return `🌟 ${non}, ou fè gwo pwogrè! *Nivo 3* atenn! 👏`;
    case 4: return `💥 ${non}, ou se yon star! *Nivo 4*! ✨`;
    case 5: return `🏆 Wow ${non} ! *Nivo 5*! Respè! 🙌`;
    case 6: return `👑 ${non}, ou rive nan *Nivo 6*! Granmoun nèt! 🔥`;
    default: return `🎉 Félicitations ${non} ! Ou fèk rive nan *Nivo ${nivo}*!`;
  }
}

// 🧠 Fonksyon ajoute eksperyans & tcheke nivo
function addExp(id, name) {
  let user = getUser(id);
  user.exp += 1;

  const expRequired = user.level * 10;
  if (user.exp >= expRequired) {
    user.level++;
    user.exp = 0;
    saveDB();
    return mesajNivo(user.level, name);
  }

  saveDB();
  return null;
}

module.exports = { addExp };
