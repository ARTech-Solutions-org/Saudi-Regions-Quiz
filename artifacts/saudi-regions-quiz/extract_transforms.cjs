const fs = require('fs');

const filename = 'G:/Downloads/passport-page.svg';
const svg = fs.readFileSync(filename, 'utf8');

const ids = [
  'Riyadh', 'Madinah', 'Al-Qassim', 'Makkah', 'Eastern\\nProvince',
  'Asir', 'Tabuk', 'Jazan', 'Al- Bahah', 'Hail', 'Najran', 
  'Northern\\nBorders', 'Al- Jouf'
];

const coords = {};
for (const id of ids) {
  // Try to find the group and its transform attribute
  const safeId = id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`<g id="${safeId}"[^>]*transform="matrix\\([^,]+,[^,]+,[^,]+,[^,]+,([^,]+),([^\\)]+)\\)"`, 'i');
  const match = regex.exec(svg);
  if (match) {
    coords[id] = {
      x: parseFloat(match[1]),
      y: parseFloat(match[2]),
      leftPct: (parseFloat(match[1]) / 1440) * 100,
      topPct: (parseFloat(match[2]) / 1024) * 100
    };
  } else {
    // maybe it doesn't have a transform but has x and y
    coords[id] = 'Not found with matrix transform';
  }
}

console.log(JSON.stringify(coords, null, 2));
