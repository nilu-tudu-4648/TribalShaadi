import { useEffect } from "react";
import { AppState, Platform } from "react-native";
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
                
                const timer = setTimeout(() => {
                    unsubscribe = messaging().onMessage(async (remoteMessage) => {
                      if (Platform.OS === 'android') {
                        const { title, body } = remoteMessage?.notification || {};
                        console.log(title, body, 'title, body');
                        if (!title || !body) return;
                        await schedulePushNotification(title, body);
                      }
                    });
                  }, 500); // increased delay to stabilize real devices
                
                  return () => {
                    clearTimeout(timer);
                    if (unsubscribe) unsubscribe();
                  };
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