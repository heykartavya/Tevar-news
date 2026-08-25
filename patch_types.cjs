const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace(
  "export type Category = 'All' | 'National' | 'Uttar Pradesh' | 'Bundelkhand' | 'Politics' | 'Education' | 'Crime' | 'Employment' | 'Video' | 'Special News';",
  "export type Category = 'All' | 'Jalaun' | 'Orai' | 'Kalpi' | 'Bundelkhand' | 'National' | 'Breaking' | 'Video';"
);
fs.writeFileSync('src/types.ts', content);
