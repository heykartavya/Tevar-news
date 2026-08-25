const fs = require('fs');
let typesContent = fs.readFileSync('src/types.ts', 'utf8');
typesContent = typesContent.replace(
  "export type Category = 'All' | 'Jalaun' | 'Orai' | 'Kalpi' | 'Bundelkhand' | 'National' | 'Breaking' | 'Video';",
  "export type Category = 'All' | 'National' | 'Uttar Pradesh' | 'Bundelkhand' | 'Politics' | 'Education' | 'Crime' | 'Employment' | 'Video' | 'Special News' | 'Breaking';"
);
fs.writeFileSync('src/types.ts', typesContent);

let dataContent = fs.readFileSync('src/data.ts', 'utf8');
const oldCats = `export const CATEGORIES: Category[] = [
  'All',
  'Jalaun',
  'Orai',
  'Kalpi',
  'Bundelkhand',
  'National',
  'Breaking',
  'Video'
];`;
const newCats = `export const CATEGORIES: Category[] = [
  'All',
  'National',
  'Uttar Pradesh',
  'Bundelkhand',
  'Politics',
  'Education',
  'Crime',
  'Employment',
  'Video',
  'Special News'
];`;
dataContent = dataContent.replace(oldCats, newCats);
fs.writeFileSync('src/data.ts', dataContent);

let langContent = fs.readFileSync('src/lib/LanguageContext.tsx', 'utf8');

// I'll update the translations manually
