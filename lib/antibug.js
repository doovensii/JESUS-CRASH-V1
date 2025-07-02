// lib/antibug.js

function cleanText(text) {
  return text
    .replace(/[\u200B-\u200F\u061C\u180E\u2060-\u206F]/g, '') // zero-width / RTL
    .replace(/[^\x20-\x7E\n\r]/g, ''); // only basic ASCII
}

module.exports = { cleanText };
