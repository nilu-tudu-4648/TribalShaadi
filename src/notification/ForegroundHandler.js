import { useEffect } from "react";
import { AppState } from "react-native";
import messaging from '@react-native-firebase/messaging';
import { getApps } from '@react-native-firebase/app';
import { schedulePushNotification } from "./notifications";

// Silence the modular API deprecation warning
global.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

// Function to check if Firebase is ready
const isFirebaseReady = () => {
  try {
    return getApps().length > 0;
  } catch (error) {
    console.error('Error checking Firebase status in ForegroundHandler:', error);
    return false;
  }
};

const ForegroundHandler = (params) => {
    useEffect(() => {
        let unsubscribe = null;
        
        const setupForegroundHandler = async () => {
            try {
                if (!isFirebaseReady()) {
                    console.warn('Firebase not initialized. Skipping foreground message handler.');
                    return;
                }
                
                // Use the default messaging instance
                unsubscribe = messaging().onMessage(async remoteMessage => {
                   console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
                   
                   // Only show local notification if app is in foreground
                   // Firebase automatically handles notifications when app is in background/quit
                   if (AppState.currentState === 'active') {
                       const { title, body } = remoteMessage.notification || {};
                       const image = remoteMessage.notification?.android?.imageUrl;
                       
                       if (title && body) {
                           await schedulePushNotification(title, body, image);
                       }
                   }
                });
            } catch (error) {
                console.error('Error setting up foreground message handler:', error);
            }
        };
        
        // Add a small delay to ensure Firebase is initialized
        const timer = setTimeout(setupForegroundHandler, 2000);
        
        return () => {
            clearTimeout(timer);
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [])
 
    return null
};

export default ForegroundHandler