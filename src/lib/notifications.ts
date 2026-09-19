import { getToken, onMessage } from 'firebase/messaging';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, getFCM } from './firebase';

export interface BreakingAlertPayload {
  id?: string;
  title: string;
  body: string;
  url?: string;
  imageUrl?: string;
  date?: string;
  articleId?: string;
}

const LOCAL_STORAGE_SUBSCRIBED_KEY = 'tevar_push_subscribed';
const LOCAL_STORAGE_TOKEN_KEY = 'tevar_push_token';
const LOCAL_STORAGE_DISMISSED_BANNER_KEY = 'tevar_push_banner_dismissed';

export const isPushSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!isPushSupported()) return 'denied';
  return Notification.permission;
};

export const isLocalSubscribed = (): boolean => {
  if (!isPushSupported()) return false;
  return Notification.permission === 'granted' && localStorage.getItem(LOCAL_STORAGE_SUBSCRIBED_KEY) === 'true';
};

export const isBannerDismissed = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(LOCAL_STORAGE_DISMISSED_BANNER_KEY) === 'true';
};

export const setBannerDismissed = (dismissed: boolean) => {
  if (typeof window === 'undefined') return;
  if (dismissed) {
    localStorage.setItem(LOCAL_STORAGE_DISMISSED_BANNER_KEY, 'true');
  } else {
    localStorage.removeItem(LOCAL_STORAGE_DISMISSED_BANNER_KEY);
  }
};

/**
 * Register the Firebase Messaging Service Worker
 */
export const registerMessagingServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isPushSupported()) return null;
  try {
    const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    await navigator.serviceWorker.ready;
    return reg;
  } catch (err) {
    console.error('Failed to register firebase-messaging-sw.js:', err);
    return null;
  }
};

/**
 * Request permission and subscribe the reader to Breaking News notifications
 */
export const subscribeToBreakingNews = async (): Promise<{ success: boolean; token?: string; error?: string }> => {
  if (!isPushSupported()) {
    return { success: false, error: 'इस ब्राउज़र में पुश नोटिफिकेशन समर्थित नहीं है (Push notifications not supported).' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { 
        success: false, 
        error: permission === 'denied' 
          ? 'नोटिफिकेशन की अनुमति अस्वीकृत की गई है। कृपया ब्राउज़र सेटिंग्स में अनुमति दें (Permission denied).' 
          : 'नोटिफिकेशन अनुमति रद्द की गई (Permission dismissed).' 
      };
    }

    const swReg = await registerMessagingServiceWorker();
    const messaging = await getFCM();
    
    let fcmToken: string | null = null;
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined;

    if (messaging && swReg) {
      try {
        fcmToken = await getToken(messaging, {
          vapidKey: vapidKey || undefined,
          serviceWorkerRegistration: swReg
        });
      } catch (tokenErr) {
        console.warn('FCM getToken notice:', tokenErr);
      }
    }

    // Generate stable fallback token if VAPID key is not set or in test sandbox
    if (!fcmToken) {
      const existingToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      fcmToken = existingToken || 'web_subscriber_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
    }

    // Sanitize token for doc ID in Firestore
    const safeDocId = fcmToken.replace(/[^a-zA-Z0-9_-]/g, '_').slice(-80);

    const subscriberData = {
      token: fcmToken,
      topics: ['breaking_news'],
      active: true,
      userAgent: navigator.userAgent,
      subscribedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in Firestore
    try {
      await setDoc(doc(db, 'subscribers', safeDocId), subscriberData, { merge: true });
    } catch (dbErr) {
      console.warn('Could not save subscriber to Firestore directly:', dbErr);
    }

    // Sync with Server Endpoint
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriberData)
      });
    } catch (apiErr) {
      console.warn('Server subscriber sync notice:', apiErr);
    }

    // Save to local storage
    localStorage.setItem(LOCAL_STORAGE_SUBSCRIBED_KEY, 'true');
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, fcmToken);

    // Show immediate confirmation notification
    showWelcomeNotification();

    return { success: true, token: fcmToken };
  } catch (err) {
    console.error('Subscription error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error occurred' };
  }
};

