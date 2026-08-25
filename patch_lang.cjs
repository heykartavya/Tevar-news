const fs = require('fs');
let content = fs.readFileSync('src/lib/LanguageContext.tsx', 'utf8');

content = content.replace(/\s*'nav\.[^']+':\s*'[^']+',/g, '');

const navTranslations = {
  en: {
    'nav.all': 'All',
    'nav.jalaun': 'Jalaun',
    'nav.orai': 'Orai',
    'nav.kalpi': 'Kalpi',
    'nav.bundelkhand': 'Bundelkhand',
    'nav.national': 'National',
    'nav.breaking': 'Breaking',
    'nav.video': 'Video'
  },
  hinglish: {
    'nav.all': 'All',
    'nav.jalaun': 'Jalaun',
    'nav.orai': 'Orai',
    'nav.kalpi': 'Kalpi',
    'nav.bundelkhand': 'Bundelkhand',
    'nav.national': 'National',
    'nav.breaking': 'Breaking',
    'nav.video': 'Video'
  },
  hi: {
    'nav.all': 'सभी',
    'nav.jalaun': 'जालौन',
    'nav.orai': 'उरई',
    'nav.kalpi': 'कालपी',
    'nav.bundelkhand': 'बुंदेलखंड',
    'nav.national': 'राष्ट्रीय',
    'nav.breaking': 'ब्रेकिंग',
    'nav.video': 'वीडियो'
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

content = lines.join('\n').replace(/useState<SiteLanguage>\('en'\)/, "useState<SiteLanguage>('hi')");
fs.writeFileSync('src/lib/LanguageContext.tsx', content);
