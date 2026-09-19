const fs = require('fs');

const destCover = 'f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-cover.svg';
let svg = fs.readFileSync(destCover, 'utf8');

// ViewBox is "0 0 510 353.999987"
// From the transforms we can see green text groups start around x=336, y=311 (ACROSS SAUDI ARABIA bottom)
// And earlier in the file around y=165 (COMPLETE THE CHALLENGES)

// Strategy: Remove ALL <g fill="#6ab345"> groups and replace with SVG text nodes
// These groups contain the path outlines for the green text

// Remove all groups with fill="#6ab345"
// Each group starts with <g fill="#6ab345" and ends with </g></g></g>
// We need to match them properly

// First, let's find the wrapping parent group for all green text
// by finding the first and last occurrence

// Replace all green fill groups (text outlines) with actual text elements
// From analysis: 
//   "COMPLETE THE CHALLENGES" is around y=165 in SVG space (viewbox 0 0 510 354)
//   "ACROSS SAUDI ARABIA" is around y=311 in SVG space

// Remove the entire block of green text path outlines
// They're all nested inside parent <g> wrappers

// Use a regex to remove all g elements with fill="#6ab345"
// These are all the letter path outlines
let cleaned = svg;

// Remove green fill groups (text outlines from Illustrator)
// Each letter is a <g fill="#6ab345" fill-opacity="1"><g transform="..."><g><path .../></g></g></g>
cleaned = cleaned.replace(/<g fill="#6ab345" fill-opacity="1">[\s\S]*?<\/g><\/g><\/g>/g, '');

// Now add text elements in their place before </svg>
// ViewBox: 0 0 510 354
// "COMPLETE THE CHALLENGES" center x≈255, y≈165 region
// "ACROSS SAUDI ARABIA" center x≈255, y≈311 region

// Remove old injected text
cleaned = cleaned.replace(/<text[^>]*>[\s\S]*?<\/text>/g, '');

const newText = `
  <text x="255" y="155" font-family="Saudi" font-size="22" font-weight="bold" fill="#6ab345" letter-spacing="1" text-anchor="middle" style="font-family: Saudi, serif; font-weight: bold;">COMPLETE THE</text>
  <text x="255" y="185" font-family="Saudi" font-size="28" font-weight="bold" fill="#6ab345" letter-spacing="1" text-anchor="middle" style="font-family: Saudi, serif; font-weight: bold;">CHALLENGES</text>
  <text x="255" y="311" font-family="Saudi" font-size="14" fill="#6ab345" letter-spacing="3" text-anchor="middle" style="font-family: Saudi, serif;">ACROSS SAUDI ARABIA</text>
`;

cleaned = cleaned.replace('</svg>', newText + '</svg>');

fs.writeFileSync(destCover, cleaned);
console.log('Done! Replaced path text with Saudi font text elements.');
