const fs = require('fs');

const srcCover = 'G:/Downloads/passport-cover.svg';
const srcPage = 'G:/Downloads/passport-page.svg';
const destCover = 'f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-cover.svg';
const destPage = 'f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-page.svg';

const coverIds = [
  { id: 'my saudi journey', text: 'MY SAUDI JOURNEY', size: 36, fill: '#DDB572' },
  { id: 'Answer the questions about each city\nto earn your', text: 'Answer the questions about each city to earn your stamps', size: 14, fill: '#DDB572' }
];

const pageIds = [
  'Riyadh', 'Madinah', 'Al-Qassim', 'Makkah', 'Eastern\\nProvince',
  'Asir', 'Tabuk', 'Jazan', 'Al- Bahah', 'Hail', 'Najran', 
  'Northern\\nBorders', 'Al- Jouf'
];

function processSvg(src, dest, items) {
  let svg = fs.readFileSync(src, 'utf8');
  
  for (const item of items) {
    const id = typeof item === 'string' ? item : item.id;
    const textStr = typeof item === 'string' ? id.replace('\\n', ' ').toUpperCase() : item.text;
    const size = typeof item === 'string' ? '18' : item.size;
    const fill = typeof item === 'string' ? '#203F37' : item.fill;
    
    const safeId = id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    // Look for <g id="ID"> or <path id="ID">
    // We want to capture the first M command inside it to get X and Y.
    const regex = new RegExp(`(<(?:g|path) id="${safeId}"[^>]*>[\\s\\S]*?M\\s*)([\\d\\.]+)\\s+([\\d\\.]+)([\\s\\S]*?<\\/(?:g|path)>)`, 'i');
    
    const match = svg.match(regex);
    if (match) {
      const x = match[2];
      const y = match[3];
      
      const newTextNode = `<text id="${id}" x="${x}" y="${y}" font-family="Saudi" font-size="${size}" fill="${fill}" letter-spacing="2" text-anchor="middle">${textStr}</text>`;
      
      // Replace the entire matched group/path with the new text node
      svg = svg.replace(match[0], newTextNode);
    }
  }
  
  fs.writeFileSync(dest, svg);
  console.log(`Processed ${dest}`);
}

processSvg(srcCover, destCover, coverIds);
processSvg(srcPage, destPage, pageIds);
