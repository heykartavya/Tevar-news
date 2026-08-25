const fs = require('fs');
let content = fs.readFileSync('src/lib/LanguageContext.tsx', 'utf8');

// Replace English
content = content.replace(/'Michael Chen'/g, "'Amit Sharma'");
content = content.replace(/'Sarah Jenkins'/g, "'Neha Gupta'");
content = content.replace(/'David Osei'/g, "'Rahul Verma'");
content = content.replace(/'Elena Rodriguez'/g, "'Priya Singh'");

// Replace Hindi
content = content.replace(/'माइकल चेन'/g, "'अमित शर्मा'");
content = content.replace(/'सारा जेनकिंस'/g, "'नेहा गुप्ता'");
content = content.replace(/'डेविड ओसी'/g, "'राहुल वर्मा'");
content = content.replace(/'एलेना रोड्रिग्ज'/g, "'प्रिया सिंह'");

fs.writeFileSync('src/lib/LanguageContext.tsx', content);
