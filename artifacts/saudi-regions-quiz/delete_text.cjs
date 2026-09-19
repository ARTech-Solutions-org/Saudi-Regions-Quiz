const fs = require('fs');
let svg = fs.readFileSync('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/frame4.svg', 'utf8');

// Regex to delete the groups entirely!
svg = svg.replace(/<g id="Game score"[^>]*>[\s\S]*?<\/g>/, '');
svg = svg.replace(/<g id="Regions completed"[^>]*>[\s\S]*?<\/g>/, '');
svg = svg.replace(/<g id="Congratulations!"[^>]*>[\s\S]*?<\/g>/, '');
svg = svg.replace(/<g id="315"[^>]*>[\s\S]*?<\/g>/, '');
svg = svg.replace(/<g id="5\/13"[^>]*>[\s\S]*?<\/g>/, '');

fs.writeFileSync('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/frame4.svg', svg);
console.log('Removed text groups completely');
