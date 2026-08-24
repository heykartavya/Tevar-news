import React from 'react';
import { useLanguage } from '../../lib/LanguageContext';

export const Terms: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl">
      <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">{t('about.terms')}</h2>
      
      <div className="prose prose-lg prose-red max-w-none text-gray-800">
        <p className="text-sm text-gray-500 mb-8 font-sans">प्रभावी तिथि: 24 अगस्त 2026</p>
        
        <p className="mb-6 font-sans text-lg leading-relaxed">
          <strong>Tévar News Media</strong> की वेबसाइट, मोबाइल एप्लिकेशन और सेवाओं में आपका स्वागत है। साइट को एक्सेस या उपयोग करके, आप इन विस्तृत नियमों और शर्तों (Terms of Service / Terms & Conditions) से कानूनी रूप से बाध्य होने के लिए सहमत होते हैं। यदि आप इन शर्तों के किसी भी हिस्से से सहमत नहीं हैं, तो कृपया हमारी वेबसाइट और सेवाओं का उपयोग तुरंत बंद कर दें।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-10 mb-4 text-gray-900">1. शर्तों की स्वीकृति (Acceptance of Terms)</h3>
        <p className="font-sans mb-6">
          Tevar News वेबसाइट (tevarnews.com) और इससे जुड़ी किसी भी सामग्री का उपयोग यह दर्शाता है कि आपने इन नियमों और शर्तों, हमारी गोपनीयता नीति (Privacy Policy), और अस्वीकरण (Disclaimer) को पढ़ और समझ लिया है और आप इसका पूरी तरह से पालन करने के लिए सहमत हैं।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-10 mb-4 text-gray-900">2. शर्तों में संशोधन (Changes to Terms)</h3>
        <p className="font-sans mb-6">
          हम अपने विवेक पर किसी भी समय इन नियमों और शर्तों को संशोधित, अद्यतन (Update) या बदलने का अधिकार सुरक्षित रखते हैं। कोई भी संशोधन इस पृष्ठ पर प्रकाशित होते ही प्रभावी हो जाएगा। यह आपकी जिम्मेदारी है कि आप समय-समय पर इन शर्तों की समीक्षा करें। निरंतर उपयोग का अर्थ है कि आप संशोधित शर्तों को स्वीकार करते हैं।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-10 mb-4 text-gray-900">3. वेबसाइट का उपयोग और प्रतिबंध (Use of Website and Restrictions)</h3>
        <p className="font-sans mb-4">वेबसाइट का उपयोग करते समय, आप सहमत हैं कि आप निम्नलिखित कार्य नहीं करेंगे:</p>
        <ul className="list-disc pl-6 mb-6 font-sans space-y-2">
          <li>साइट का उपयोग किसी भी गैर-कानूनी, अवैध या अनधिकृत उद्देश्य के लिए करना।</li>
          <li>कोई भी ऐसी सामग्री पोस्ट करना या प्रसारित करना जो अपमानजनक, अश्लील, घृणास्पद, धमकी भरी, नस्लवादी, या किसी भी व्यक्ति या समुदाय की भावनाओं को आहत करने वाली हो।</li>
          <li>हमारी वेबसाइट के बुनियादी ढांचे पर अनुचित रूप से बड़ा भार डालना (जैसे DDoS हमला) या साइट की सुरक्षा से छेड़छाड़ करना।</li>
          <li>स्वचालित स्क्रिप्ट, बॉट, स्पाइडर या स्क्रैपर (Scraper) का उपयोग करके हमारी सामग्री को बिना अनुमति के एक्सेस या कॉपी करना।</li>
          <li>किसी अन्य व्यक्ति, इकाई या Tevar News के कर्मचारी का रूप धारण करना (Impersonation)।</li>
        </ul>

        <h3 className="text-2xl font-bold font-sans mt-10 mb-4 text-gray-900">4. बौद्धिक संपदा अधिकार (Intellectual Property Rights)</h3>
        <p className="font-sans mb-6">
          Tevar News पर प्रदर्शित सभी सामग्री—जिसमें लेख, समाचार, टेक्स्ट, वीडियो, चित्र, लोगो, ग्राफिक्स, ऑडियो, डिज़ाइन और सॉफ़्टवेयर शामिल हैं—Tévar News Media या इसके सामग्री प्रदाताओं की विशेष संपत्ति है। यह भारतीय और अंतर्राष्ट्रीय कॉपीराइट (Copyright) तथा ट्रेडमार्क कानूनों द्वारा संरक्षित है।<br/><br/>
          आप केवल व्यक्तिगत, गैर-व्यावसायिक उपयोग के लिए सामग्री पढ़ और साझा कर सकते हैं। बिना हमारी पूर्व लिखित अनुमति के, आप किसी भी सामग्री को कॉपी, पुनरुत्पादित (Reproduce), पुनर्प्रकाशित (Republish), अपलोड, या व्यावसायिक रूप से वितरित नहीं कर सकते।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-10 mb-4 text-gray-900">5. उपयोगकर्ता द्वारा उत्पन्न सामग्री (User-Generated Content)</h3>
        <p className="font-sans mb-4">
          यदि आप हमारी वेबसाइट पर टिप्पणी (Comments), लेख, सुझाव या कोई अन्य सामग्री (User Content) सबमिट करते हैं, तो:
        </p>
        <ul className="list-disc pl-6 mb-6 font-sans space-y-2">
          <li>आप हमें उस सामग्री का उपयोग, संशोधन, प्रकाशन, अनुवाद और वितरण करने का विश्वव्यापी, रॉयल्टी-मुक्त, स्थायी लाइसेंस (License) प्रदान करते हैं।</li>
          <li>आप यह गारंटी देते हैं कि आपकी सामग्री किसी भी तीसरे पक्ष के कॉपीराइट या गोपनीयता अधिकारों का उल्लंघन नहीं करती है।</li>
          <li>हम किसी भी समय, बिना कोई कारण बताए, किसी भी उपयोगकर्ता टिप्पणी या सामग्री को हटाने या संपादित करने का पूर्ण अधिकार सुरक्षित रखते हैं।</li>
        </ul>

        <h3 className="text-2xl font-bold font-sans mt-10 mb-4 text-gray-900">6. थर्ड-पार्टी लिंक (Third-Party Links)</h3>
        <p className="font-sans mb-6">
          हमारी वेबसाइट पर सुविधा के लिए थर्ड-पार्टी वेबसाइटों या सेवाओं के लिंक हो सकते हैं। हम इन वेबसाइटों की सामग्री, सटीकता, या गोपनीयता प्रथाओं को नियंत्रित नहीं करते हैं और न ही उनका समर्थन करते हैं। किसी भी बाहरी साइट के उपयोग से होने वाले किसी भी नुकसान या क्षति के लिए Tevar News उत्तरदायी नहीं होगा।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-10 mb-4 text-gray-900">7. वारंटी का अस्वीकरण (Disclaimer of Warranties)</h3>
        <p className="font-sans mb-6 uppercase tracking-wider text-sm font-bold text-gray-600 bg-gray-100 p-4 rounded">
          यह वेबसाइट और इसकी सभी सामग्री "जैसी है" (AS IS) और "जैसी उपलब्ध है" (AS AVAILABLE) के आधार पर प्रदान की जाती है। Tevar News स्पष्ट रूप से किसी भी प्रकार की वारंटी, चाहे व्यक्त या निहित हो, को अस्वीकार करता है, जिसमें व्यापारिकता (Merchantability) और किसी विशेष उद्देश्य के लिए उपयुक्तता (Fitness for a particular purpose) शामिल है। हम यह गारंटी नहीं देते कि वेबसाइट त्रुटि-मुक्त, वायरस-मुक्त, या निर्बाध होगी, या कि प्रकाशित समाचार 100% सटीक और पूर्ण होंगे।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-10 mb-4 text-gray-900">8. देयता की सीमा (Limitation of Liability)</h3>
        <p className="font-sans mb-6">
          किसी भी परिस्थिति में Tevar News, इसके निदेशक, कर्मचारी, लेखक या भागीदार, हमारी वेबसाइट के उपयोग या उपयोग करने में असमर्थता के परिणामस्वरूप होने वाले किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक, दंडात्मक या परिणामी नुकसान (जिसमें डेटा या मुनाफे का नुकसान शामिल है) के लिए उत्तरदायी नहीं होंगे।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-10 mb-4 text-gray-900">9. क्षतिपूर्ति (Indemnification)</h3>
        <p className="font-sans mb-6">
          आप इस बात से सहमत हैं कि आपके द्वारा वेबसाइट के अनुचित उपयोग, शर्तों के उल्लंघन, या किसी तीसरे पक्ष के अधिकारों (जैसे कॉपीराइट या मानहानि) के उल्लंघन से उत्पन्न होने वाले किसी भी दावे, नुकसान, या कानूनी खर्च (वकीलों की फीस सहित) से आप Tevar News को क्षतिपूर्ति (Indemnify) करेंगे और सुरक्षित रखेंगे।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-10 mb-4 text-gray-900">10. खाता समाप्ति / एक्सेस रोकना (Termination)</h3>
        <p className="font-sans mb-6">
          हम बिना किसी पूर्व सूचना के, अपने पूर्ण विवेक से, किसी भी उपयोगकर्ता के एक्सेस को निलंबित या समाप्त कर सकते हैं, विशेष रूप से तब जब हमें लगता है कि उपयोगकर्ता ने इन नियमों और शर्तों का उल्लंघन किया है या कोई अवैध गतिविधि की है।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-10 mb-4 text-gray-900">11. शासी कानून और अधिकार क्षेत्र (Governing Law & Jurisdiction)</h3>
        <p className="font-sans mb-6">
          ये नियम और शर्तें भारत गणराज्य (Republic of India) के कानूनों के अनुसार शासित और विश्लेषित होंगी। वेबसाइट के उपयोग से उत्पन्न होने वाले किसी भी विवाद के समाधान के लिए उरई (Orai), उत्तर प्रदेश, भारत के न्यायालयों का विशेष अधिकार क्षेत्र (Exclusive Jurisdiction) होगा।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-10 mb-4 text-gray-900">12. संपर्क और शिकायत निवारण (Contact & Grievance Redressal)</h3>
        <p className="font-sans mb-6">
          इन नियमों और शर्तों के बारे में किसी भी प्रश्न के लिए, या डिजिटल मीडिया एथिक्स कोड के तहत कोई शिकायत दर्ज करने के लिए, कृपया हमारे <a href="/about/grievance" className="text-red-700 font-bold hover:underline">Grievance Officer (शिकायत निवारण अधिकारी)</a> से संपर्क करें:<br/><br/>
          <strong>ईमेल:</strong> <a href="mailto:shailendrasingh35307@gmail.com" className="text-red-700 font-bold hover:underline">shailendrasingh35307@gmail.com</a><br/>
          <strong>फोन:</strong> +91 9695432994
        </p>
      </div>
    </div>
  );
};
