const fs = require('fs');

const destCover = 'f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-cover.svg';
let svg = fs.readFileSync(destCover, 'utf8');

// ViewBox: 0 0 510 354
// We show the RIGHT half of the SVG (x from 255 to 510)
// So center of visible area = 255 + 127.5 = 382.5
// The original text (COMPLETE THE CHALLENGES) was around y=155-185
// The original text (ACROSS SAUDI ARABIA) was around y=311

// Remove old injected text elements
svg = svg.replace(/<text[^>]*>[\s\S]*?<\/text>/g, '');

// Re-inject text centered in the RIGHT half (x=382)
const newText = `
  <text x="382" y="155" font-family="Saudi" font-size="22" font-weight="bold" fill="#6ab345" letter-spacing="1" text-anchor="middle" style="font-family: Saudi, serif; font-weight: bold;">COMPLETE THE</text>
  <text x="382" y="185" font-family="Saudi" font-size="28" font-weight="bold" fill="#6ab345" letter-spacing="1" text-anchor="middle" style="font-family: Saudi, serif; font-weight: bold;">CHALLENGES</text>
  <text x="382" y="311" font-family="Saudi" font-size="14" fill="#6ab345" letter-spacing="3" text-anchor="middle" style="font-family: Saudi, serif;">ACROSS SAUDI ARABIA</text>
`;

svg = svg.replace('</svg>', newText + '</svg>');

fs.writeFileSync(destCover, svg);
console.log('Fixed! Text now centered in the right half of the cover SVG (x=382).');
