const fs = require('fs');

const destCover = 'f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-cover.svg';
let svg = fs.readFileSync(destCover, 'utf8');

// Get viewBox dimensions
const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
console.log('ViewBox:', viewBoxMatch ? viewBoxMatch[1] : 'not found');

// Count green fill groups (these are the text outlines from Illustrator)
const greenGroups = svg.match(/<g fill="#6ab345"[^>]*>/g);
console.log('Green fill groups count:', greenGroups ? greenGroups.length : 0);

// Show first and last few chars around green fill
const idx = svg.indexOf('<g fill="#6ab345"');
if (idx > -1) {
  console.log('Context around first green group:');
  console.log(svg.substring(idx - 200, idx + 200));
}

// Check for any transform on green groups
const transformMatch = svg.match(/transform="translate\((\d+\.?\d*), (\d+\.?\d*)\)"/g);
if (transformMatch) {
  console.log('Sample transforms:', transformMatch.slice(0, 5));
}
