const fs = require('fs');

const destCover = 'f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-cover.svg';
let svg = fs.readFileSync(destCover, 'utf8');

// I will append the text to the end of the SVG, right before </svg>
// Cover viewBox is 1074 785
// Center X is 1074 / 2 = 537. But the cover we show is the right half, so X should be around 75% which is 800.
// Let's just put it at X="805" Y="300" for title, and Y="600" for subtitle.

const text1 = `<text id="my saudi journey" x="780" y="280" font-family="Saudi" font-size="36" fill="#DDB572" letter-spacing="2" text-anchor="middle">MY SAUDI JOURNEY</text>`;
const text2 = `<text id="subtitle" x="780" y="600" font-family="Saudi" font-size="14" fill="#DDB572" letter-spacing="2" text-anchor="middle">ANSWER THE QUESTIONS ABOUT EACH CITY TO EARN YOUR STAMPS</text>`;

if (!svg.includes('MY SAUDI JOURNEY')) {
  svg = svg.replace('</svg>', `  ${text1}\n  ${text2}\n</svg>`);
  fs.writeFileSync(destCover, svg);
  console.log('Appended text to passport-cover.svg');
} else {
  console.log('Text already exists');
}
