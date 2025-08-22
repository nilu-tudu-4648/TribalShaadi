/* eslint-disable semi */
import messaging from '@react-native-firebase/messaging';
import { getApps } from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl, updateUrl } from '../constants/functions';
import { ASYNC_VARIBLES } from '../constants/data';
import axios from 'axios';
import { PermissionsAndroid, Platform } from 'react-native';

// Silence the modular API deprecation warning
global.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

// Function to check if Firebase is ready
const isFirebaseReady = () => {
  try {
    return getApps().length > 0;
  } catch (error) {
    console.error('Error checking Firebase status:', error);
    return false;
  }
};

// notifications.js
export const createNotificationChannel = () => {
  PushNotification.createChannel(
    {
      channelId: 'tribalshaadi', // LOWERCASE for Android safety
      channelName: 'Tribal Shaadi Notifications',
      channelDescription: 'Notifications for Tribal Shaadi app',
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    (created) => console.log(`Notification channel created: ${created}`),
  );
};

export const requestAndroidNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      console.log('Android 13+ notification permission:', granted);
    } catch (err) {
      console.warn('Failed to request notification permission', err);
    }
  }
};
export const requestUserPermission = async () => {
  if (!isFirebaseReady()) {
    console.warn(
      'Firebase not initialized. Skipping notification permission request.',
    );
    return;
  }

  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Authorization status:', authStatus);
      getfcmToken();
    }
  } catch (error) {
    console.error('Error requesting user permission:', error);
  }
};

const getfcmToken = async () => {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized. Skipping FCM token retrieval.');
    return;
  }

  try {
    let fcmToken = await AsyncStorage.getItem(ASYNC_VARIBLES.FCM_TOKEN);
    
    if (!fcmToken || fcmToken === 'null' || fcmToken === 'undefined') {
      try {
        const token = await messaging().getToken();
        if (token && typeof token === 'string') {
          console.log('FCM Token received:', token.substring(0, 20) + '...');
          
          try {
            await AsyncStorage.setItem(ASYNC_VARIBLES.FCM_TOKEN, token);
          } catch (storageError) {
            console.error('Error saving FCM token to storage:', storageError);
          }
          
          // Send token to your server
          await sendTokenToServer(token);
          
          // Subscribe to general topics for all users
          await subscribeToAllUsersTopics();
        } else {
          console.warn('Invalid or empty FCM token received');
        }
      } catch (tokenError) {
        console.error('Error getting FCM token:', tokenError);
      }
    } else {
      // Token exists, send to server
      await sendTokenToServer(fcmToken);
    }
  } catch (error) {
    console.error('Error in getfcmToken:', error);
  }
};

// Function to send FCM token to your server
const sendTokenToServer = async token => {
  try {
    if (!token || typeof token !== 'string') {
      console.log('Invalid FCM token provided');
      return;
    }

    const userToken = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const userDataString = await AsyncStorage.getItem(ASYNC_VARIBLES.USER);

    // Prevent crash if userDataString is null or not valid JSON
    let user = null;
    if (userDataString && userDataString !== 'null' && userDataString !== 'undefined') {
      try {
        user = JSON.parse(userDataString);
        // Validate user object structure
        if (!user || typeof user !== 'object' || !user.id) {
          user = null;
        }
      } catch (parseError) {
        console.log('Error parsing user data in sendTokenToServer:', parseError);
        user = null;
      }
    }

    if (user && user.id && userToken && userToken !== 'null' && userToken !== 'undefined') {
      try {
        const response = await axios.post(
          `${baseUrl}/${updateUrl}`,
          {
            id: user.id,
            fcmToken: token,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
            },
            timeout: 8000, // Add timeout to prevent hanging
          }
        );
        
        if (response && response.status === 200) {
          console.log('FCM token saved to server successfully');
        } else {
          console.log('Failed to send FCM token to server - unexpected response');
        }
      } catch (apiError) {
        console.error('API error when sending FCM token:', apiError.message);
        // Don't throw - just log and continue
      }
    } else {
      // Log why we are not sending the token
      if (!userDataString || userDataString === 'null') {
        console.log('User data not found in AsyncStorage');
      } else if (!user || !user.id) {
        console.log('User data is invalid or missing id');
      } else if (!userToken || userToken === 'null') {
        console.log('User token not found in AsyncStorage');
      }
    }
  } catch (error) {
    console.error('Error sending FCM token to server:', error);
    // Don't re-throw to prevent app crashes
  }
};

