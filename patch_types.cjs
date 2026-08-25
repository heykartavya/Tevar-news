const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace(
  'export interface TeamMember {',
  'export interface TeamMember {\n  nameHi?: string;\n  designationHi?: string;'
);

fs.writeFileSync('src/types.ts', content);
console.log("Patched types.ts");
