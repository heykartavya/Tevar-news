import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellOff, BellRing, CheckCircle2, AlertCircle, Send, X, ExternalLink } from 'lucide-react';
import { 
  isPushSupported, 
  getNotificationPermission, 
  isLocalSubscribed, 
  subscribeToBreakingNews, 
  unsubscribeFromBreakingNews, 
  sendTestBreakingAlert 
} from '../lib/notifications';
import { useLanguage } from '../lib/LanguageContext';
import { Article } from '../types';

interface NotificationBellModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentBreakingArticles?: Article[];
  onArticleClick?: (articleId: string) => void;
}

export const NotificationBellModal: React.FC<NotificationBellModalProps> = ({
  isOpen,
  onClose,
  recentBreakingArticles = [],
  onArticleClick
}) => {
  const { language } = useLanguage();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPermission(getNotificationPermission());
      setIsSubscribed(isLocalSubscribed());
      setMessage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const supported = isPushSupported();

  const handleSubscribe = async () => {
    setLoading(true);
    setMessage(null);
    const res = await subscribeToBreakingNews();
    setLoading(false);
    if (res.success) {
      setIsSubscribed(true);
      setPermission('granted');
      setMessage({
        type: 'success',
        text: language === 'en' 
          ? 'Successfully subscribed to breaking news alerts!' 
          : 'ब्रेकिंग न्यूज़ अलर्ट्स सफलतापूर्वक चालू हो गए हैं!'
      });
    } else {
      setMessage({
        type: 'error',
        text: res.error || (language === 'en' ? 'Could not subscribe' : 'अलर्ट्स चालू नहीं हो सके')
      });
      setPermission(getNotificationPermission());
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    setMessage(null);
    const res = await unsubscribeFromBreakingNews();
    setLoading(false);
    if (res.success) {
      setIsSubscribed(false);
      setMessage({
        type: 'success',
        text: language === 'en' 
          ? 'You have unsubscribed from push notifications.' 
          : 'आपने नोटिफिकेशन प्राप्त करना बंद कर दिया है।'
      });
    } else {
      setMessage({
        type: 'error',
        text: res.error || 'Failed to unsubscribe'
      });
    }
  };

  const handleTestAlert = async () => {
    try {
      await sendTestBreakingAlert(
        language === 'en' ? '🚨 Breaking News Alert | Tevar News' : '🚨 ब्रेकिंग न्यूज़ | तेवर न्यूज़',
        language === 'en' 
          ? 'Push notifications are working perfectly on this device!' 
          : 'पुश नोटिफिकेशन आपके डिवाइस पर पूरी तरह सक्रिय है!'
      );
      setMessage({
        type: 'success',
        text: language === 'en' ? 'Test notification sent to your device!' : 'टेस्ट नोटिफिकेशन आपके डिवाइस पर भेजा गया!'
      });
    } catch (e) {
      setMessage({
        type: 'error',
        text: e instanceof Error ? e.message : 'Error sending test notification'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-red-700 text-white p-5 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center space-x-3 z-10">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
              <BellRing className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight">
                {language === 'en' ? 'Breaking News Alerts' : 'ब्रेकिंग न्यूज़ अलर्ट्स'}
              </h3>
              <p className="text-xs text-red-100 font-sans">
                {language === 'en' ? 'Firebase Cloud Push Notifications' : 'तेवर न्यूज़ क्लाउड पुश नोटिफिकेशन'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {!supported ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-3 text-amber-900 text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {language === 'en' ? 'Browser Not Supported' : 'ब्राउज़र में सुविधा उपलब्ध नहीं'}
                </p>
                <p className="text-xs text-amber-800 mt-1">
                  {language === 'en' 
                    ? 'Push notifications are not supported in this browser. Try opening in Chrome, Edge, or Firefox.'
                    : 'आपके ब्राउज़र में वेब पुश नोटिफिकेशन समर्थित नहीं है। कृपया Chrome या Firefox में खोलें।'}
                </p>
              </div>
            </div>
          ) : permission === 'denied' ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-red-800 font-semibold text-sm">
                <BellOff size={18} className="text-red-600" />
                <span>{language === 'en' ? 'Notifications Blocked' : 'नोटिफिकेशन ब्लॉक हैं'}</span>
              </div>
              <p className="text-xs text-red-700 leading-relaxed">
                {language === 'en' 
                  ? 'Notifications are blocked in your browser settings. To receive breaking news, click the lock icon in your browser address bar and set Notifications to "Allow".' 
                  : 'आपके ब्राउज़र में नोटिफिकेशन ब्लॉक हैं। ताज़ा खबरों के अलर्ट्स पाने के लिए एड्रेस बार में लॉक (🔒) आइकन पर क्लिक करके नोटिफिकेशन की अनुमति दें।'}
              </p>
            </div>
          ) : (
            <div>
              {/* Subscription Status Card */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                isSubscribed 
                  ? 'bg-green-50/70 border-green-200 text-green-900' 
                  : 'bg-gray-50 border-gray-200 text-gray-800'
              }`}>
                <div className="flex items-center space-x-3">
                  {isSubscribed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                  ) : (
                    <Bell className="w-6 h-6 text-gray-400 shrink-0" />
                  )}
                  <div>
                    <p className="font-bold text-sm">
                      {isSubscribed 
                        ? (language === 'en' ? 'Alerts Active' : 'अलर्ट्स चालू हैं') 
                        : (language === 'en' ? 'Alerts Disabled' : 'अलर्ट्स बंद हैं')}
                    </p>
                    <p className="text-xs opacity-80">
                      {isSubscribed
                        ? (language === 'en' ? 'You will receive instant breaking news' : 'आपको तुरंत ब्रेकिंग न्यूज़ भेजी जाएगी')
                        : (language === 'en' ? 'Subscribe to get news immediately' : 'सच्ची और ताज़ा खबरें तुरंत पाने के लिए सब्सक्राइब करें')}
                    </p>
                  </div>
                </div>

                {isSubscribed ? (
                  <span className="px-2.5 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-full">
                    {language === 'en' ? 'Subscribed' : 'सक्रिय'}
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                    {language === 'en' ? 'Off' : 'बंद'}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                {!isSubscribed ? (
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full py-3 px-4 bg-red-700 hover:bg-red-800 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <BellRing size={18} />
                    <span>
                      {loading 
                        ? (language === 'en' ? 'Connecting...' : 'सक्रिय किया जा रहा है...') 
                        : (language === 'en' ? 'Subscribe to Breaking News' : 'ब्रेकिंग न्यूज़ अलर्ट्स चालू करें')}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleTestAlert}
                      disabled={loading}
                      className="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Send size={14} />
                      <span>{language === 'en' ? 'Send Test Alert' : 'टेस्ट अलर्ट भेजें'}</span>
                    </button>
                    <button
                      onClick={handleUnsubscribe}
                      disabled={loading}
                      className="py-2.5 px-3 bg-white border border-gray-300 hover:bg-red-50 hover:text-red-700 text-gray-600 rounded-xl font-medium text-xs transition-colors cursor-pointer"
                    >
                      {language === 'en' ? 'Unsubscribe' : 'अलर्ट्स बंद करें'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Feedback Message */}
          {message && (
            <div className={`p-3 rounded-lg text-xs font-medium ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Recent Breaking News Section */}
          {recentBreakingArticles.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3 flex items-center justify-between">
                <span>{language === 'en' ? 'Recent Breaking Stories' : 'ताज़ा ब्रेकिंग खबरें'}</span>
                <span className="text-[10px] text-red-600 font-bold">LIVE</span>
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {recentBreakingArticles.slice(0, 3).map((article) => (
                  <div 
                    key={article.id}
                    onClick={() => {
                      onArticleClick?.(article.id);
                      onClose();
                    }}
                    className="p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-gray-900 group-hover:text-red-700 line-clamp-2">
                        {language === 'en' ? (article.titleEn || article.title) : (article.titleHi || article.title)}
                      </p>
                      <ExternalLink size={12} className="text-gray-400 group-hover:text-red-600 shrink-0 mt-0.5" />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {new Date(article.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-500">
            {language === 'en' 
              ? 'Instant breaking alerts powered by Firebase Cloud Messaging' 
              : 'तेवर न्यूज़ - जालौन, उरई और बुंदेलखंड की विश्वसनीय आवाज़'}
          </p>
        </div>
      </div>
    </div>
  );
};
