const fs = require('fs');
let content = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

const importStatement = "import { MOCK_ARTICLES, TEAM_MEMBERS } from '../data';";
content = content.replace("import { MOCK_ARTICLES } from '../data';", importStatement);

// Now let's find the author area. It looks something like:
// <div className="font-sans font-bold text-gray-900 text-sm">
//   {article.author}
// </div>
// <div className="font-sans text-gray-500 text-xs">
//   {article.date}
// </div>

const targetJSX = `<div>
                  <div className="font-sans font-bold text-gray-900 text-sm">
                    {article.author}
                  </div>
                  <div className="font-sans text-gray-500 text-xs">
                    {article.date}
                  </div>
                </div>`;

const newJSX = `<div>
                  <div className="font-sans font-bold text-gray-900 text-sm flex items-center">
                    {article.author}
                    {TEAM_MEMBERS.find(m => m.name === article.author) && (
                       <span className="ml-2 font-normal text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                         {TEAM_MEMBERS.find(m => m.name === article.author)?.designation}
                       </span>
                    )}
                  </div>
                  <div className="font-sans text-gray-500 text-xs mt-1">
                    {article.date}
                  </div>
                </div>`;

content = content.replace(targetJSX, newJSX);
fs.writeFileSync('src/pages/ArticlePage.tsx', content);
console.log("Patched ArticlePage.tsx");
