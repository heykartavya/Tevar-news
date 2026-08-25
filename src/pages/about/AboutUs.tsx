import React from 'react';
import { useLanguage } from '../../lib/LanguageContext';

export const AboutUs: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl">
      <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">{t('about.aboutUs')}</h2>
      
      <div className="prose prose-lg prose-red max-w-none text-gray-800">
        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">Tevar News कौन है?</h3>
        <p>
          <strong>Tévar News Media</strong> एक स्वतंत्र और निष्पक्ष डिजिटल न्यूज़ प्लेटफ़ॉर्म है। हम बदलते समय में एक स्पष्ट और प्रामाणिक आवाज़ के रूप में काम करते हैं।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">वेबसाइट का उद्देश्य</h3>
        <p>
          हमारा मुख्य उद्देश्य जनता तक सटीक, निष्पक्ष और गहन विश्लेषण वाली खबरें पहुंचाना है। हम सिर्फ यह नहीं बताते कि क्या हुआ, बल्कि यह समझाते हैं कि यह <em>क्यों</em> मायने रखता है और इसका समाज पर क्या प्रभाव पड़ेगा।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">हम किस प्रकार की खबरें प्रकाशित करते हैं?</h3>
        <p>
          Tevar News पर हम विभिन्न प्रकार की खबरें प्रकाशित करते हैं:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>News & Current Affairs:</strong> राष्ट्रीय, उत्तर प्रदेश, बुंदेलखंड, राजनीति, शिक्षा, अपराध, और रोजगार से जुड़ी ताज़ा और प्रासंगिक खबरें।</li>
          <li><strong>विशेष कवरेज:</strong> सामाजिक मुद्दों, नीतियों और ज़मीनी हकीकत की विस्तृत रिपोर्टिंग।</li>
          <li><strong>वीडियो जर्नलिज़्म:</strong> घटना-स्थलों से सीधी और प्रमाणित विज़ुअल रिपोर्टिंग।</li>
        </ul>

        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">Editorial Approach</h3>
        <p>
          हमारा संपादकीय दृष्टिकोण पूर्णतः तटस्थ और तथ्य-आधारित (Fact-based) है। हम हर खबर के सभी पहलुओं को सामने रखने का प्रयास करते हैं और जन सरोकार की पत्रकारिता में विश्वास रखते हैं।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">Our Team</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 not-prose">
          <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="w-full bg-gray-50 flex justify-center items-center border-b border-gray-100">
              <img 
                src="https://res.cloudinary.com/mzqxmg0a/image/upload/v1787680775/WhatsApp_Image_2026-08-24_at_23.04.09.jpg" 
                alt="Shailendra Singh Tomar" 
                className="w-full h-auto max-h-[400px] object-contain object-top"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h4 className="text-xl font-bold font-serif text-gray-900 mb-1">Shailendra Singh Tomar</h4>
              <p className="text-red-700 font-sans font-bold text-sm tracking-wider uppercase mb-4">Founder & Editor in Chief</p>
              <div className="font-sans text-sm text-gray-600 space-y-2 mt-auto">
                <p className="flex items-center">
                  <span className="font-semibold mr-2 w-12 text-gray-900">Phone:</span> 
                  <a href="tel:+919695432994" className="hover:text-red-700 transition-colors">9695432994</a>
                </p>
                <p className="flex items-center">
                  <span className="font-semibold mr-2 w-12 text-gray-900">Email:</span> 
                  <a href="mailto:shailendrasingh35307@gmail.com" className="hover:text-red-700 transition-colors break-all">shailendrasingh35307@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">Official Contact</h3>
        <p>
          किसी भी जानकारी या सुझाव के लिए, आप हमसे संपर्क कर सकते हैं:<br />
          <strong>Email:</strong> shailendrasingh35307@gmail.com<br />
          <strong>Phone:</strong> 9695432994
        </p>
      </div>
    </div>
  );
};
