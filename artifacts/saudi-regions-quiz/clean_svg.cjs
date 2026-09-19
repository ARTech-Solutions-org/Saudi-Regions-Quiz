const fs = require('fs');
const content = fs.readFileSync('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/frame2.svg', 'utf8');

// Define zones where text is located (and we want to clear it)
const zones = [
  // "RIYADH REGION" banner text zone (approximate based on image)
  // Assuming it's in the top left, roughly x: 40-500, y: 20-150
  { x1: 0, x2: 600, y1: 0, y2: 150 },
  
  // Q1 text zone (Progress bar label)
  { x1: 644, x2: 1200, y1: 224, y2: 266 },

  // Q1 Box
  { x1: 605, x2: 1024, y1: 300, y2: 441 },
  // Q1 Options
  { x1: 1045, x2: 1234, y1: 300, y2: 441 },

  // Q2 Box
  { x1: 605, x2: 1024, y1: 472, y2: 613 },
  // Q2 Options
  { x1: 1045, x2: 1234, y1: 472, y2: 613 },

  // Q3 Box
  { x1: 605, x2: 1024, y1: 644, y2: 785 },
  // Q3 Options
  { x1: 1045, x2: 1234, y1: 644, y2: 785 },

  // Bottom buttons
  { x1: 605, x2: 1234, y1: 848, y2: 920 },
];

function isPointInZones(x, y) {
  for (const z of zones) {
    if (x >= z.x1 && x <= z.x2 && y >= z.y1 && y <= z.y2) {
      return true;
    }
  }
  return false;
}

let removedCount = 0;
const cleanedContent = content.replace(/<path[^>]+d="([^"]+)"[^>]*>/g, (match, d) => {
  // Find first absolute move command M x y or M x,y
  const mMatch = d.match(/^M\s*([\d.-]+)[,\s]+([\d.-]+)/);
  if (mMatch) {
    const x = parseFloat(mMatch[1]);
    const y = parseFloat(mMatch[2]);
    if (isPointInZones(x, y)) {
      removedCount++;
      return ''; // Delete this path!
    }
  }
  return match;
});

console.log(`Removed ${removedCount} paths!`);
fs.writeFileSync('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/frame2_clean.svg', cleanedContent);
console.log('Saved to frame2_clean.svg');
