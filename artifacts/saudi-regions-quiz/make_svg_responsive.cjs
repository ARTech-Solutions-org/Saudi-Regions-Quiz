const fs = require('fs');

// Make the cover SVG responsive (remove fixed width/height, keep viewBox)
// so CSS can control its size
const destCover = 'f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-cover.svg';
let svg = fs.readFileSync(destCover, 'utf8');

// Replace the opening <svg ...> tag to make it responsive
// Keep viewBox but set width/height to 100%
svg = svg.replace(
  /(<svg[^>]*)\bwidth="[^"]*"([^>]*)\bheight="[^"]*"([^>]*>)/,
  '$1width="100%" $2height="100%" $3'
);

// If pattern didn't match (different order), try other order
svg = svg.replace(
  /(<svg[^>]*)\bheight="[^"]*"([^>]*)\bwidth="[^"]*"([^>]*>)/,
  '$1height="100%" $2width="100%" $3'
);

// Ensure preserveAspectRatio keeps the right edge visible (xMaxYMid)
if (!svg.includes('preserveAspectRatio')) {
  svg = svg.replace(/<svg/, '<svg preserveAspectRatio="xMaxYMid meet"');
}

fs.writeFileSync(destCover, svg);
console.log('Cover SVG made responsive with xMaxYMid alignment');

// Check viewBox
const vb = svg.match(/viewBox="([^"]+)"/);
console.log('ViewBox:', vb ? vb[1] : 'none');
