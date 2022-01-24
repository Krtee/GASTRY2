import { initializeApp } from "firebase/app";
import { getMessaging, getToken, MessagePayload, onMessage } from "firebase/messaging";
import { generateNotification } from "../components/NotificationCardComponent/NotificationCardComponent";
import {
  NotificationType,
} from "./notification/Notification.types";

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

// Initialize Firebase
initializeApp(firebaseConfig);
const messaging = getMessaging();
export let token: string;

const { REACT_APP_VAPID_KEY } = process.env;

getToken(messaging, {
  vapidKey: REACT_APP_VAPID_KEY,
})
  .then((currentToken) => {
    if (currentToken) {
      // Send the token to your server and update the UI if necessary
      token = currentToken;
    } else {
      // Show permission request UI
    }
  })
  .catch((err) => {
    console.log("An error occurred while retrieving token. ", err);
  });

export const onMessageListener = (
  payloadHandler: (payload: MessagePayload) => void
) =>
  onMessage(messaging, (payload) => {
    console.log(payload);
    payload.notification?.body;
    payloadHandler(payload);
  });
