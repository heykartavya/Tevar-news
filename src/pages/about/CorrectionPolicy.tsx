import React from 'react';
import { useLanguage } from '../../lib/LanguageContext';

export const CorrectionPolicy: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl">
      <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">{t('about.correctionPolicy')}</h2>
      
      <div className="prose prose-lg prose-red max-w-none text-gray-800">
        <p className="text-xl text-gray-600 mb-8 font-sans">
          Tevar News सटीकता और पारदर्शिता के लिए प्रतिबद्ध है। यदि हमसे कोई तथ्यात्मक त्रुटि (Factual Mistake) हो जाती है, तो हम उसे सुधारने में तत्परता दिखाते हैं।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">Correction कैसे होगा?</h3>
        <ul className="list-disc pl-6 mb-6">
          <li><strong>पारदर्शिता:</strong> जब भी हम कोई महत्वपूर्ण तथ्यात्मक भूल करते हैं, तो लेख को अपडेट किया जाता है और लेख के अंत या शुरुआत में स्पष्ट रूप से बताया जाता है कि क्या सुधार किया गया है।</li>
          <li><strong>तत्काल सुधार:</strong> संज्ञान में आते ही या शिकायत प्राप्त होने और उसके सत्यापन (Verification) के तुरंत बाद त्रुटि को ठीक किया जाएगा।</li>
          <li><strong>सोशल मीडिया:</strong> यदि कोई गलत तथ्य सोशल मीडिया पर साझा किया गया है, तो हम उस प्लेटफॉर्म पर भी एक स्पष्टीकरण/सुधार जारी करेंगे।</li>
        </ul>

        <div className="bg-gray-50 border-l-4 border-red-700 p-6 my-8 rounded-r-lg">
          <h4 className="text-lg font-bold font-sans mb-2 text-gray-900">उदाहरण (Example):</h4>
          <p className="text-gray-700 italic m-0">
            "यदि किसी प्रकाशित समाचार में तथ्यात्मक त्रुटि पाई जाती है, तो सत्यापन के बाद आवश्यक correction/update किया जाएगा। हम पाठकों के विश्वास का सम्मान करते हैं और गलतियों को स्वीकार कर उन्हें सुधारना हमारी पत्रकारिता का अहम हिस्सा है।"
          </p>
        </div>

        <p>
          यदि आपको हमारी किसी रिपोर्ट में कोई गलती नज़र आती है, तो कृपया तुरंत हमारे शिकायत अधिकारी (Grievance Officer) या संपादक को ईमेल के माध्यम से सूचित करें।
        </p>
      </div>
    </div>
  );
};
