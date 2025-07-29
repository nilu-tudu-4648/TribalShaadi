/* eslint-disable semi */
import messaging from '@react-native-firebase/messaging';
import { getApps } from '@react-native-firebase/app';
// import PushNotification from 'react-native-push-notification';
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
  // PushNotification.createChannel(
  //   {
  //     channelId: "tribalShaadi", // (required)
  //     channelName: "Tribal Shaadi Channel", // (required)
  //     channelDescription: "A channel for Tribal Shaadi notifications", // (optional) default: undefined.
  //     soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
  //     importance: 4, // (optional) default: 4. Int value of the Android notification importance
  //     vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  //   },
  //   (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  // );
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

  let fcmToken = await AsyncStorage.getItem(ASYNC_VARIBLES.FCM_TOKEN);
  if (!fcmToken) {
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log('FCM Token:', token);
        await AsyncStorage.setItem(ASYNC_VARIBLES.FCM_TOKEN, token);
        // Send token to your server
        await sendTokenToServer(token);
        // Subscribe to general topics for all users
        await subscribeToAllUsersTopics();
      }
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  } else {
    // console.log('FCM Token from storage:', fcmToken);
    // Verify token is still valid and send to server
    await sendTokenToServer(fcmToken);
    // Ensure user is subscribed to general topics
    // await subscribeToAllUsersTopics();
  }
};

// Function to send FCM token to your server
const sendTokenToServer = async token => {
  try {
    const userToken = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const userDataString = await AsyncStorage.getItem(ASYNC_VARIBLES.USER);
    const user = JSON.parse(userDataString);
    // console.log('user', user);
    // console.log('userToken', userToken);
    // console.log('fcmToken', token);
    // Replace with your actual server endpoint
    if (user && user.id) {
      const response = await axios.post(`${baseUrl}/${updateUrl}`, {
        id: user.id,
        fcmToken: token,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        }
      });
      console.log('response', response);
      if (response.status === 200) {
        console.log('FCM token saved to server successfully');
      } else {
        console.log('Failed to send FCM token to server');
      }
    }
  } catch (error) {
    console.log('Error sending FCM token to server:', error);
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
      // await sendTokenToServer(newToken);
      // console.log('FCM token refreshed:', newToken);
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

      // Important: Firebase automatically displays notifications when app is in background/quit state
      // if the message contains a 'notification' property. We should NOT create additional local notifications here
      // as it would cause duplicates. This handler is primarily for:
      // 1. Processing data-only messages
      // 2. Updating app state/storage
      // 3. Custom logic that doesn't involve showing notifications

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
  imageUrl = null,
) => {
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
  };

  // Add image support if imageUrl is provided
  if (imageUrl) {
    notificationConfig.largeIconUrl = imageUrl; // Large icon (circular)
    notificationConfig.bigPictureUrl = imageUrl; // Big picture style (expandable)
    notificationConfig.bigLargeIcon = 'ic_launcher'; // Fallback icon when expanded
  }

  // PushNotification.localNotification(notificationConfig);
};

// Function to send notification from client (for testing purposes)
export const sendTestNotification = async () => {
  try {
    const token = await AsyncStorage.getItem('fcmToken');
    if (!token) {
      console.log('No FCM token found');
      return;
    }

    // This is just for testing - in production, notifications should be sent from your server
    const notificationData = {
      token: token,
      notification: {
        title: '🏆 Test Notification',
        body: 'This is a test notification with image support',
        image:
          'https://firebasestorage.googleapis.com/v0/b/desktime-e2f82.firebasestorage.app/o/profileImages%2F3XxW6kBEIGbZ5zvzgfyn26UivuR2?alt=media&token=f5d4d3db-7eaa-4f6a-a64a-8247f54ab4e0',
      },
      data: {
        type: 'test',
        screen: 'home',
      },
    };

    console.log('Sending test notification:', notificationData);
    // You would send this to your server endpoint that handles Firebase admin notifications

    // For immediate testing, schedule a local notification with image
    await schedulePushNotification(
      notificationData.notification.title,
      notificationData.notification.body,
      notificationData.notification.image,
    );
  } catch (error) {
    console.log('Error sending test notification:', error);
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
    await messaging().subscribeToTopic('all_users');
    await messaging().subscribeToTopic('general_updates');
    await messaging().subscribeToTopic('contest_updates');

    // console.log('Subscribed to general topics: all_users, general_updates, contest_updates');
  } catch (error) {
    console.log('Error subscribing to general topics:', error);
  }
};

export default {
  requestUserPermission,
  notificationListner,
  schedulePushNotification,
  sendTestNotification,
  getCurrentFCMToken,
  refreshFCMToken,
};
