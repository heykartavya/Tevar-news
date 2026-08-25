const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

// replace the marquee animation config
content = content.replace(
  '--animate-marquee: marquee 60s linear infinite;',
  '--animate-marquee: marquee 120s linear infinite;'
);

// replace the keyframes
content = content.replace(
  '@keyframes marquee {\n    0% { transform: translateX(100%); }\n    100% { transform: translateX(-100%); }\n  }',
  '@keyframes marquee {\n    0% { transform: translateX(0); }\n    100% { transform: translateX(-50%); }\n  }'
);

fs.writeFileSync('src/index.css', content);
