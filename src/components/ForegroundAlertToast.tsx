import React, { useState, useEffect } from 'react';
import { Flame, X, ArrowRight } from 'lucide-react';
import { listenToBreakingAlerts, BreakingAlertPayload } from '../lib/notifications';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../lib/LanguageContext';

export const ForegroundAlertToast: React.FC = () => {
  const [currentAlert, setCurrentAlert] = useState<BreakingAlertPayload | null>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    const unsubscribe = listenToBreakingAlerts((alert) => {
      setCurrentAlert(alert);
      // Auto-hide after 10 seconds if not clicked
      const timer = setTimeout(() => {
        setCurrentAlert((prev) => (prev?.id === alert.id ? null : prev));
      }, 10000);
      return () => clearTimeout(timer);
    });

    return () => unsubscribe();
  }, []);

  if (!currentAlert) return null;

  const handleClick = () => {
    if (currentAlert.articleId) {
      navigate(`/article/${currentAlert.articleId}`);
    } else if (currentAlert.url && currentAlert.url.startsWith('/')) {
      navigate(currentAlert.url);
    } else if (currentAlert.url) {
      window.location.href = currentAlert.url;
    }
    setCurrentAlert(null);
  };

  return (
    <aside aria-label="Breaking News Alert" className="fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-xl z-50 animate-in slide-in-from-top duration-300">
      <div className="bg-red-700 text-white rounded-2xl shadow-2xl p-4 border border-red-600 flex items-start space-x-3.5 relative overflow-hidden ring-4 ring-red-500/20">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
          <Flame className="w-6 h-6 text-yellow-300" />
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center space-x-2">
            <span className="bg-white text-red-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
              {language === 'en' ? 'Breaking Alert' : 'ब्रेकिंग न्यूज़'}
            </span>
            <span className="text-red-200 text-xs">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <h4 className="font-serif font-bold text-sm text-white mt-1.5 leading-snug line-clamp-2">
            {currentAlert.title}
          </h4>
          {currentAlert.body && (
            <p className="text-xs text-red-100 mt-1 line-clamp-2">
              {currentAlert.body}
            </p>
          )}

          <div className="mt-2.5 flex items-center space-x-3">
            <button
              onClick={handleClick}
              className="inline-flex items-center space-x-1 bg-white text-red-800 hover:bg-red-50 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <span>{language === 'en' ? 'Read Story' : 'पूरी खबर पढ़ें'}</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => setCurrentAlert(null)}
              className="text-xs text-red-200 hover:text-white transition-colors cursor-pointer"
            >
              {language === 'en' ? 'Dismiss' : 'हटाएं'}
            </button>
          </div>
        </div>

        <button
          onClick={() => setCurrentAlert(null)}
          className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors shrink-0"
        >
          <X size={18} />
        </button>
      </div>
    </aside>
  );
};
