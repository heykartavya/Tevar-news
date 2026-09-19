// Firebase Cloud Messaging Service Worker for Tevar News
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCQ7ZD-ZVvxpIisyNlZG0GO0KACCD83auo",
  authDomain: "tevar-news.firebaseapp.com",
  projectId: "tevar-news",
  storageBucket: "tevar-news.firebasestorage.app",
  messagingSenderId: "275354043664",
  appId: "1:275354043664:web:87025d5b85f19023b31195"
};

if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Received background message:', payload);
      const notificationTitle = payload.notification?.title || payload.data?.title || '🚨 ब्रेकिंग न्यूज़ | Tevar News';
      const notificationOptions = {
        body: payload.notification?.body || payload.data?.body || 'ताज़ा और सच्ची खबर पढ़ने के लिए टैप करें।',
        icon: payload.notification?.icon || payload.data?.icon || '/tevar-icon.png',
        badge: '/tevar-icon.png',
        image: payload.notification?.image || payload.data?.image || undefined,
        data: {
          url: payload.data?.url || payload.fcmOptions?.link || '/',
          articleId: payload.data?.articleId
        },
        tag: payload.data?.tag || 'tevar-breaking-' + Date.now(),
        renotify: true,
        vibrate: [200, 100, 200]
      };

      return self.registration.showNotification(notificationTitle, notificationOptions);
    });
  } catch (err) {
    console.error('[firebase-messaging-sw.js] Initialization error:', err);
  }
}

// Fallback generic push handler
self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const payload = event.data.json();
    const title = payload.notification?.title || payload.title || '🚨 ब्रेकिंग न्यूज़ | Tevar News';
    const body = payload.notification?.body || payload.body || 'ताज़ा और सच्ची खबर पढ़ने के लिए टैप करें।';
    const icon = payload.notification?.icon || payload.icon || '/tevar-icon.png';
    const image = payload.notification?.image || payload.image || undefined;
    const url = payload.data?.url || payload.url || '/';

    const options = {
      body,
      icon,
      badge: '/tevar-icon.png',
      image,
      data: { url },
      tag: 'tevar-alert-' + Date.now(),
      renotify: true,
      vibrate: [200, 100, 200]
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
    event.waitUntil(
      self.registration.showNotification('🚨 ब्रेकिंग न्यूज़ | Tevar News', {
        body: event.data.text(),
        icon: '/tevar-icon.png',
        badge: '/tevar-icon.png'
      })
    );
  }
});

// Notification click behavior - navigate to article
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
