const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

const additionalTypes = `
export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  phone?: string;
  email?: string;
  imageUrl?: string;
}
`;

if (!content.includes('TeamMember')) {
  content = content + "\n" + additionalTypes;
  fs.writeFileSync('src/types.ts', content);
}
console.log("Patched types.ts");
