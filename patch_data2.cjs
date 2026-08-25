const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

content = content.replace("export interface TeamMember {\\n  id: string;\\n  name: string;\\n  designation: string;\\n  phone: string;\\n  email: string;\\n  imageUrl: string;\\n}\\n", "");
// also I might have used a literal string replacement, let's just use regex.

content = content.replace(/export interface TeamMember \{[\s\S]*?\}/, "import { TeamMember } from './types';");
fs.writeFileSync('src/data.ts', content);
console.log("Fixed data.ts");
