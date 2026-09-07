import React, { useEffect } from 'react';

interface AdSpaceProps {
  format: 'leaderboard' | 'rectangle' | 'skyscraper';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdSpace: React.FC<AdSpaceProps> = ({ format, className = '' }) => {
  const clientId = import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT_ID;
  
  const getSlotId = () => {
    switch (format) {
      case 'leaderboard': return import.meta.env.VITE_GOOGLE_ADSENSE_SLOT_LEADERBOARD;
      case 'rectangle': return import.meta.env.VITE_GOOGLE_ADSENSE_SLOT_RECTANGLE;
      case 'skyscraper': return import.meta.env.VITE_GOOGLE_ADSENSE_SLOT_SKYSCRAPER;
      default: return '';
    }
  };

  const slotId = getSlotId();

  useEffect(() => {
    // Only proceed if we have valid credentials
    if (!clientId || !slotId) return;

    // Inject the global AdSense script if it hasn't been added yet
    if (!document.getElementById('adsense-script')) {
      const script = document.createElement('script');
      script.id = 'adsense-script';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Push the ad to be initialized
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, [clientId, slotId]);

  // Standard dimensions for placeholder
  const getDimensionsClass = () => {
    switch (format) {
      case 'leaderboard': return 'w-full h-[90px] max-w-[728px] mx-auto';
      case 'rectangle': return 'w-full h-[250px] max-w-[300px] mx-auto';
      case 'skyscraper': return 'w-full h-[600px] max-w-[160px] mx-auto';
      default: return 'w-full h-auto';
    }
  };
  
  // Dimensions for AdSense element
  const getDimensionsStyle = () => {
    switch (format) {
      case 'leaderboard': return { width: '728px', height: '90px' };
      case 'rectangle': return { width: '300px', height: '250px' };
      case 'skyscraper': return { width: '160px', height: '600px' };
      default: return { display: 'block' }; // responsive fallback
    }
  };

  // If no credentials are provided, fallback to the placeholder
  if (!clientId || !slotId) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 border border-gray-200 text-gray-400 ${getDimensionsClass()} ${className}`}>
        <span className="text-[10px] tracking-widest uppercase mb-1">Advertisement</span>
        <div className="w-full h-full flex items-center justify-center border-t border-gray-200">
          <span className="text-sm font-medium">Space Reserved</span>
        </div>
      </div>
    );
  }

  // Actual AdSense implementation
  return (
    <div className={`flex flex-col items-center justify-center bg-gray-50 overflow-hidden ${className}`}>
      <ins className="adsbygoogle"
           style={{ display: 'inline-block', ...getDimensionsStyle() }}
           data-ad-client={clientId}
           data-ad-slot={slotId}></ins>
    </div>
  );
};
