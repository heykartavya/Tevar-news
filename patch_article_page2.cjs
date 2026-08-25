const fs = require('fs');
let content = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

// The line is:
// const videoIdMatch = block.content.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);

content = content.replace(
  "/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^\&?\\/\\s]{11})/",
  "/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?|shorts)\\/|.*[?&]v=)|youtu\\.be\\/)([^\"&?\\/\\s]{11})/"
);

// Ah wait, it has double quotes around the string or not? It's a regex literal in JS.
// Let's use a simpler replace strategy:
content = content.replace(
  "/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^\\\"&?\\/\\s]{11})/",
  "/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?|shorts)\\/|.*[?&]v=)|youtu\\.be\\/)([^\\\"&?\\/\\s]{11})/"
);

fs.writeFileSync('src/pages/ArticlePage.tsx', content);
console.log("Patched ArticlePage.tsx regex");
