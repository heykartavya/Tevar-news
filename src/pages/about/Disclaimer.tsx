import React from 'react';
import { useLanguage } from '../../lib/LanguageContext';

export const Disclaimer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl">
      <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">{t('about.disclaimer')}</h2>
      
      <div className="prose prose-lg prose-red max-w-none text-gray-800">
        <p className="text-xl text-gray-600 mb-8 font-sans">
          Tevar News पर प्रकाशित सामग्री के संबंध में निम्नलिखित अस्वीकरण (Disclaimer) लागू होता है:
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-4">
          <li>
            <strong>स्रोतों पर आधारित समाचार:</strong> हम समाचार और जानकारी उपलब्ध और सत्यापित स्रोतों, एजेंसियों, और संवाददाताओं के आधार पर प्रस्तुत करते हैं। हम सटीकता का पूरा प्रयास करते हैं, लेकिन किसी भी त्रुटि या चूक के लिए पूर्ण उत्तरदायित्व की गारंटी नहीं ले सकते।
          </li>
          <li>
            <strong>आरोप दोषसिद्धि नहीं हैं:</strong> किसी भी रिपोर्ट में उल्लिखित आरोप (Allegations) केवल आरोप हैं और उन्हें किसी न्यायालय द्वारा दोषसिद्धि (Conviction) नहीं माना जाना चाहिए।
          </li>
          <li>
            <strong>अपडेट और सुधार:</strong> नई जानकारी या तथ्य सामने आने पर, हम आवश्यकतानुसार खबर को अपडेट या करेक्ट (Correct) करने का अधिकार सुरक्षित रखते हैं।
          </li>
          <li>
            <strong>विचार और तथ्य अलग हैं:</strong> ओपिनियन (Opinions), संपादकीय, या अतिथि लेखकों द्वारा व्यक्त किए गए विचार उनके निजी विचार हैं और वे आवश्यक रूप से Tevar News के तथ्यों या आधिकारिक रुख का प्रतिनिधित्व नहीं करते हैं।
          </li>
        </ul>
        
        <p className="mt-8 font-bold">
          इस वेबसाइट के उपयोग से उत्पन्न होने वाले किसी भी प्रत्यक्ष या अप्रत्यक्ष नुकसान के लिए Tevar News या उसके कर्मचारी उत्तरदायी नहीं होंगे।
        </p>
      </div>
    </div>
  );
};
