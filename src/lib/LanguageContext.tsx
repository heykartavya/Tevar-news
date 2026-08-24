import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteLanguage, Article } from './types';

interface LanguageContextType {
  language: SiteLanguage;
  setLanguage: (lang: SiteLanguage) => void;
  t: (key: string) => string;
  l: (article: Article, field: 'title' | 'excerpt' | 'content') => string;
}

const translations = {
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
    'nav.specialnews': 'Special News',
    'home.topStories': 'Top Stories',
    'home.trendingNow': 'Trending Now',
    'home.theDailyBrief': 'The Daily Brief',
    'home.editorsPicks': 'Editor\'s Picks',
    'home.newsletterDesc': 'Expert analysis and breaking news, delivered to your inbox every morning.',
    'home.signUpFree': 'Sign Up Free',
    'home.terms': 'By subscribing, you agree to our Terms of Service.',
    'home.search': 'Search news...',
    'article.by': 'By',
    'article.staffWriter': 'Staff Writer',
    'article.trending': 'Trending',
    'about.title': 'About Us',
    'about.aboutUs': 'About Us',
    'about.contactUs': 'Contact Us',
    'about.editorialPolicy': 'Editorial Policy',
    'about.correctionPolicy': 'Correction Policy',
    'about.privacyPolicy': 'Privacy Policy',
    'about.terms': 'Terms & Conditions',
    'about.disclaimer': 'Disclaimer',
    'about.grievance': 'Grievance / Complaint',
    'about.advertise': 'Advertise With Us',
    'story.p1': 'Founded in 2026, <strong>Tévar News Media</strong> emerged from a simple but powerful idea: that in an era of rapid change and information overload, the world needs a steady, uncompromising, and deeply analytical voice.',
    'story.p2': 'We began as a small digital newsroom in the heart of the city, driven by a collective of veteran journalists and modern technologists. Our goal was never just to report what happened, but to explain <em>why</em> it matters, how it impacts our readers, and what it means for the future.',
    'story.p3': 'Today, we have grown into a global network of correspondents spanning five continents. Despite our growth, our core mission remains unchanged. We believe in the power of truth, the necessity of context, and the fundamental right of the public to be informed.',
    'careers.desc': 'At Tévar News, we believe our journalism is only as good as the people behind it. We are always looking for curious, relentless, and passionate individuals to join our newsroom and our business operations.',
    'careers.open': 'Open Positions',
    'careers.view': 'View Details',
    'careers.footer': 'Don\'t see a role that fits? We\'re always interested in hearing from talented professionals. Send your resume and portfolio to',
    'ethics.desc': 'Trust is the foundation of our relationship with our readers. At Tévar News, we hold ourselves to the highest standards of journalistic integrity, independence, and accountability.',
    'ethics.1.title': '1. Truth and Accuracy',
    'ethics.1.desc': 'We are committed to discovering and reporting the truth. We verify our facts thoroughly before publication. When we make mistakes, we correct them promptly, transparently, and prominently.',
    'ethics.2.title': '2. Independence',
    'ethics.2.desc': 'Our editorial decisions are made independently of any political, commercial, or personal interests. We do not accept gifts, favors, or compensation from those we cover. Advertisers and sponsors have absolutely no influence over our coverage.',
    'ethics.3.title': '3. Fairness and Impartiality',
    'ethics.3.desc': 'We strive to present all sides of a story accurately and fairly. We give subjects of critical reporting a reasonable opportunity to respond before publication. We clearly distinguish between news reports and opinion pieces.',
    'ethics.4.title': '4. Protection of Sources',
    'ethics.4.desc': 'We fiercely protect the identities of confidential sources when we believe their information is of vital public interest and they face potential retaliation. We use anonymous sources only when absolutely necessary and when the information cannot be obtained otherwise.',
    'contact.desc': 'Whether you have a news tip, a question about your subscription, or want to inquire about advertising, we want to hear from you.',
    'contact.newsroom': 'Newsroom & Tips',
    'contact.general': 'General Tips',
    'contact.letters': 'Letters to the Editor',
    'contact.support': 'Customer Support',
    'contact.subscriptions': 'Subscriptions',
    'contact.call': 'Call Us',
    'contact.hours': 'Mon-Fri, 9am - 5pm EST',
    'contact.hq': 'Headquarters',
    'team.p1.name': 'Shailendra Singh Tomar',
    'team.p1.role': 'Editor-in-Chief',
    'team.p2.name': 'Aisha Patel',
    'team.p2.role': 'Managing Editor',
    'team.p3.name': 'Michael Chen',
    'team.p3.role': 'Lead Investigative Reporter',
    'team.p4.name': 'Sarah Jenkins',
    'team.p4.role': 'Head of Digital Strategy',
    'team.p5.name': 'David Osei',
    'team.p5.role': 'Chief Photographer',
    'team.p6.name': 'Elena Rodriguez',
    'team.p6.role': 'Data Journalism Lead',
  },
  hinglish: {
    // UI remains English in Hinglish mode
    'nav.all': 'All',
    'nav.national': 'National',
    'nav.uttarpradesh': 'Uttar Pradesh',
    'nav.bundelkhand': 'Bundelkhand',
    'nav.politics': 'Politics',
    'nav.education': 'Education',
    'nav.crime': 'Crime',
    'nav.employment': 'Employment',
    'nav.video': 'Video',
    'nav.specialnews': 'Special News',
    'home.topStories': 'Top Stories',
    'home.trendingNow': 'Trending Now',
    'home.theDailyBrief': 'The Daily Brief',
    'home.editorsPicks': 'Editor\'s Picks',
    'home.newsletterDesc': 'Expert analysis and breaking news, delivered to your inbox every morning.',
    'home.signUpFree': 'Sign Up Free',
    'home.terms': 'By subscribing, you agree to our Terms of Service.',
    'home.search': 'Search news...',
    'article.by': 'By',
    'article.staffWriter': 'Staff Writer',
    'article.trending': 'Trending',
    'about.title': 'About Us',
    'about.aboutUs': 'About Us',
    'about.contactUs': 'Contact Us',
    'about.editorialPolicy': 'Editorial Policy',
    'about.correctionPolicy': 'Correction Policy',
    'about.privacyPolicy': 'Privacy Policy',
    'about.terms': 'Terms & Conditions',
    'about.disclaimer': 'Disclaimer',
    'about.grievance': 'Grievance / Complaint',
    'about.advertise': 'Advertise With Us',
    'story.p1': 'Founded in 2026, <strong>Tévar News Media</strong> emerged from a simple but powerful idea: that in an era of rapid change and information overload, the world needs a steady, uncompromising, and deeply analytical voice.',
    'story.p2': 'We began as a small digital newsroom in the heart of the city, driven by a collective of veteran journalists and modern technologists. Our goal was never just to report what happened, but to explain <em>why</em> it matters, how it impacts our readers, and what it means for the future.',
    'story.p3': 'Today, we have grown into a global network of correspondents spanning five continents. Despite our growth, our core mission remains unchanged. We believe in the power of truth, the necessity of context, and the fundamental right of the public to be informed.',
    'careers.desc': 'At Tévar News, we believe our journalism is only as good as the people behind it. We are always looking for curious, relentless, and passionate individuals to join our newsroom and our business operations.',
    'careers.open': 'Open Positions',
    'careers.view': 'View Details',
    'careers.footer': 'Don\'t see a role that fits? We\'re always interested in hearing from talented professionals. Send your resume and portfolio to',
    'ethics.desc': 'Trust is the foundation of our relationship with our readers. At Tévar News, we hold ourselves to the highest standards of journalistic integrity, independence, and accountability.',
    'ethics.1.title': '1. Truth and Accuracy',
    'ethics.1.desc': 'We are committed to discovering and reporting the truth. We verify our facts thoroughly before publication. When we make mistakes, we correct them promptly, transparently, and prominently.',
    'ethics.2.title': '2. Independence',
    'ethics.2.desc': 'Our editorial decisions are made independently of any political, commercial, or personal interests. We do not accept gifts, favors, or compensation from those we cover. Advertisers and sponsors have absolutely no influence over our coverage.',
    'ethics.3.title': '3. Fairness and Impartiality',
    'ethics.3.desc': 'We strive to present all sides of a story accurately and fairly. We give subjects of critical reporting a reasonable opportunity to respond before publication. We clearly distinguish between news reports and opinion pieces.',
    'ethics.4.title': '4. Protection of Sources',
    'ethics.4.desc': 'We fiercely protect the identities of confidential sources when we believe their information is of vital public interest and they face potential retaliation. We use anonymous sources only when absolutely necessary and when the information cannot be obtained otherwise.',
    'contact.desc': 'Whether you have a news tip, a question about your subscription, or want to inquire about advertising, we want to hear from you.',
    'contact.newsroom': 'Newsroom & Tips',
    'contact.general': 'General Tips',
    'contact.letters': 'Letters to the Editor',
    'contact.support': 'Customer Support',
    'contact.subscriptions': 'Subscriptions',
    'contact.call': 'Call Us',
    'contact.hours': 'Mon-Fri, 9am - 5pm EST',
    'contact.hq': 'Headquarters',
    'team.p1.name': 'Shailendra Singh Tomar',
    'team.p1.role': 'Editor-in-Chief',
    'team.p2.name': 'Aisha Patel',
    'team.p2.role': 'Managing Editor',
    'team.p3.name': 'Michael Chen',
    'team.p3.role': 'Lead Investigative Reporter',
    'team.p4.name': 'Sarah Jenkins',
    'team.p4.role': 'Head of Digital Strategy',
    'team.p5.name': 'David Osei',
    'team.p5.role': 'Chief Photographer',
    'team.p6.name': 'Elena Rodriguez',
    'team.p6.role': 'Data Journalism Lead',
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
    'nav.specialnews': 'विशेष खबर',
    'home.topStories': 'मुख्य खबरें',
    'home.trendingNow': 'ट्रेंडिंग न्यूज़',
    'home.theDailyBrief': 'दैनिक समाचार',
    'home.editorsPicks': 'संपादक की पसंद',
    'home.newsletterDesc': 'विशेषज्ञ विश्लेषण और ताज़ा खबरें, हर सुबह आपके इनबॉक्स में।',
    'home.signUpFree': 'मुफ़्त साइन अप करें',
    'home.terms': 'सदस्यता लेकर, आप हमारी सेवा की शर्तों से सहमत होते हैं।',
    'home.search': 'समाचार खोजें...',
    'article.by': 'द्वारा',
    'article.staffWriter': 'कर्मचारी लेखक',
    'article.trending': 'ट्रेंडिंग',
    'about.title': 'हमारे बारे में',
    'about.aboutUs': 'हमारे बारे में',
    'about.contactUs': 'संपर्क करें',
    'about.editorialPolicy': 'संपादकीय नीति',
    'about.correctionPolicy': 'सुधार नीति',
    'about.privacyPolicy': 'गोपनीयता नीति',
    'about.terms': 'नियम व शर्तें',
    'about.disclaimer': 'अस्वीकरण',
    'about.grievance': 'शिकायत निवारण',
    'about.advertise': 'हमारे साथ विज्ञापन करें',
    'story.p1': '2026 में स्थापित, <strong>Tévar News Media</strong> एक सरल लेकिन शक्तिशाली विचार से उभरा: कि तेजी से बदलते और अत्यधिक सूचना वाले युग में, दुनिया को एक स्थिर, समझौता न करने वाली और गहराई से विश्लेषणात्मक आवाज की आवश्यकता है।',
    'story.p2': 'हमने शहर के केंद्र में एक छोटे डिजिटल न्यूज़रूम के रूप में शुरुआत की, जो अनुभवी पत्रकारों और आधुनिक प्रौद्योगिकीविदों के एक समूह द्वारा संचालित है। हमारा लक्ष्य केवल यह रिपोर्ट करना नहीं था कि क्या हुआ, बल्कि यह समझाना था कि यह <em>क्यों</em> मायने रखता है, यह हमारे पाठकों को कैसे प्रभावित करता है, और भविष्य के लिए इसका क्या अर्थ है।',
    'story.p3': 'आज, हम पांच महाद्वीपों में फैले संवाददाताओं के एक वैश्विक नेटवर्क में विकसित हो गए हैं। हमारे विकास के बावजूद, हमारा मूल मिशन अपरिवर्तित है। हम सच्चाई की शक्ति, संदर्भ की आवश्यकता, और जनता के सूचित होने के मौलिक अधिकार में विश्वास करते हैं।',
    'careers.desc': 'टेवर न्यूज़ में, हमारा मानना है कि हमारी पत्रकारिता उतनी ही अच्छी है जितने इसके पीछे के लोग हैं। हम हमेशा अपने न्यूज़रूम और हमारे व्यावसायिक संचालन में शामिल होने के लिए जिज्ञासु, अथक और भावुक व्यक्तियों की तलाश में रहते हैं।',
    'careers.open': 'खुले पद',
    'careers.view': 'विवरण देखें',
    'careers.footer': 'क्या आपको कोई ऐसा पद नहीं दिख रहा जो आपके अनुकूल हो? हम हमेशा प्रतिभाशाली पेशेवरों से सुनने में रुचि रखते हैं। अपना रेज़्यूमे और पोर्टफोलियो भेजें',
    'ethics.desc': 'विश्वास हमारे पाठकों के साथ हमारे संबंधों की नींव है। टेवर न्यूज़ में, हम खुद को पत्रकारिता की अखंडता, स्वतंत्रता और जवाबदेही के उच्चतम मानकों पर रखते हैं।',
    'ethics.1.title': '1. सत्य और सटीकता',
    'ethics.1.desc': 'हम सच्चाई को खोजने और रिपोर्ट करने के लिए प्रतिबद्ध हैं। हम प्रकाशन से पहले अपने तथ्यों को अच्छी तरह से सत्यापित करते हैं। जब हम गलतियाँ करते हैं, तो हम उन्हें तुरंत, पारदर्शी और प्रमुखता से सुधारते हैं।',
    'ethics.2.title': '2. स्वतंत्रता',
    'ethics.2.desc': 'हमारे संपादकीय निर्णय किसी भी राजनीतिक, व्यावसायिक या व्यक्तिगत हितों से स्वतंत्र रूप से लिए जाते हैं। हम जिन्हें कवर करते हैं उनसे हम उपहार, एहसान या मुआवजा स्वीकार नहीं करते हैं। विज्ञापनदाताओं और प्रायोजकों का हमारे कवरेज पर बिल्कुल कोई प्रभाव नहीं है।',
    'ethics.3.title': '3. निष्पक्षता और तटस्थता',
    'ethics.3.desc': 'हम किसी कहानी के सभी पक्षों को सटीक और निष्पक्ष रूप से प्रस्तुत करने का प्रयास करते हैं। हम प्रकाशन से पहले आलोचनात्मक रिपोर्टिंग के विषयों को जवाब देने का उचित अवसर देते हैं। हम समाचार रिपोर्टों और राय के टुकड़ों के बीच स्पष्ट रूप से अंतर करते हैं।',
    'ethics.4.title': '4. स्रोतों की सुरक्षा',
    'ethics.4.desc': 'हम गोपनीय स्रोतों की पहचान की दृढ़ता से रक्षा करते हैं जब हमारा मानना ​​है कि उनकी जानकारी महत्वपूर्ण जनहित की है और उन्हें संभावित प्रतिशोध का सामना करना पड़ सकता है। हम अनाम स्रोतों का उपयोग केवल तभी करते हैं जब नितांत आवश्यक हो और जब जानकारी अन्यथा प्राप्त न की जा सके।',
    'contact.desc': 'चाहे आपके पास कोई समाचार टिप हो, आपकी सदस्यता के बारे में कोई प्रश्न हो, या विज्ञापन के बारे में पूछताछ करना हो, हम आपसे सुनना चाहते हैं।',
    'contact.newsroom': 'न्यूज़रूम और टिप्स',
    'contact.general': 'सामान्य टिप्स',
    'contact.letters': 'संपादक को पत्र',
    'contact.support': 'ग्राहक सहायता',
    'contact.subscriptions': 'सदस्यता',
    'contact.call': 'हमें कॉल करें',
    'contact.hours': 'सोम-शुक्र, सुबह 9 बजे - शाम 5 बजे ईएसटी',
    'contact.hq': 'मुख्यालय',
    'team.p1.name': 'कर्तव्य सिंह',
    'team.p1.role': 'प्रधान संपादक',
    'team.p2.name': 'आयशा पटेल',
    'team.p2.role': 'प्रबंध संपादक',
    'team.p3.name': 'माइकल चेन',
    'team.p3.role': 'लीड इन्वेस्टिगेटिव रिपोर्टर',
    'team.p4.name': 'सारा जेनकिंस',
    'team.p4.role': 'डिजिटल रणनीति प्रमुख',
    'team.p5.name': 'डेविड ओसी',
    'team.p5.role': 'मुख्य फ़ोटोग्राफ़र',
    'team.p6.name': 'एलेना रोड्रिग्ज',
    'team.p6.role': 'डेटा जर्नलिज्म लीड',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SiteLanguage>('en');

  useEffect(() => {
    const saved = localStorage.getItem('site_language') as SiteLanguage;
    if (saved && (saved === 'en' || saved === 'hinglish' || saved === 'hi')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: SiteLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('site_language', lang);
  };

  const t = (key: string): string => {
    return (translations[language] as any)[key] || (translations['en'] as any)[key] || key;
  };

  const l = (article: Article, field: 'title' | 'excerpt' | 'content'): string => {
    // English mode: English text
    // Hinglish mode: Hindi text
    // Hindi mode: Hindi text
    
    // For older articles that don't have titleEn/titleHi, fallback to 'title'
    const isHindiMode = language === 'hi' || language === 'hinglish';
    
    if (field === 'title') {
      if (isHindiMode && article.titleHi) return article.titleHi;
      if (!isHindiMode && article.titleEn) return article.titleEn;
      return article.title; // fallback
    }
    
    if (field === 'excerpt') {
      if (isHindiMode && article.excerptHi) return article.excerptHi;
      if (!isHindiMode && article.excerptEn) return article.excerptEn;
      return article.excerpt; // fallback
    }
    
    if (field === 'content') {
      if (isHindiMode && article.contentHi) return article.contentHi;
      if (!isHindiMode && article.contentEn) return article.contentEn;
      return article.content || ''; // fallback
    }

    return '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, l }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
