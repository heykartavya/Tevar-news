const fs = require('fs');
const content = `import { Category, Article } from './types';

export const CATEGORIES: Category[] = [
  'All',
  'Jalaun',
  'Orai',
  'Kalpi',
  'Bundelkhand',
  'National',
  'Breaking',
  'Video'
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'जालौन ओडीए की बोर्ड बैठक में उरई महायोजना-2031 को मिली मंजूरी, शहर में लगेंगी हाईमास्ट लाइटें',
    titleEn: 'Orai Masterplan 2031 approved in Jalaun ODA board meeting, high-mast lights to be installed in the city',
    titleHi: 'जालौन ओडीए की बोर्ड बैठक में उरई महायोजना-2031 को मिली मंजूरी, शहर में लगेंगी हाईमास्ट लाइटें',
    excerpt: 'उरई में हाईमास्ट लाइटों और महायोजना को लेकर बड़ा फैसला। जालौन के विकास को मिलेगी नई रफ्तार।',
    excerptEn: 'Big decision regarding high-mast lights and masterplan in Orai. Jalaun development will get a new pace.',
    excerptHi: 'उरई में हाईमास्ट लाइटों और महायोजना को लेकर बड़ा फैसला। जालौन के विकास को मिलेगी नई रफ्तार।',
    category: 'Orai',
    author: 'डेस्क',
    date: 'Aug 25, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000',
    readTime: '3 min read',
    isTrending: true
  },
  {
    id: '2',
    title: 'बुंदेलखंड एक्सप्रेस-वे के पास अवैध खनन के खिलाफ बड़ी कार्रवाई, 10 ट्रक सीज',
    titleEn: 'Major action against illegal mining near Bundelkhand Expressway, 10 trucks seized',
    titleHi: 'बुंदेलखंड एक्सप्रेस-वे के पास अवैध खनन के खिलाफ बड़ी कार्रवाई, 10 ट्रक सीज',
    excerpt: 'अवैध खनन माफियाओं पर प्रशासन का शिकंजा, एक्सप्रेस-वे के किनारे लगातार हो रही थी बालू की चोरी।',
    excerptEn: 'Administration tightens grip on illegal mining mafias, sand theft was continuous near expressway.',
    excerptHi: 'अवैध खनन माफियाओं पर प्रशासन का शिकंजा, एक्सप्रेस-वे के किनारे लगातार हो रही थी बालू की चोरी।',
    category: 'Bundelkhand',
    author: 'डेस्क',
    date: 'Aug 25, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1582216503943-4cc0bb9d300e?auto=format&fit=crop&q=80&w=1000',
    readTime: '4 min read',
    isTrending: true
  },
  {
    id: '3',
    title: 'उरई को बुंदेलखंड का सबसे बड़ा स्पोर्ट्स कॉलेज मिलने की उम्मीद, युवाओं के लिए रोजगार के नए अवसर',
    titleEn: 'Orai expects to get Bundelkhand biggest sports college, new employment opportunities for youth',
    titleHi: 'उरई को बुंदेलखंड का सबसे बड़ा स्पोर्ट्स कॉलेज मिलने की उम्मीद, युवाओं के लिए रोजगार के नए अवसर',
    excerpt: 'खेल और रोजगार के क्षेत्र में उरई को बड़ी सौगात मिल सकती है। प्रशासन ने शासन को भेजा प्रस्ताव।',
    excerptEn: 'Orai might get a big gift in sports and employment sector. Administration sent proposal to government.',
    excerptHi: 'खेल और रोजगार के क्षेत्र में उरई को बड़ी सौगात मिल सकती है। प्रशासन ने शासन को भेजा प्रस्ताव।',
    category: 'Orai',
    author: 'डेस्क',
    date: 'Aug 24, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1000',
    readTime: '5 min read'
  },
  {
    id: '4',
    title: 'नीति आयोग की बैठक में सीएम योगी ने बुंदेलखंड के लिए दो नए एम्स की मांग रखी',
    titleEn: 'CM Yogi puts forward demand for two new AIIMS for Bundelkhand in NITI Aayog meeting',
    titleHi: 'नीति आयोग की बैठक में सीएम योगी ने बुंदेलखंड के लिए दो नए एम्स की मांग रखी',
    excerpt: 'जालौन और बुंदेलखंड के अन्य हिस्सों में स्वास्थ्य सुविधाओं को लेकर सीएम ने रखा बड़ा प्रस्ताव।',
    excerptEn: 'CM put forward a big proposal regarding health facilities in Jalaun and other parts of Bundelkhand.',
    excerptHi: 'जालौन और बुंदेलखंड के अन्य हिस्सों में स्वास्थ्य सुविधाओं को लेकर सीएम ने रखा बड़ा प्रस्ताव।',
    category: 'Jalaun',
    author: 'डेस्क',
    date: 'Aug 24, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000',
    readTime: '4 min read',
    isTrending: true
  },
  {
    id: '5',
    title: 'यूपी में रक्षाबंधन पर 60 वर्ष से अधिक उम्र की महिलाओं के लिए मुफ्त बस यात्रा का ऐलान',
    titleEn: 'Free bus travel announced for women above 60 years on Raksha Bandhan in UP',
    titleHi: 'यूपी में रक्षाबंधन पर 60 वर्ष से अधिक उम्र की महिलाओं के लिए मुफ्त बस यात्रा का ऐलान',
    excerpt: 'कैबिनेट बैठक में मुख्यमंत्री योगी आदित्यनाथ ने कई बड़े फैसलों पर लगाई मुहर।',
    excerptEn: 'Chief Minister Yogi Adityanath approved many big decisions in cabinet meeting.',
    excerptHi: 'कैबिनेट बैठक में मुख्यमंत्री योगी आदित्यनाथ ने कई बड़े फैसलों पर लगाई मुहर।',
    category: 'National',
    author: 'डेस्क',
    date: 'Aug 25, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000',
    readTime: '3 min read'
  },
  {
    id: '6',
    title: 'कालपी में बारावफात जुलूस को लेकर प्रशासन सख्त, शांति व्यवस्था बनाए रखने की अपील',
    titleEn: 'Administration strict regarding Barawafat procession in Kalpi, appeals to maintain peace',
    titleHi: 'कालपी में बारावफात जुलूस को लेकर प्रशासन सख्त, शांति व्यवस्था बनाए रखने की अपील',
    excerpt: 'कालपी में अतिरिक्त स्वागत द्वारों को लेकर विवाद के बाद पुलिस ने किया फ्लैग मार्च।',
    excerptEn: 'Police conducted flag march after dispute regarding extra welcome gates in Kalpi.',
    excerptHi: 'कालपी में अतिरिक्त स्वागत द्वारों को लेकर विवाद के बाद पुलिस ने किया फ्लैग मार्च।',
    category: 'Kalpi',
    author: 'डेस्क',
    date: 'Aug 25, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000',
    readTime: '4 min read'
  },
  {
    id: '7',
    title: 'जालौन और उरई को अलग जिला बनाने की मांग ने पकड़ा जोर, सोशल मीडिया पर छिड़ी बहस',
    titleEn: 'Demand to make Jalaun and Orai separate districts gains momentum, debate starts on social media',
    titleHi: 'जालौन और उरई को अलग जिला बनाने की मांग ने पकड़ा जोर, सोशल मीडिया पर छिड़ी बहस',
    excerpt: 'बौद्धिक काउंसिल ग्रुप की इस मांग पर स्थानीय लोगों में चर्चा जोरों पर है।',
    excerptEn: 'Discussions are in full swing among local people on this demand of Intellectual Council Group.',
    excerptHi: 'बौद्धिक काउंसिल ग्रुप की इस मांग पर स्थानीय लोगों में चर्चा जोरों पर है।',
    category: 'Jalaun',
    author: 'डेस्क',
    date: 'Aug 23, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1518131336149-a1b6a18d1796?auto=format&fit=crop&q=80&w=1000',
    readTime: '5 min read'
  }
];
`;
fs.writeFileSync('src/data.ts', content);
