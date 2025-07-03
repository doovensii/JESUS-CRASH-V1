const fs = require("fs");
const path = "./data/level.json";

// Load or create level data
let levelDB = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};

// Save data function
function saveDB() {
  fs.writeFileSync(path, JSON.stringify(levelDB, null, 2));
}

// Get user data or initialize
function getUser(id) {
  if (!levelDB[id]) {
    levelDB[id] = { exp: 0, level: 1 };
  }
  return levelDB[id];
}

// Level up message per level
function levelUpMessage(level, name) {
  switch(level) {
    case 2: return `🔥 Congrats ${name}! You reached *Level 2*! Keep going! 🚀`;
    case 3: return `🌟 ${name}, great progress! Level 3 unlocked! 👏`;
    case 4: return `💥 ${name}, you’re a star! Level 4 achieved! ✨`;
    case 5: return `🏆 Wow ${name}! Level 5 reached! Respect! 🙌`;
    case 6: return `👑 ${name}, you made it to *Level 6*! Legendary! 🔥`;
    default: return `🎉 Congratulations ${name}! You just reached *Level ${level}*!`;
  }
}

// Add EXP and check level up
function addExp(id, name) {
  let user = getUser(id);
  user.exp += 1;

  const expNeeded = user.level * 10;
  if (user.exp >= expNeeded) {
    user.level++;
    user.exp = 0;
    saveDB();
    return levelUpMessage(user.level, name);
  }

  saveDB();
  return null;
}

module.exports = { addExp };
