const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

if (!content.includes('/about/our-team')) {
  content = content.replace(
    /<li><Link onClick=\{scrollToTop\} to="\/about\/about-us" className="hover:text-white transition-colors">\{t\('about\.aboutUs'\)\}<\/Link><\/li>/,
    "<li><Link onClick={scrollToTop} to=\"/about/about-us\" className=\"hover:text-white transition-colors\">{t('about.aboutUs')}</Link></li>\n              <li><Link onClick={scrollToTop} to=\"/about/our-team\" className=\"hover:text-white transition-colors\">{t('about.ourTeam')}</Link></li>"
  );
  
  fs.writeFileSync('src/components/Footer.tsx', content);
}
