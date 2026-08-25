const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

const targetTheme = `@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", ui-serif, Georgia, serif;`;

const replacementTheme = `@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", ui-serif, Georgia, serif;
  --animate-marquee: marquee 25s linear infinite;
  
  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }`;

if(content.includes(targetTheme)) {
    content = content.replace(targetTheme, replacementTheme);
    fs.writeFileSync('src/index.css', content);
}