export const notificationListner = async () => {
  if (!isFirebaseReady()) {
    console.warn(
      'Firebase not initialized. Skipping notification listeners setup.',
    );
    return;
  }

  try {
    // Handle notification when app is opened from background
    messaging().onNotificationOpenedApp(remoteMessage => {
      try {
        console.log('Notification caused app to open from background state');
        
        // Add null safety checks
        if (!remoteMessage) {
          console.log('Background notification: remoteMessage is null or undefined');
          return;
        }

        console.log('Background notification data:', remoteMessage.notification);
        
        // Handle notification action here with error handling
        handleNotificationAction(remoteMessage);
      } catch (error) {
        console.error('Error handling background notification tap:', error);
        // Don't re-throw to prevent crashes
      }
    });

    // Handle notification when app is opened from quit state
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        try {
          if (remoteMessage) {
            console.log('Notification caused app to open from quit state');
            console.log('Quit state notification data:', remoteMessage.notification);
            
            // Handle notification action here with error handling
            handleNotificationAction(remoteMessage);
          } else {
            console.log('No initial notification found');
          }
        } catch (error) {
          console.error('Error handling quit state notification:', error);
          // Don't re-throw to prevent crashes
        }
      })
      .catch(error => {
        console.error('Error getting initial notification:', error);
        // Continue app flow even if initial notification check fails
      });

    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      try {
        console.log('Message handled in the background!');

        // Add null safety checks
        if (!remoteMessage) {
          console.log('Background message: remoteMessage is null or undefined');
          return;
        }

        // Process any data-only logic here if needed
        const data = remoteMessage.data;
        if (data && typeof data === 'object') {
          console.log('Processing background data:', data);
          // Handle data processing, storage updates, etc.
          // Add any specific background processing logic here
        } else {
          console.log('Background message: No valid data found');
        }
      } catch (error) {
        console.error('Error handling background message:', error);
        // Don't re-throw to prevent crashes
      }
    });

    // Handle token refresh
    messaging().onTokenRefresh(async token => {
      try {
        console.log('FCM token refreshed:', token);
        
        // Add validation for token
        if (!token || typeof token !== 'string') {
          console.error('Invalid FCM token received in refresh:', token);
          return;
        }

        // Store token with error handling
        try {
          await AsyncStorage.setItem(ASYNC_VARIBLES.FCM_TOKEN, token);
          console.log('New FCM token stored successfully');
        } catch (storageError) {
          console.error('Error storing refreshed FCM token:', storageError);
        }

        // Optionally send token to server
        try {
          await sendTokenToServer(token);
        } catch (serverError) {
          console.error('Error sending refreshed token to server:', serverError);
          // Continue even if server update fails
        }
      } catch (error) {
        console.error('Error handling token refresh:', error);
        // Don't re-throw to prevent crashes
      }
    });
  } catch (error) {
    console.error('Error setting up notification listeners:', error);
  }
};

// Handle notification actions (navigation, etc.)
const handleNotificationAction = remoteMessage => {
  try {
    // Add comprehensive null safety checks
    if (!remoteMessage) {
      console.log('handleNotificationAction: remoteMessage is null or undefined');
      return;
    }

    const data = remoteMessage.data;
    if (!data || typeof data !== 'object') {
      console.log('handleNotificationAction: No valid data found in notification');
      return;
    }

    const { type, params } = data;

    // Validate type exists and is string
    if (!type || typeof type !== 'string') {
      console.log('handleNotificationAction: Invalid or missing notification type');
      return;
    }

    // You can add navigation logic here based on notification data
    switch (type) {
      case 'match_update':
        // Navigate to match details
        console.log('Navigate to match:', params);
        break;
      case 'contest_result':
        // Navigate to contest results
        console.log('Navigate to contest results:', params);
        break;
      case 'new_contest':
        // Navigate to new contest
        console.log('Navigate to new contest:', params);
        break;
      default:
        console.log('Unknown notification type:', type);
    }
  } catch (error) {
    console.error('Error handling notification action:', error);
    // Don't re-throw to prevent app crashes
  }
};

const ensureChannelReady = async (channelId = 'tribalshaadi') => {
  return new Promise((resolve) => {
    if (Platform.OS !== 'android') return resolve(true);
    try {
      PushNotification.channelExists(channelId, (exists) => resolve(exists));
    } catch {
      resolve(false);
    }
  });
};

export const schedulePushNotification = async (title, message) => {
  if (Platform.OS !== 'android') return; // fix: don't touch iOS

  try {
    if (!title || !message) return;
    if (typeof title !== 'string' || typeof message !== 'string') return;
    if (!title.trim().length || !message.trim().length) return;

    const hasChannel = await ensureChannelReady('tribalshaadi');
    if (!hasChannel) {
      console.log('Notification channel not ready — skipping notification');
      return;
    }

    PushNotification.localNotification({
      channelId: 'tribalshaadi',
      title: title.trim(),
      message: message.trim(),
      playSound: true,
      soundName: 'default',
      autoCancel: true,
      priority: 'high',
      importance: 'high',
    });
  } catch (err) {
    console.log('Foreground notification failed:', err);
  }
};


// Subscribe all users to general topics
const subscribeToAllUsersTopics = async () => {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized. Skipping topic subscription.');
    return;
  }

  try {
    // Subscribe to topic for all users - this allows sending notifications to everyone
    const topics = ['all_users', 'general_updates'];
    
    for (const topic of topics) {
      try {
        await messaging().subscribeToTopic(topic);
        console.log(`Successfully subscribed to topic: ${topic}`);
      } catch (topicError) {
        console.error(`Error subscribing to topic ${topic}:`, topicError);
        // Continue with other topics even if one fails
      }
    }
  } catch (error) {
    console.error('Error in subscribeToAllUsersTopics:', error);
  }
};

export default {
  requestUserPermission,
  notificationListner,
  schedulePushNotification,
};
