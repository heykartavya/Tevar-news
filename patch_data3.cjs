const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

content = content.replace(
  "name: 'Shailendra Singh Tomar',",
  "name: 'Shailendra Singh Tomar',\n    nameHi: 'शैलेंद्र सिंह तोमर',"
);

content = content.replace(
  "designation: 'Founder & Editor in Chief',",
  "designation: 'Founder & Editor in Chief',\n    designationHi: 'संस्थापक एवं प्रधान संपादक',"
);

content = content.replace(
  "name: 'Desk',",
  "name: 'Desk',\n    nameHi: 'डेस्क',"
);

content = content.replace(
  "designation: 'Editorial Team',",
  "designation: 'Editorial Team',\n    designationHi: 'संपादकीय टीम',"
);

fs.writeFileSync('src/data.ts', content);
console.log("Patched data.ts");
