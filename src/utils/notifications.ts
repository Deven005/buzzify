// src/notifications.ts
import { messaging } from "../config/firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";

let unsubscribe: (() => void) | null = null;

// Request Notification Permission
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      return true;
    } else {
      console.error("Notification permission denied.");
      return false;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

// Get FCM Token
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const token = await getToken(messaging, {
      vapidKey:
        "BCvyQMSYPC7mxBKctwbr0FVN2suUTehwG0uy7OTeKZ3V0AWgpzOO1uqRNX6mTZcB4cbjBGH8ExOy5ivrEWJLa5c",
    });
    if (token) {
      console.log("FCM Token received:", token);
      return token;
    } else {
      console.log("No FCM token available.");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

// Listen for incoming messages
export const listenForMessages = (callback: (message: any) => void) => {
  unsubscribe = onMessage(messaging, (payload) => {
    console.log("Message received: ", payload);
    callback(payload);
  });
};

// Unsubscribe from the listener
export const unsubscribeFromMessages = () => {
  if (unsubscribe) {
    unsubscribe(); // Unsubscribe from the message listener
    unsubscribe = null;
  }
};
