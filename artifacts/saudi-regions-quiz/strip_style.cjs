const fs = require('fs');

function stripStyle(filePath) {
  let svg = fs.readFileSync(filePath, 'utf8');
  // Remove the style block we injected
  const newSvg = svg.replace(/<style>\s*@font-face\s*\{[\s\S]*?\}\s*<\/style>/i, '');
  if (svg !== newSvg) {
    fs.writeFileSync(filePath, newSvg);
    console.log(`Stripped style from ${filePath}`);
  } else {
    console.log(`No style found in ${filePath}`);
  }
}

stripStyle('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-cover.svg');
stripStyle('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-page.svg');
