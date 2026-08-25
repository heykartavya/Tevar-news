const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

content += `\n@layer base {
  html, body, #root {
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
  }
}
`;

content += `\n@layer utilities {
  .word-break-all {
    word-break: break-word;
    overflow-wrap: anywhere;
  }
}
`;

fs.writeFileSync('src/index.css', content);
console.log("Patched css");
