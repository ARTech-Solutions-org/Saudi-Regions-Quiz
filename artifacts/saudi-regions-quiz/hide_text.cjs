const fs = require('fs');
let svg = fs.readFileSync('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/frame4.svg', 'utf8');

// Replace the ID definitions with the same ID but add display="none"
svg = svg.replace(/id="Congratulations!"/g, 'id="Congratulations!" display="none"');
svg = svg.replace(/id="Game score"/g, 'id="Game score" display="none"');
svg = svg.replace(/id="315"/g, 'id="315" display="none"');
svg = svg.replace(/id="Regions completed"/g, 'id="Regions completed" display="none"');
svg = svg.replace(/id="5\/13"/g, 'id="5/13" display="none"');

fs.writeFileSync('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/frame4.svg', svg);
console.log("Done hiding SVG text");
