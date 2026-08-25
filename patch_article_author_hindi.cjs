const fs = require('fs');
let content = fs.readFileSync('src/pages/ArticlePage.tsx', 'utf8');

// The target area
const oldAuthorBlock = `<div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex flex-shrink-0 items-center justify-center overflow-hidden">
                  <span className="font-serif font-bold text-gray-500">
                    {article.author.charAt(0)}
                  </span>
                </div>
                <div>
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
                </div>
              </div>`;

const newAuthorBlock = `{(() => {
                const authorMember = TEAM_MEMBERS.find(m => m.name === article.author);
                const displayAuthorName = authorMember?.nameHi || authorMember?.name || article.author;
                const displayDesignation = authorMember?.designationHi || authorMember?.designation;
                
                return (
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex flex-shrink-0 items-center justify-center overflow-hidden">
                      {authorMember?.imageUrl ? (
                        <img src={authorMember.imageUrl} alt={displayAuthorName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-serif font-bold text-gray-500 text-lg">
                          {displayAuthorName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-sans font-bold text-gray-900 text-base">
                        {displayAuthorName}
                      </div>
                      {displayDesignation && (
                        <div className="font-sans text-gray-600 text-sm italic mt-0.5">
                          {displayDesignation}
                        </div>
                      )}
                      <div className="font-sans text-gray-500 text-xs mt-1">
                        {article.date}
                      </div>
                    </div>
                  </div>
                );
              })()}`;

if(content.includes(oldAuthorBlock)) {
  content = content.replace(oldAuthorBlock, newAuthorBlock);
  fs.writeFileSync('src/pages/ArticlePage.tsx', content);
  console.log("Patched ArticlePage.tsx successfully!");
} else {
  console.log("Could not find the target block in ArticlePage.tsx!");
}
