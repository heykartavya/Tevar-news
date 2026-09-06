const fs = require('fs');
let content = fs.readFileSync('src/lib/LanguageContext.tsx', 'utf8');

// Insert english
content = content.replace(
  /'about.aboutUs': 'About Us',/,
  "'about.aboutUs': 'About Us',\n    'about.ourTeam': 'Our Team',"
);

// Insert hindi
content = content.replace(
  /'about.aboutUs': 'हमारे बारे में',/,
  "'about.aboutUs': 'हमारे बारे में',\n    'about.ourTeam': 'हमारी टीम',"
);

fs.writeFileSync('src/lib/LanguageContext.tsx', content);
