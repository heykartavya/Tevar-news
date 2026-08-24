import React from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import { Mail, Phone, Megaphone } from 'lucide-react';

export const Advertise: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl">
      <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">{t('about.advertise')}</h2>
      
      <p className="text-xl text-gray-600 mb-10 font-sans">
        Tevar News के साथ अपने ब्रांड को नई ऊंचाइयों पर ले जाएं। हमारी वेबसाइट पर विज्ञापन देकर आप एक विशाल और जागरूक दर्शकों तक पहुंच सकते हैं।
      </p>

      <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg mb-10">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center mr-4">
            <Megaphone size={24} />
          </div>
          <h3 className="text-2xl font-bold font-sans text-gray-900 m-0">विज्ञापन के विकल्प (Advertising Options)</h3>
        </div>
        
        <ul className="list-disc pl-6 space-y-3 font-sans text-gray-800 text-lg">
          <li><strong>बैनर विज्ञापन (Banner Ads):</strong> होमपेज और लेख पृष्ठों पर प्रीमियम स्थान।</li>
          <li><strong>प्रायोजित सामग्री (Sponsored Content):</strong> आपके ब्रांड की कहानी बताने वाले विशेष लेख।</li>
          <li><strong>वीडियो विज्ञापन (Video Ads):</strong> हमारी वीडियो रिपोर्टिंग के साथ एकीकृत विज्ञापन।</li>
          <li><strong>कस्टम अभियान (Custom Campaigns):</strong> आपकी विशिष्ट आवश्यकताओं के अनुरूप विज्ञापन समाधान।</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold font-sans mt-8 mb-6">विज्ञापन पूछताछ के लिए संपर्क करें (Contact for Advertisement)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <Mail className="text-red-700 mr-3" size={20} />
            <h4 className="text-lg font-bold font-sans text-gray-900 m-0">Email</h4>
          </div>
          <p className="text-gray-600 font-sans">
            <a href="mailto:shailendrasingh35307@gmail.com" className="hover:text-red-700 transition-colors">
              shailendrasingh35307@gmail.com
            </a>
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <Phone className="text-red-700 mr-3" size={20} />
            <h4 className="text-lg font-bold font-sans text-gray-900 m-0">Phone</h4>
          </div>
          <p className="text-gray-600 font-sans">
            <a href="tel:+919695432994" className="hover:text-red-700 transition-colors">
              +91 9695432994
            </a>
          </p>
        </div>
      </div>

      <p className="text-gray-600 font-sans italic bg-yellow-50 p-4 border-l-4 border-yellow-400">
        नोट: हमारी विज्ञापन नीति संपादकीय स्वतंत्रता से समझौता नहीं करती है। सभी प्रायोजित सामग्री को स्पष्ट रूप से चिह्नित किया जाएगा।
      </p>
    </div>
  );
};
