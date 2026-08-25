const fs = require('fs');
let content = fs.readFileSync('src/pages/about/AboutUs.tsx', 'utf8');

content = content.replace(
  '<h4 className="text-xl font-bold font-serif text-gray-900 mb-1">{member.name}</h4>',
  '<h4 className="text-xl font-bold font-serif text-gray-900 mb-1">{member.nameHi || member.name}</h4>'
);

content = content.replace(
  '<p className="text-red-700 font-sans font-bold text-sm tracking-wider uppercase mb-4">{member.designation}</p>',
  '<p className="text-red-700 font-sans font-bold text-sm tracking-wider uppercase mb-4">{member.designationHi || member.designation}</p>'
);

fs.writeFileSync('src/pages/about/AboutUs.tsx', content);
console.log("Patched AboutUs.tsx");
