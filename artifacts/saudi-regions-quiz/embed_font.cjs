const fs = require('fs');

const fontPath = 'f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/fonts/Saudi-Bold.otf';
const fontBase64 = fs.readFileSync(fontPath).toString('base64');

const styleBlock = `
<style>
  @font-face {
    font-family: 'Saudi';
    src: url(data:font/opentype;charset=utf-8;base64,${fontBase64}) format('opentype');
    font-weight: bold;
    font-style: normal;
  }
</style>
`;

function injectFont(filePath) {
  let svg = fs.readFileSync(filePath, 'utf8');
  
  // Insert right after the opening <svg> tag
  if (!svg.includes('@font-face {')) {
    svg = svg.replace(/<svg[^>]*>/i, (match) => match + '\n' + styleBlock);
    fs.writeFileSync(filePath, svg);
    console.log(`Injected font into ${filePath}`);
  } else {
    console.log(`Font already exists in ${filePath}`);
  }
}

injectFont('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-cover.svg');
injectFont('f:/ARTech/Saudi-Regions-Quiz-Game/Saudi-Regions-Quiz-Game/artifacts/saudi-regions-quiz/public/passport-page.svg');
