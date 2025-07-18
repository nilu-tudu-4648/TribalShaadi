import { useEffect } from "react";
import { AppState } from "react-native";
import messaging from '@react-native-firebase/messaging';
import { getApp, getApps } from '@react-native-firebase/app';
import { schedulePushNotification } from "./notifications";

// Get the default app instance with proper initialization check
let app;
try {
  if (getApps().length === 0) {
    console.warn('Firebase not initialized in ForegroundHandler. Please add proper Firebase configuration.');
    app = null;
  } else {
    app = getApp();
  }
} catch (error) {
  console.error('Error getting Firebase app in ForegroundHandler:', error);
  app = null;
}

const ForegroundHandler = (params) => {
    useEffect(() => {
        if (!app) {
            console.warn('Firebase app not initialized. Skipping foreground message handler.');
            return;
        }
        
        const unsubscribe = messaging(app).onMessage(async remoteMessage => {
           console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
           
           // Only show local notification if app is in foreground
           // Firebase automatically handles notifications when app is in background/quit
           if (AppState.currentState === 'active') {
               const { title, body } = remoteMessage.notification;
               const image = remoteMessage.notification?.android?.imageUrl;
               // const { type, data } = remoteMessage.data;
               await schedulePushNotification(title, body, image);
           }
        })
        return unsubscribe
    }, [])
 
    return null
};

export default ForegroundHandler