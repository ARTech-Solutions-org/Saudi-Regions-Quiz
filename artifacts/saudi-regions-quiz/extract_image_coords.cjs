const fs = require('fs');

const svg = fs.readFileSync('G:/Downloads/passport-page.svg', 'utf8');

// Find all image tags
const regex = /<image[^>]*x="([^"]+)"[^>]*y="([^"]+)"[^>]*width="([^"]+)"[^>]*height="([^"]+)"/g;
let match;
let i = 0;
const results = [];
while ((match = regex.exec(svg)) !== null) {
  const x = parseFloat(match[1]);
  const y = parseFloat(match[2]);
  const w = parseFloat(match[3]);
  const h = parseFloat(match[4]);
  
  const cx = x + (w/2);
  const cy = y + (h/2);
  
  results.push({
    index: i,
    x: (cx / 1440) * 100,
    y: (cy / 1024) * 100,
    w: (w / 1440) * 100
  });
  i++;
}

console.log(JSON.stringify(results, null, 2));
