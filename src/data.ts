import { Article } from './types';

export const CATEGORIES = ['All', 'National', 'Uttar Pradesh', 'Bundelkhand', 'Politics', 'Education', 'Crime', 'Employment', 'Video', 'Special News'];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Global Markets Rally as New AI Regulations Provide Clarity',
    titleEn: 'Global Markets Rally as New AI Regulations Provide Clarity',
    titleHi: 'नए AI नियमों से निवेशकों को स्पष्टता, वैश्विक बाजारों में उछाल',
    excerpt: 'Despite early quarter concerns, major tech conglomerates report record-breaking earnings, driving global market indices to new heights.',
    excerptEn: 'Despite early quarter concerns, major tech conglomerates report record-breaking earnings, driving global market indices to new heights.',
    excerptHi: 'शुरुआती तिमाही चिंताओं के बावजूद, प्रमुख टेक कंपनियों ने रिकॉर्ड तोड़ कमाई दर्ज की, जिससे वैश्विक बाजार सूचकांक नई ऊंचाइयों पर पहुंच गए।',
    category: 'Employment',
    author: 'Sarah Jenkins',
    date: 'Aug 24, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000',
    readTime: '5 min read',
    isTrending: true
  },
  {
    id: '2',
    title: 'James Webb Space Telescope Discovers Biosignatures on Exoplanet',
    titleEn: 'James Webb Space Telescope Discovers Biosignatures on Exoplanet',
    titleHi: 'जेम्स वेब स्पेस टेलीस्कोप ने एक्सोप्लैनेट पर बायोसिग्नेचर की खोज की',
    excerpt: 'Scientists announce a groundbreaking discovery of potential life-indicating molecules in the atmosphere of K2-18b, a habitable-zone exoplanet.',
    excerptEn: 'Scientists announce a groundbreaking discovery of potential life-indicating molecules in the atmosphere of K2-18b, a habitable-zone exoplanet.',
    excerptHi: 'वैज्ञानिकों ने K2-18b के वायुमंडल में जीवन का संकेत देने वाले अणुओं की एक अभूतपूर्व खोज की घोषणा की है, जो एक रहने योग्य एक्सोप्लैनेट है।',
    category: 'Education',
    author: 'David Chen',
    date: 'Aug 23, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000',
    readTime: '8 min read',
    isTrending: true
  },
  {
    id: '3',
    title: 'Historic Climate Summit 2026 Reaches New Carbon Offset Agreement',
    titleEn: 'Historic Climate Summit 2026 Reaches New Carbon Offset Agreement',
    titleHi: 'ऐतिहासिक जलवायु शिखर सम्मेलन 2026 में नए कार्बन ऑफसेट समझौते पर सहमति',
    excerpt: 'After weeks of tense negotiations in Geneva, participating nations have finally signed a comprehensive treaty to aggressively cut emissions by 2030.',
    excerptEn: 'After weeks of tense negotiations in Geneva, participating nations have finally signed a comprehensive treaty to aggressively cut emissions by 2030.',
    excerptHi: 'जिनेवा में हफ्तों की तनावपूर्ण बातचीत के बाद, भाग लेने वाले देशों ने अंततः 2030 तक उत्सर्जन में कटौती करने के लिए एक व्यापक संधि पर हस्ताक्षर किए हैं।',
    category: 'National',
    author: 'Elena Rostova',
    date: 'Aug 24, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1529107336415-4dc8c99a8b66?auto=format&fit=crop&q=80&w=1000',
    readTime: '6 min read'
  },
  {
    id: '4',
    title: 'Quantum Computing Milestones Reached Ahead of Schedule',
    titleEn: 'Quantum Computing Milestones Reached Ahead of Schedule',
    titleHi: 'क्वांटम कंप्यूटिंग के मील के पत्थर समय से पहले हासिल किए गए',
    excerpt: 'Researchers announce stable qubits functioning at room temperature, a breakthrough that could accelerate quantum adoption by a decade.',
    excerptEn: 'Researchers announce stable qubits functioning at room temperature, a breakthrough that could accelerate quantum adoption by a decade.',
    excerptHi: 'शोधकर्ताओं ने कमरे के तापमान पर काम करने वाले स्थिर क्यूबिट्स की घोषणा की, एक ऐसी सफलता जो क्वांटम अपनाने में एक दशक की तेजी ला सकती है।',
    category: 'Special News',
    author: 'Dr. Alan Turing',
    date: 'Aug 22, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1000',
    readTime: '4 min read',
    isTrending: true
  },
  {
    id: '5',
    title: 'Summer Blockbuster "Neon Horizon" Breaks Global Box Office Records',
    titleEn: 'Summer Blockbuster "Neon Horizon" Breaks Global Box Office Records',
    titleHi: 'समर ब्लॉकबस्टर "नियोन होराइजन" ने तोड़े ग्लोबल बॉक्स ऑफिस के रिकॉर्ड',
    excerpt: 'The highly anticipated sci-fi epic grossed over $1 billion in its opening weekend, setting a new benchmark for cinematic achievements.',
    excerptEn: 'The highly anticipated sci-fi epic grossed over $1 billion in its opening weekend, setting a new benchmark for cinematic achievements.',
    excerptHi: 'बहुप्रतीक्षित साइंस फिक्शन महाकाव्य ने अपने शुरुआती सप्ताहांत में $1 बिलियन से अधिक की कमाई की, जिसने सिनेमाई उपलब्धियों के लिए एक नया मानदंड स्थापित किया।',
    category: 'Video',
    author: 'Isabella Vance',
    date: 'Aug 23, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000',
    readTime: '3 min read'
  },
  {
    id: '6',
    title: 'New Policy Shifts Aim to Revitalize Local Manufacturing',
    titleEn: 'New Policy Shifts Aim to Revitalize Local Manufacturing',
    titleHi: 'नई नीति में बदलाव का उद्देश्य स्थानीय विनिर्माण को पुनर्जीवित करना है',
    excerpt: 'The latest legislative package introduces significant incentives for domestic producers, aiming to reshape supply chain dependencies.',
    excerptEn: 'The latest legislative package introduces significant incentives for domestic producers, aiming to reshape supply chain dependencies.',
    excerptHi: 'नवीनतम विधायी पैकेज घरेलू उत्पादकों के लिए महत्वपूर्ण प्रोत्साहन पेश करता है, जिसका उद्देश्य आपूर्ति श्रृंखला निर्भरता को फिर से आकार देना है।',
    category: 'Politics',
    author: 'Marcus Wright',
    date: 'Aug 24, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1507208773393-40d9fc670acf?auto=format&fit=crop&q=80&w=1000',
    readTime: '7 min read',
    isTrending: true
  },
  {
    id: '7',
    title: 'Electric Vehicle Adoption Reaches Tipping Point Globally',
    titleEn: 'Electric Vehicle Adoption Reaches Tipping Point Globally',
    titleHi: 'इलेक्ट्रिक वाहनों को अपनाना वैश्विक स्तर पर चरम बिंदु पर पहुंचा',
    excerpt: 'Sales data confirms that EVs now outpace traditional combustion engines across five major global economies for the first time.',
    excerptEn: 'Sales data confirms that EVs now outpace traditional combustion engines across five major global economies for the first time.',
    excerptHi: 'बिक्री डेटा इस बात की पुष्टि करता है कि ईवी अब पहली बार पांच प्रमुख वैश्विक अर्थव्यवस्थाओं में पारंपरिक दहन इंजनों को पीछे छोड़ चुके हैं।',
    category: 'Employment',
    author: 'Thomas Götze',
    date: 'Aug 21, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000',
    readTime: '5 min read'
  }
];
