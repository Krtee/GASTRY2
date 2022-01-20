// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.2/firebase-messaging-compat.js"
);
// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBZ535AFMh3EeDTxaLspxbnDplih0-MYyY",
  authDomain: "yumatch-notification.firebaseapp.com",
  projectId: "yumatch-notification",
  storageBucket: "yumatch-notification.appspot.com",
  messagingSenderId: "948616280983",
  appId: "1:948616280983:web:e7bdd64f579440320fa2d2",
  measurementId: "G-8KMM403NBK",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  //intentionally left blank
  console.log(payload);
});
