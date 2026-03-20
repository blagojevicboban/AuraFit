importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA3NuAi0fFxmxf5IbT-amXbASmvJdFSzsc",
  authDomain: "myapplication-1e6ac1ea.firebaseapp.com",
  projectId: "myapplication-1e6ac1ea",
  storageBucket: "myapplication-1e6ac1ea.firebasestorage.app",
  messagingSenderId: "36332826328",
  appId: "1:36332826328:web:3b057dc78e87ecb7e971ad"
});


const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pwa-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
