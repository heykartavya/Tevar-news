const fs = require('fs');
let content = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

content = content.replace(
  'const videoIdMatch = block.content.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);',
  'const videoIdMatch = block.content.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?|shorts)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);'
);

fs.writeFileSync('src/pages/ArticlePage.tsx', content);
console.log("Patched ArticlePage.tsx regex again");
