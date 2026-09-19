const fs = require('fs');
const content = fs.readFileSync('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/frame2_no_text.svg', 'utf8');
const rects = [...content.matchAll(/<rect([^>]+)>/g)];
const parsed = rects.map(r => {
  const attr = r[1];
  const x = attr.match(/x="([^"]+)"/);
  const y = attr.match(/y="([^"]+)"/);
  const w = attr.match(/width="([^"]+)"/);
  const h = attr.match(/height="([^"]+)"/);
  return { x: x?x[1]:'0', y: y?y[1]:'0', w: w?w[1]:'0', h: h?h[1]:'0' };
});
const rightRects = parsed.filter(p => parseFloat(p.x) > 1000 && parseFloat(p.w) > 150 && parseFloat(p.w) < 300);
console.log(rightRects.slice(0, 15));
