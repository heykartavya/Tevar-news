const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// The original import might be: import { CATEGORIES, MOCK_ARTICLES } from '../data';
content = content.replace("import { CATEGORIES, MOCK_ARTICLES } from '../data';", "import { CATEGORIES, MOCK_ARTICLES, TEAM_MEMBERS } from '../data';");
// Just in case it's the other way around somewhere else
content = content.replace("import { MOCK_ARTICLES, CATEGORIES } from '../data';", "import { CATEGORIES, MOCK_ARTICLES, TEAM_MEMBERS } from '../data';");

fs.writeFileSync('src/pages/Admin.tsx', content);
console.log("Patched Admin.tsx");
