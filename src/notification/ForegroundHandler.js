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
                   try {
                       console.log('A new FCM message arrived!');
                       
                       // Only show local notification if app is in foreground
                       // Firebase automatically handles notifications when app is in background/quit
                       if (AppState.currentState === 'active') {
                           // Add comprehensive null safety checks
                           if (!remoteMessage) {
                               console.log('Remote message is null or undefined');
                               return;
                           }
                           
                           const notification = remoteMessage.notification;
                           if (!notification) {
                               console.log('No notification data found in message');
                               return;
                           }
                           
                           const title = notification.title;
                           const body = notification.body;
                           
                           // Validate title and body exist and are strings
                           if (!title || !body) {
                               console.log('Missing title or body in notification');
                               return;
                           }
                           
                           if (typeof title !== 'string' || typeof body !== 'string') {
                               console.log('Title or body is not a string');
                               return;
                           }
                           
                           // Call with only title and body parameters
                           schedulePushNotification(title, body);
                       }
                   } catch (error) {
                       console.error('Error handling foreground notification:', error);
                       // Don't re-throw to prevent app crash
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