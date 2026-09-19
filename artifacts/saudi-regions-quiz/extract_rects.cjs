const fs = require('fs');

const svg = fs.readFileSync('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-page.svg', 'utf8');

// The cards in passport-page.svg might be rects or paths. Let's look for rects or paths.
// Since it's from Illustrator, it might be complex. Let's just output the whole SVG or find its size.
// I will extract paths with stroke or something to see if I can find the cards.
// But earlier we used extract_ids.cjs on frame4.svg.

const regex = /<rect[^>]*>/g;
let match;
while ((match = regex.exec(svg)) !== null) {
  console.log(match[0]);
}
