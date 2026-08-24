import React from 'react';
import { useLanguage } from '../../lib/LanguageContext';

export const EditorialPolicy: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="max-w-3xl">
      <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">{t('about.editorialPolicy')}</h2>
      
      <div className="prose prose-lg prose-red max-w-none text-gray-800">
        <p className="text-xl text-gray-600 mb-10 font-sans">
          Tevar News अपनी पत्रकारिता में उच्चतम मानकों, निष्पक्षता और जवाबदेही का पालन करता है। हमारी संपादकीय नीति निम्नलिखित सिद्धांतों पर आधारित है:
        </p>

        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">1. खबरों की Verification (सत्यापन)</h3>
        <p>
          हम कोई भी खबर प्रकाशित करने से पहले तथ्यों की गहन जाँच करते हैं। अफवाहों या अपुष्ट दावों को समाचार के रूप में प्रस्तुत नहीं किया जाता। सटीकता हमारी सर्वोच्च प्राथमिकता है।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">2. Sources (स्रोतों) की जांच</h3>
        <p>
          हम अपने समाचार स्रोतों की विश्वसनीयता सुनिश्चित करते हैं। गोपनीय स्रोतों का उपयोग केवल तब किया जाता है जब जानकारी जनहित में अत्यंत आवश्यक हो और उसे अन्य माध्यमों से प्राप्त नहीं किया जा सकता हो।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">3. आरोप और तथ्य में अंतर</h3>
        <p>
          हम स्पष्ट रूप से तथ्यों (Facts) और आरोपों (Allegations) के बीच अंतर करते हैं। किसी भी व्यक्ति या संस्था पर लगे आरोपों को अंतिम अपराध-सिद्धि (Conviction) के रूप में प्रस्तुत नहीं किया जाता है।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">4. संबंधित पक्ष का Version लेने का प्रयास</h3>
        <p>
          निष्पक्षता बनाए रखने के लिए, यदि किसी खबर में किसी व्यक्ति, संस्था या पक्ष की आलोचना या आरोप शामिल हैं, तो प्रकाशन से पहले उनका पक्ष (Version) जानने और उसे खबर में शामिल करने का पूरा प्रयास किया जाता है।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">5. गलत खबर मिलने पर Correction</h3>
        <p>
          यदि मानवीय भूल के कारण कोई गलत तथ्य प्रकाशित हो जाता है, तो उसे छिपाने के बजाय तुरंत और पारदर्शी रूप से सुधार (Correct) किया जाता है। (विवरण के लिए हमारी <em>Correction Policy</em> देखें)।
        </p>

        <h3 className="text-2xl font-bold font-sans mt-8 mb-4">6. Sponsored Content की पहचान</h3>
        <p>
          विज्ञापन, प्रायोजित लेख (Sponsored Content), और संपादकीय (Editorial) सामग्री के बीच स्पष्ट अंतर रखा जाता है। किसी भी प्रायोजित सामग्री को "Sponsored" या "विज्ञापन" टैग के साथ स्पष्ट रूप से चिह्नित किया जाता है ताकि पाठकों को भ्रम न हो।
        </p>
      </div>
    </div>
  );
};
