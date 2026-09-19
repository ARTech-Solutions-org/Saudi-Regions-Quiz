const fs = require('fs');

const destCover = 'f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-cover.svg';
let svg = fs.readFileSync(destCover, 'utf8');

// Remove all injected text elements first
svg = svg.replace(/<text id="my saudi journey"[\s\S]*?<\/text>/g, '');
svg = svg.replace(/<text id="subtitle"[\s\S]*?<\/text>/g, '');

// Clean up any trailing </svg> duplicates
// Make sure there's only one </svg>
const lastSvgClose = svg.lastIndexOf('</svg>');
svg = svg.substring(0, lastSvgClose + 6); // keep up to and including last </svg>

// Now append the text ONCE with correct Saudi font
const text1 = `<text x="780" y="280" font-family="Saudi" font-size="44" fill="#DDB572" letter-spacing="4" text-anchor="middle" style="font-family: Saudi, serif;">MY SAUDI JOURNEY</text>`;
const text2 = `<text x="780" y="610" font-family="Saudi" font-size="18" fill="#DDB572" letter-spacing="2" text-anchor="middle" style="font-family: Saudi, serif;">ANSWER THE QUESTIONS ABOUT EACH CITY</text>`;
const text3 = `<text x="780" y="640" font-family="Saudi" font-size="18" fill="#DDB572" letter-spacing="2" text-anchor="middle" style="font-family: Saudi, serif;">TO EARN YOUR STAMPS</text>`;

svg = svg.replace('</svg>', `  ${text1}\n  ${text2}\n  ${text3}\n</svg>`);

fs.writeFileSync(destCover, svg);
console.log('Done! Single clean text injected into passport-cover.svg');
