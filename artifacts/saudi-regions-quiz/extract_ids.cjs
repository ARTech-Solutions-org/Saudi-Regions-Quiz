const fs = require('fs');
const svg = fs.readFileSync('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/frame4.svg', 'utf8');
const regex = /id=\"([^\"]*)\"/g;
let match;
const ids = new Set();
while ((match = regex.exec(svg)) !== null) {
  ids.add(match[1]);
}
console.log(Array.from(ids).join('\n'));
