import React from 'react';
import { useLanguage } from '../../lib/LanguageContext';

export const Grievance: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl">
      <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">{t('about.grievance')}</h2>
      
      <div className="prose prose-lg prose-red max-w-none text-gray-800">
        <p className="text-xl text-gray-600 mb-8 font-sans">
          Tevar News भारत सरकार के Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 के तहत डिजिटल न्यूज़ पब्लिशर्स के लिए निर्धारित आचार संहिता और शिकायत निवारण तंत्र (Grievance Redressal Mechanism) का पूरी तरह से पालन करता है।
        </p>

        <p className="mb-6">
          यदि आपको हमारी वेबसाइट पर प्रकाशित किसी समाचार, वीडियो या सामग्री से संबंधित कोई शिकायत है, या आपको लगता है कि वह डिजिटल मीडिया एथिक्स कोड का उल्लंघन करती है, तो आप हमारे शिकायत अधिकारी (Grievance Officer) से संपर्क कर सकते हैं।
        </p>

        <div className="bg-gray-50 border border-gray-200 p-8 rounded-lg my-8">
          <h3 className="text-2xl font-bold font-sans mt-0 mb-6 text-gray-900">Grievance Officer Details</h3>
          
          <div className="space-y-4 font-sans text-gray-800">
            <p className="m-0"><strong>नाम (Name):</strong> Shailendra Singh Tomar</p>
            <p className="m-0"><strong>पद (Designation):</strong> Editor-in-Chief & Grievance Officer</p>
            <p className="m-0">
              <strong>ईमेल (Email):</strong> <a href="mailto:shailendrasingh35307@gmail.com" className="text-red-700 hover:underline">shailendrasingh35307@gmail.com</a>
            </p>
            <p className="m-0"><strong>संपर्क नंबर (Contact):</strong> +91 9695432994</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">शिकायत भेजने का तरीका (How to make a complaint)</h3>
        <p>
          कृपया अपनी शिकायत भेजते समय निम्नलिखित जानकारी अवश्य शामिल करें:
        </p>
        <ul className="list-disc pl-6 mb-8">
          <li>आपका पूरा नाम और संपर्क विवरण (ईमेल और फोन नंबर)।</li>
          <li>उस विशिष्ट लेख, समाचार या वीडियो का लिंक (URL) जिसके बारे में आप शिकायत कर रहे हैं।</li>
          <li>शिकायत का सटीक कारण और यह स्पष्टीकरण कि यह आचार संहिता के किस नियम का उल्लंघन करता है।</li>
        </ul>

        <p className="font-bold bg-yellow-50 p-4 rounded text-yellow-900 border border-yellow-200">
          हम आपकी शिकायत प्राप्त होने के 15 दिनों के भीतर उसका समाधान करने का प्रयास करेंगे।
        </p>
      </div>
    </div>
  );
};
