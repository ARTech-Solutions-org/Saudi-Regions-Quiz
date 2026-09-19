const fs = require('fs');

const destCover = 'f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-cover.svg';
let svg = fs.readFileSync(destCover, 'utf8');

const text1 = `<text id="my saudi journey" x="780" y="280" font-family="Saudi" font-size="44" fill="#DDB572" letter-spacing="2" text-anchor="middle">MY SAUDI JOURNEY</text>`;
const text2 = `<text id="subtitle" x="780" y="600" font-family="Saudi" font-size="18" fill="#DDB572" letter-spacing="2" text-anchor="middle">ANSWER THE QUESTIONS ABOUT EACH CITY TO EARN YOUR STAMPS</text>`;

// Force append just before </svg>
svg = svg.replace('</svg>', `  ${text1}\n  ${text2}\n</svg>`);
fs.writeFileSync(destCover, svg);
console.log('Force appended text to passport-cover.svg');
