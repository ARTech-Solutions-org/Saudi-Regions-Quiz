const fs = require('fs');

function extractIds(filename) {
  const svg = fs.readFileSync(filename, 'utf8');
  const regex = /id="([^"]*)"/g;
  let match;
  const ids = new Set();
  while ((match = regex.exec(svg)) !== null) {
    if (match[1].match(/[a-zA-Z]{3,}/)) { // filter to readable words
      ids.add(match[1]);
    }
  }
  console.log('--- ' + filename + ' ---');
  console.log(Array.from(ids).join('\n'));
}

extractIds('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-cover.svg');
extractIds('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-page.svg');
