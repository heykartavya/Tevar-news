const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Need to import TEAM_MEMBERS
const importStatement = "import { MOCK_ARTICLES, CATEGORIES, TEAM_MEMBERS } from '../data';";
content = content.replace("import { MOCK_ARTICLES, CATEGORIES } from '../data';", importStatement);

// Now find the author input field
const oldInput = `<input type="text" required value={newArticle.author} onChange={e => setNewArticle({...newArticle, author: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />`;

const newInput = `<select required value={newArticle.author} onChange={e => setNewArticle({...newArticle, author: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                    <option value="" disabled>Select Author</option>
                    {TEAM_MEMBERS.map(member => (
                      <option key={member.id} value={member.name}>
                        {member.name} - {member.designation}
                      </option>
                    ))}
                  </select>`;

content = content.replace(oldInput, newInput);
fs.writeFileSync('src/pages/Admin.tsx', content);
console.log("Patched Admin.tsx");
