const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('OurTeam')) {
  content = content.replace(
    /import \{ AboutUs \} from '\.\/pages\/about\/AboutUs';/,
    "import { AboutUs } from './pages/about/AboutUs';\nimport { OurTeam } from './pages/about/OurTeam';"
  );
  
  content = content.replace(
    /<Route path="about-us" element=\{<AboutUs \/>\} \/>/,
    '<Route path="about-us" element={<AboutUs />} />\n            <Route path="our-team" element={<OurTeam />} />'
  );
  
  fs.writeFileSync('src/App.tsx', content);
}
