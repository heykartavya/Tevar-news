const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');
content = content.replace(/date: string;/, 'date: string;\n  updatedAt?: string;');
fs.writeFileSync('src/types.ts', content);
