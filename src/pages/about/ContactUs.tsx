import React from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import { Mail, Phone, MapPin } from 'lucide-react';

export const ContactUs: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl">
      <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">{t('about.contactUs')}</h2>
      
      <p className="text-xl text-gray-600 mb-10 font-sans">
        हमसे संपर्क करने के लिए कृपया नीचे दी गई जानकारी का उपयोग करें। हम आपकी प्रतिक्रिया और सवालों का स्वागत करते हैं।
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-100">
          <div className="w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center mb-6">
            <Mail size={24} />
          </div>
          <h3 className="text-xl font-bold font-sans text-gray-900 mb-2">Official Email</h3>
          <p className="text-gray-600 font-sans">
            <a href="mailto:shailendrasingh35307@gmail.com" className="hover:text-red-700 transition-colors">
              shailendrasingh35307@gmail.com
            </a>
          </p>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg border border-gray-100">
          <div className="w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center mb-6">
            <Phone size={24} />
          </div>
          <h3 className="text-xl font-bold font-sans text-gray-900 mb-2">Phone Number</h3>
          <p className="text-gray-600 font-sans">
            <a href="tel:+919695432994" className="hover:text-red-700 transition-colors">
              +91 9695432994
            </a>
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg border border-gray-100">
        <div className="w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center mb-6">
          <MapPin size={24} />
        </div>
        <h3 className="text-xl font-bold font-sans text-gray-900 mb-6">Office Addresses</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Head Office</h4>
            <p className="text-gray-600 font-sans leading-relaxed">
              Tévar News Media<br />
              Kalpi, District Jalaun<br />
              Uttar Pradesh, India - 285204
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Additional Office</h4>
            <p className="text-gray-600 font-sans leading-relaxed">
              Tévar News Media<br />
              Orai, District Jalaun<br />
              Uttar Pradesh, India - 285001
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
