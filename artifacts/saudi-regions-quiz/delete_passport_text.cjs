const fs = require('fs');

function removeTextGroups(filename, ids) {
  let svg = fs.readFileSync(filename, 'utf8');
  for (const id of ids) {
    // Escape string for regex
    const safeId = id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`<g id="${safeId}"[^>]*>[\\s\\S]*?<\\/g>`, 'g');
    svg = svg.replace(regex, '');
  }
  fs.writeFileSync(filename, svg);
  console.log(`Cleaned ${filename}`);
}

const coverIds = [
  'my saudi journey',
  'Answer the questions about each city\nto earn your',
];

const pageIds = [
  'Riyadh',
  'Madinah',
  'Al-Qassim',
  'Makkah',
  'Eastern\nProvince',
  'Asir',
  'Tabuk',
  'Jazan',
  'Al- Bahah',
  'Hail',
  'Najran',
  'Northern\nBorders',
  'Al- Jouf'
];

removeTextGroups('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-cover.svg', coverIds);
removeTextGroups('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-page.svg', pageIds);
