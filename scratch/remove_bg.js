const fs = require('fs');
let content = fs.readFileSync('artifacts/saudi-regions-quiz/public/frame2_no_text.svg', 'utf-8');
content = content.replace(/<rect id="[^"]+" x="-187" y="-120" width="1462" height="1269" fill="url\(#pattern0_4_28784\)"\/>/g, '<rect id="kingdom_tower_bg" x="-187" y="-120" width="1462" height="1269" fill="none"/>');
fs.writeFileSync('artifacts/saudi-regions-quiz/public/frame2_no_text.svg', content);
console.log('Done!');
