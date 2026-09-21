const fs = require('fs');
let cover = fs.readFileSync('public/passport-cover.svg', 'utf8');
cover = cover.replace(/width="100%"/, 'width="510"').replace(/height="100%"/, 'height="354"');
fs.writeFileSync('public/passport-cover.svg', cover);

let page = fs.readFileSync('public/passport-page.svg', 'utf8');
page = page.replace(/<svg /, '<svg width="1017" height="1005" ');
fs.writeFileSync('public/passport-page.svg', page);
console.log('Fixed SVG dimensions');
