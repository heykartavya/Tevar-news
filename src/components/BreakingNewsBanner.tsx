import React, { useState, useEffect } from 'react';
import { BellRing, X, CheckCircle2 } from 'lucide-react';
import { 
  isPushSupported, 
  isLocalSubscribed, 
  isBannerDismissed, 
  setBannerDismissed, 
  subscribeToBreakingNews 
} from '../lib/notifications';
import { useLanguage } from '../lib/LanguageContext';

export const BreakingNewsBanner: React.FC = () => {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Only show if supported, not subscribed, and not previously dismissed
    if (isPushSupported() && !isLocalSubscribed() && !isBannerDismissed()) {
      // Delay showing by 3 seconds for a polite reader experience
      const timer = setTimeout(() => {
        setVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  const handleSubscribe = async () => {
    setLoading(true);
    const res = await subscribeToBreakingNews();
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setVisible(false);
      }, 2000);
    }
  };

  const handleDismiss = () => {
    setBannerDismissed(true);
    setVisible(false);
  };

  return (
    <aside aria-label="Notification Subscription" className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-gray-900 text-white rounded-2xl p-4 shadow-2xl border border-gray-800 flex items-start space-x-3.5 relative overflow-hidden">
        <div className="w-10 h-10 rounded-full bg-red-600/30 flex items-center justify-center shrink-0 border border-red-500/40 mt-0.5">
          {success ? (
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          ) : (
            <BellRing className="w-5 h-5 text-red-400 animate-bounce" />
          )}
        </div>

        <div className="flex-1 pr-6">
          <h4 className="font-sans font-bold text-sm text-white flex items-center gap-2">
            {language === 'en' ? 'Breaking News Alerts' : 'ब्रेकिंग न्यूज़ अलर्ट्स'}
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider">
              NEW
            </span>
          </h4>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">
            {success
              ? (language === 'en' ? 'Alerts activated! Thank you.' : 'अलर्ट्स चालू हो गए हैं! धन्यवाद।')
              : (language === 'en' 
                  ? 'Subscribe to get instant notifications whenever breaking news happens in Bundelkhand.' 
                  : 'जालौन और बुंदेलखंड की ताज़ा व ब्रेकिंग खबरें तुरंत अपने फोन/डेस्कटॉप पर पाएं।')}
          </p>

          {!success && (
            <div className="mt-3 flex items-center space-x-2">
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading 
                  ? (language === 'en' ? 'Enabling...' : 'चालू हो रहा है...') 
                  : (language === 'en' ? 'Allow Alerts' : 'अलर्ट्स चालू करें')}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Later' : 'बाद में'}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </aside>
  );
};
