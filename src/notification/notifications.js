/* eslint-disable semi */
import messaging from '@react-native-firebase/messaging';
import { getApps } from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl, updateUrl } from '../constants/functions';
import { ASYNC_VARIBLES } from '../constants/data';
import axios from 'axios';

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

export const createNotificationChannel = () => {
  PushNotification.createChannel(
    {
      channelId: "tribalShaadi", // (required)
      channelName: "Tribal Shaadi Channel", // (required)
      channelDescription: "A channel for Tribal Shaadi notifications", // (optional) default: undefined.
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    // (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
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

// Function to refresh FCM token
export const refreshFCMToken = async () => {
  if (!isFirebaseReady()) {
    console.warn('Firebase not initialized. Skipping FCM token refresh.');
    return;
  }

  try {
    await messaging().deleteToken();
    const newToken = await messaging().getToken();
    if (newToken) {
      await AsyncStorage.setItem(ASYNC_VARIBLES.FCM_TOKEN, newToken);
    }
  } catch (error) {
    console.log('Error refreshing FCM token:', error);
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
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // Handle notification action here
      handleNotificationAction(remoteMessage);
    });

    // Handle notification when app is opened from quit state
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // Handle notification action here
          handleNotificationAction(remoteMessage);
        }
      });

    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);

      // Process any data-only logic here if needed
      if (remoteMessage.data) {
        console.log('Processing background data:', remoteMessage.data);
        // Handle data processing, storage updates, etc.
      }
    });

    // Handle token refresh
    messaging().onTokenRefresh(token => {
      console.log('FCM token refreshed:', token);
      AsyncStorage.setItem(ASYNC_VARIBLES.FCM_TOKEN, token);
      // sendTokenToServer(token);
    });
  } catch (error) {
    console.error('Error setting up notification listeners:', error);
  }
};

// Handle notification actions (navigation, etc.)
const handleNotificationAction = remoteMessage => {
  if (remoteMessage?.data) {
    const { type, screen, params } = remoteMessage.data;

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
  }
};

export const schedulePushNotification = async (
  title,
  message,
) => {
  try {
    const notificationConfig = {
      channelId: 'tribalShaadi',
      title,
      message,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      color: 'blue',
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      autoCancel: true,
      invokeApp: true,
    };

    // Add image support if imageUrl is provided
    // if (imageUrl) {
    //   notificationConfig.largeIconUrl = imageUrl; // Large icon (circular)
    //   notificationConfig.bigPictureUrl = imageUrl; // Big picture style (expandable)
    //   notificationConfig.bigLargeIcon = 'ic_launcher'; // Fallback icon when expanded
    // }

    console.log('Showing foreground notification:', title);
    PushNotification.localNotification(notificationConfig);
  } catch (error) {
    console.error('Error showing foreground notification:', error);
  }
};

// Get current FCM token
export const getCurrentFCMToken = async () => {
  try {
    const token = await AsyncStorage.getItem('fcmToken');
    return token;
  } catch (error) {
    console.log('Error getting current FCM token:', error);
    return null;
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
  getCurrentFCMToken,
  refreshFCMToken,
};
