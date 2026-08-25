const fs = require('fs');
let content = fs.readFileSync('src/lib/LanguageContext.tsx', 'utf8');

// First remove existing nav items
content = content.replace(/\s*'nav\.[^']+':\s*'[^']+',/g, '');

const navTranslations = {
  en: {
    'nav.all': 'All',
    'nav.national': 'National',
    'nav.uttarpradesh': 'Uttar Pradesh',
    'nav.bundelkhand': 'Bundelkhand',
    'nav.politics': 'Politics',
    'nav.education': 'Education',
    'nav.crime': 'Crime',
    'nav.employment': 'Employment',
    'nav.video': 'Video',
    'nav.specialnews': 'Special News'
  },
  hinglish: {
    'nav.all': 'All',
    'nav.national': 'National',
    'nav.uttarpradesh': 'Uttar Pradesh',
    'nav.bundelkhand': 'Bundelkhand',
    'nav.politics': 'Politics',
    'nav.education': 'Education',
    'nav.crime': 'Crime',
    'nav.employment': 'Employment',
    'nav.video': 'Video',
    'nav.specialnews': 'Special News'
  },
  hi: {
    'nav.all': 'सभी',
    'nav.national': 'राष्ट्रीय',
    'nav.uttarpradesh': 'उत्तर प्रदेश',
    'nav.bundelkhand': 'बुंदेलखंड',
    'nav.politics': 'राजनीति',
    'nav.education': 'शिक्षा',
    'nav.crime': 'अपराध',
    'nav.employment': 'रोजगार',
    'nav.video': 'वीडियो',
    'nav.specialnews': 'विशेष खबर'
  }
};

const lines = content.split('\n');

function insertNav(lang) {
  const index = lines.findIndex(line => line.includes(lang + ': {'));
  if (index !== -1) {
    const adds = Object.entries(navTranslations[lang]).map(([k, v]) => "    '" + k + "': '" + v + "',");
    lines.splice(index + 1, 0, ...adds);
  }
}

insertNav('en');
insertNav('hinglish');
insertNav('hi');

fs.writeFileSync('src/lib/LanguageContext.tsx', lines.join('\n'));