/**
 * Unsubscribe reader from Breaking News notifications
 */
export const unsubscribeFromBreakingNews = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (token) {
      const safeDocId = token.replace(/[^a-zA-Z0-9_-]/g, '_').slice(-80);
      try {
        await deleteDoc(doc(db, 'subscribers', safeDocId));
      } catch (e) {
        console.warn('Direct doc delete notice:', e);
      }

      try {
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
      } catch (e) {
        console.warn('Server unsubscribe notice:', e);
      }
    }

    localStorage.setItem(LOCAL_STORAGE_SUBSCRIBED_KEY, 'false');
    return { success: true };
  } catch (err) {
    console.error('Unsubscribe error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to unsubscribe' };
  }
};

/**
 * Display a test or welcome notification
 */
export const showWelcomeNotification = async () => {
  if (!isPushSupported() || Notification.permission !== 'granted') return;

  const title = '🔔 तेवर न्यूज़ ब्रेकिंग अलर्ट्स सक्रिय!';
  const body = 'धन्यवाद! अब आपको सभी ताज़ा और ब्रेकिंग खबरों के तुरंत अलर्ट्स मिलेंगे।';

  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      reg.showNotification(title, {
        body,
        icon: '/tevar-icon.png',
        badge: '/tevar-icon.png',
        data: { url: '/' }
      });
      return;
    }
  }

  try {
    new Notification(title, {
      body,
      icon: '/tevar-icon.png'
    });
  } catch (e) {
    console.log('Notification API fallback:', e);
  }
};

/**
 * Send test alert
 */
export const sendTestBreakingAlert = async (title: string, body: string, url: string = '/') => {
  if (!isPushSupported() || Notification.permission !== 'granted') {
    throw new Error('नोटिफिकेशन की अनुमति नहीं है (Notification permission not granted)');
  }

  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      await reg.showNotification(title, {
        body,
        icon: '/tevar-icon.png',
        badge: '/tevar-icon.png',
        data: { url },
        tag: 'tevar-test-' + Date.now(),
        renotify: true
      } as any);
      return;
    }
  }


  new Notification(title, {
    body,
    icon: '/tevar-icon.png',
    data: { url }
  });
};

/**
 * Listen for live breaking alerts both via FCM onMessage and Firestore collection
 */
export const listenToBreakingAlerts = (
  onAlert: (alert: BreakingAlertPayload) => void
): (() => void) => {
  let unsubscribeFirestore = () => {};

  // 1. FCM onMessage listener for foreground messages
  getFCM().then((messaging) => {
    if (messaging) {
      try {
        onMessage(messaging, (payload) => {
          console.log('[FCM onMessage] Received payload:', payload);
          const alert: BreakingAlertPayload = {
            id: payload.messageId || 'fcm-' + Date.now(),
            title: payload.notification?.title || payload.data?.title || '🚨 ब्रेकिंग न्यूज़ | Tevar News',
            body: payload.notification?.body || payload.data?.body || 'नई खबर आई है।',
            imageUrl: payload.notification?.image || payload.data?.image,
            url: payload.data?.url || '/',
            date: new Date().toISOString(),
            articleId: payload.data?.articleId
          };
          onAlert(alert);
        });
      } catch (err) {
        console.warn('onMessage listener error:', err);
      }
    }
  });

  // 2. Real-time Firestore sync for instant breaking news broadcast to all connected readers
  try {
    const q = query(collection(db, 'breaking_alerts'), orderBy('createdAt', 'desc'), limit(1));
    let initialSkip = true;

    unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      // Don't trigger on initial load, only on fresh new additions
      if (initialSkip) {
        initialSkip = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          const alert: BreakingAlertPayload = {
            id: change.doc.id,
            title: data.title,
            body: data.body,
            url: data.url,
            imageUrl: data.imageUrl,
            date: data.createdAt,
            articleId: data.articleId
          };
          onAlert(alert);
        }
      });
    }, (err) => {
      console.warn('breaking_alerts snapshot notice:', err);
    });
  } catch (err) {
    console.warn('Failed to listen to breaking_alerts collection:', err);
  }

  return () => {
    unsubscribeFirestore();
  };
};
