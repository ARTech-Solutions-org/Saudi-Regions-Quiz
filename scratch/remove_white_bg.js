const fs = require('fs');
let content = fs.readFileSync('artifacts/saudi-regions-quiz/public/frame2_no_text.svg', 'utf-8');
content = content.replace('<rect width="1440" height="1024" fill="white"/>', '<rect width="1440" height="1024" fill="none"/>');
fs.writeFileSync('artifacts/saudi-regions-quiz/public/frame2_no_text.svg', content);
console.log('Done removing white bg!');
