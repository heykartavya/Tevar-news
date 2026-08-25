const fs = require('fs');
let content = fs.readFileSync('src/pages/about/AboutUs.tsx', 'utf8');

const importStatement = "import { TEAM_MEMBERS } from '../../data';\n";
content = content.replace("import { useLanguage } from '../../lib/LanguageContext';", "import { useLanguage } from '../../lib/LanguageContext';\n" + importStatement);

const startHtml = '<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 not-prose">';
const endHtml = '</div>\n        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">Official Contact</h3>';

const teamCode = `<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 not-prose">
          {TEAM_MEMBERS.filter(m => m.name !== 'Desk').map((member) => (
            <div key={member.id} className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {member.imageUrl && (
                <div className="w-full bg-gray-50 flex justify-center items-center border-b border-gray-100">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name} 
                    className="w-full h-auto max-h-[400px] object-contain object-top"
                  />
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h4 className="text-xl font-bold font-serif text-gray-900 mb-1">{member.name}</h4>
                <p className="text-red-700 font-sans font-bold text-sm tracking-wider uppercase mb-4">{member.designation}</p>
                <div className="font-sans text-sm text-gray-600 space-y-2 mt-auto">
                  {member.phone && (
                    <p className="flex items-center">
                      <span className="font-semibold mr-2 w-12 text-gray-900">Phone:</span> 
                      <a href={\`tel:+91\${member.phone}\`} className="hover:text-red-700 transition-colors">{member.phone}</a>
                    </p>
                  )}
                  {member.email && (
                    <p className="flex items-center">
                      <span className="font-semibold mr-2 w-12 text-gray-900">Email:</span> 
                      <a href={\`mailto:\${member.email}\`} className="hover:text-red-700 transition-colors break-all">{member.email}</a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>`;

// Regex replacement
content = content.replace(/<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 not-prose">[\s\S]*?<\/div>\s*<\/div>\s*<h3 className="text-2xl font-bold font-sans mt-8 mb-4">Official Contact<\/h3>/, teamCode + '\n        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">Official Contact</h3>');

fs.writeFileSync('src/pages/about/AboutUs.tsx', content);
console.log("Patched AboutUs.tsx");
