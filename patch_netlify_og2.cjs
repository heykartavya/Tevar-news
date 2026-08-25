const fs = require('fs');
let content = fs.readFileSync('netlify/functions/og.ts', 'utf8');

content = content.replace(
  "function getYouTubeId(url) {",
  "const getYouTubeId = (url: string) => {"
);

fs.writeFileSync('netlify/functions/og.ts', content);
console.log("Patched netlify/functions/og.ts TS error");
