const fs = require('fs');
let content = fs.readFileSync('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/frame2_text.svg', 'utf8');

// Remove all <text> elements (and their contents like <tspan>)
const cleanedContent = content.replace(/<text[\s\S]*?<\/text>/g, '');

fs.writeFileSync('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/frame2_no_text.svg', cleanedContent);
console.log('Successfully removed <text> tags and saved to frame2_no_text.svg');
