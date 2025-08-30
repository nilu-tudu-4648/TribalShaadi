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
        let setupTimer = null;
        let initializationTimer = null;
        let isCleanedUp = false;
        
        const setupForegroundHandler = async () => {
            try {
                // Check if component was already cleaned up
                if (isCleanedUp) return;
                
                if (!isFirebaseReady()) {
                    console.warn('Firebase not initialized. Skipping foreground message handler.');
                    return;
                }
                
                // Clear any existing setup timer
                if (setupTimer) {
                    clearTimeout(setupTimer);
                    setupTimer = null;
                }
                
                setupTimer = setTimeout(() => {
                    try {
                        // Double check cleanup status
                        if (isCleanedUp) return;
                        
                        unsubscribe = messaging().onMessage(async (remoteMessage) => {
                          try {
                            if (Platform.OS === 'android') {
                              const { title, body } = remoteMessage?.notification || {};
                              console.log(title, body, 'title, body');
                              if (!title || !body) return;
                              
                              // Wrap schedulePushNotification in try-catch to prevent crashes
                              try {
                                await schedulePushNotification(title, body);
                              } catch (scheduleError) {
                                console.error('Error scheduling push notification:', scheduleError);
                                // Don't re-throw to prevent app crash
                              }
                            }
                          } catch (messageError) {
                            console.error('Error processing foreground message:', messageError);
                            // Don't re-throw to prevent app crash
                          }
                        });
                    } catch (setupError) {
                        console.error('Error in message handler setup:', setupError);
                    }
                }, 500); // increased delay to stabilize real devices
                
            } catch (error) {
                console.error('Error setting up foreground message handler:', error);
            }
        };
        
        // Add a small delay to ensure Firebase is initialized
        initializationTimer = setTimeout(() => {
            if (!isCleanedUp) {
                setupForegroundHandler();
            }
        }, 2000);
        
        return () => {
            // Mark as cleaned up to prevent any async operations
            isCleanedUp = true;
            
            // Clear all timers
            if (initializationTimer) {
                clearTimeout(initializationTimer);
                initializationTimer = null;
            }
            if (setupTimer) {
                clearTimeout(setupTimer);
                setupTimer = null;
            }
            
            // Unsubscribe from messaging
            if (unsubscribe) {
                try {
                    unsubscribe();
                } catch (unsubscribeError) {
                    console.error('Error unsubscribing from foreground messages:', unsubscribeError);
                }
                unsubscribe = null;
            }
        };
    }, [])
 
    return null
};

export default ForegroundHandler