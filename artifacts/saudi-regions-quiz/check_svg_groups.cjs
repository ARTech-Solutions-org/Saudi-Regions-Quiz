const fs = require('fs');
const content = fs.readFileSync('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/frame2.svg', 'utf8');

const groups = [...content.matchAll(/<g([^>]*)id="([^"]+)"([^>]*)>/g)];
console.log('Groups with ID:');
groups.forEach(g => console.log(g[2]));
