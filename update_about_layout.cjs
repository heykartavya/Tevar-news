const fs = require('fs');
let content = fs.readFileSync('src/pages/about/AboutLayout.tsx', 'utf8');

if (!content.includes('/about/our-team')) {
  content = content.replace(
    /\{ path: '\/about\/about-us', label: t\('about.aboutUs'\) \},/,
    "{ path: '/about/about-us', label: t('about.aboutUs') },\n    { path: '/about/our-team', label: t('about.ourTeam') },"
  );
  fs.writeFileSync('src/pages/about/AboutLayout.tsx', content);
}
