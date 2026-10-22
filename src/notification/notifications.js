/* eslint-disable semi */
import messaging from '@react-native-firebase/messaging';
import { getApps } from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl, delay, getProposalsGotByMeUrl, updateUrl } from '../constants/functions';
import { ASYNC_VARIBLES, NOTIFICATION_MESSAGES, ROUTES } from '../constants/data';
import axios from 'axios';
import { PermissionsAndroid, Platform, Linking } from 'react-native';
import { navigate } from '../navigation/NavigationRef';
import { store } from '../store/configureStore';
import { getProposalsGotByMeApi } from '../store/reducers/userReducer';

// Silence the modular API deprecation warning
global.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

// Function to check if Firebase is ready
const isFirebaseReady = () => {
  try {
    return getApps().length > 0;
  } catch (error) {
    return false;
  }
};

// notifications.js
export const createNotificationChannel = () => {
  PushNotification.createChannel(
    {
      channelId: 'tribalshaadi', // LOWERCASE for Android safety
      channelName: 'Tribalshaadi.ai Notifications',
      channelDescription: 'Notifications for Tribalshaadi.ai app',
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    (created) => {},
  );
};

export const configurePushNotification = () => {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {

      if (notification.userInteraction) {
        // notification was opened by user from notification
        
        try {
          const userInfo = notification.userInfo || notification.data || {};
          const title = userInfo.notificationTitle || notification.title;
          
          // Handle "New Match" navigation
          if (title === NOTIFICATION_MESSAGES.NEW_PROPOSAL.title) {
            try {
              // Ensure ROUTES is available before using it
              if (typeof ROUTES !== 'undefined' && ROUTES.INTEREST) {
                navigate(ROUTES.INTEREST, { matchId: userInfo.matchId || null });
              } else {
              }
            } catch (navError) {
            }
          }
          
          // Handle other notification types here if needed
          // ...
          
        } catch (error) {
        }
      }
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {

      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function(err) {
    },

    // Android only - iOS permissions not needed
    permissions: {
      alert: false,
      badge: false,
      sound: false,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * Android only - no iOS permissions needed
     * Set to false since we're only targeting Android
     */
    requestPermissions: false,
  });
};

export const requestAndroidNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } catch (err) {
    }
  }
};

/**
 * Check if notifications are enabled in system settings.
 * Android 13+: checks POST_NOTIFICATIONS. iOS: checks Firebase messaging authorization.
 */
export const checkNotificationPermission = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        return granted;
      } catch {
        return false;
      }
    }
    return true;
  }
  // iOS: check via Firebase messaging
  if (!isFirebaseReady()) return true;
  try {
    const hasPermission = await messaging().hasPermission();
    return !!hasPermission;
  } catch {
    return false;
  }
};

/**
 * Open app settings so user can enable notifications.
 */
export const openAppSettings = () => {
  Linking.openSettings();
};
export const requestUserPermission = async () => {
  if (!isFirebaseReady()) {
    return;
  }

  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getfcmToken();
    }
  } catch (error) {
  }
};

const getfcmToken = async () => {
  if (!isFirebaseReady()) {
    return;
  }

  try {
    let fcmToken = await AsyncStorage.getItem(ASYNC_VARIBLES.FCM_TOKEN);
    
    if (!fcmToken || fcmToken === 'null' || fcmToken === 'undefined') {
      try {
        const token = await messaging().getToken();
        if (token && typeof token === 'string') {
          
          try {
            await AsyncStorage.setItem(ASYNC_VARIBLES.FCM_TOKEN, token);
          } catch (storageError) {
          }
          
          // Send token to your server
          await sendTokenToServer(token);
          
          // Subscribe to general topics for all users
          await subscribeToAllUsersTopics();
        } else {
        }
      } catch (tokenError) {
      }
    } else {
      // Token exists, send to server
      await sendTokenToServer(fcmToken);
    }
  } catch (error) {
  }
};

// Function to send FCM token to your server
const sendTokenToServer = async token => {
  try {
    if (!token || typeof token !== 'string') {
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
        user = null;
      }
    }

    if (user && user.id && userToken && userToken !== 'null' && userToken !== 'undefined') {
      try {
        // Additional validation to ensure token is actually valid
        if (userToken.length < 10 || userToken === 'undefined' || userToken === 'null') {
          return;
        }

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
        } else {
        }
      } catch (apiError) {
        // Handle 401 errors gracefully during app initialization
        if (apiError.response && apiError.response.status === 401) {
        } else {
        }
        // Don't throw - just log and continue
      }
    } else {
      // Log why we are not sending the token
      if (!userDataString || userDataString === 'null') {
      } else if (!user || !user.id) {
      } else if (!userToken || userToken === 'null') {
      }
    }
  } catch (error) {
    // Don't re-throw to prevent app crashes
  }
};

export const notificationListner = async () => {
  if (!isFirebaseReady()) {
    return;
  }

  try {
    // Handle notification when app is opened from background
    messaging().onNotificationOpenedApp(remoteMessage => {
      try {
        
        // Add null safety checks
        if (!remoteMessage) {
          return;
        }
        delay();
        store.dispatch(getProposalsGotByMeApi(`${baseUrl}/${getProposalsGotByMeUrl}`));
        // Handle specific notification types
        if (remoteMessage.notification && remoteMessage.notification.title === NOTIFICATION_MESSAGES.NEW_PROPOSAL.title) {
          try {
            // Ensure ROUTES is available before using it
            if (typeof ROUTES !== 'undefined' && ROUTES.INTEREST) {
              navigate(ROUTES.INTEREST, { matchId: remoteMessage.data?.matchId || null });
            } else {
            }
          } catch (navError) {
          }
        }
        
        // Handle notification action here with error handling
        handleNotificationAction(remoteMessage);
      } catch (error) {
        // Don't re-throw to prevent crashes
      }
    });

    // Handle notification when app is opened from quit state
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        try {
          if (remoteMessage) {
            if (remoteMessage.notification && remoteMessage.notification.title === NOTIFICATION_MESSAGES.NEW_PROPOSAL.title) {
              try {
                // Ensure ROUTES is available before using it
                if (typeof ROUTES !== 'undefined' && ROUTES.INTEREST) {
                  navigate(ROUTES.INTEREST, { matchId: remoteMessage.data?.matchId || null });
                } else {
                }
              } catch (navError) {
              }
            }
            // Handle notification action here with error handling
            handleNotificationAction(remoteMessage);
          } else {
          }
        } catch (error) {
          // Don't re-throw to prevent crashes
        }
      })
      .catch(error => {
        // Continue app flow even if initial notification check fails
      });

    // Background message handler is registered once in index.js as recommended.

    // Handle token refresh
    messaging().onTokenRefresh(async token => {
      try {
        
        // Add validation for token
        if (!token || typeof token !== 'string') {
          return;
        }

        // Store token with error handling
        try {
          await AsyncStorage.setItem(ASYNC_VARIBLES.FCM_TOKEN, token);
        } catch (storageError) {
        }

        // Optionally send token to server
        try {
          await sendTokenToServer(token);
        } catch (serverError) {
          // Continue even if server update fails
        }
      } catch (error) {
        // Don't re-throw to prevent crashes
      }
    });
  } catch (error) {
  }
};

// Handle notification actions (navigation, etc.)
const handleNotificationAction = remoteMessage => {
  try {
    // Add comprehensive null safety checks
    if (!remoteMessage) {
      return;
    }

    const data = remoteMessage.data;
    if (!data || typeof data !== 'object') {
      return;
    }

    const { type, params } = data;

    // Validate type exists and is string
    if (!type || typeof type !== 'string') {
      return;
    }

    // You can add navigation logic here based on notification data
    switch (type) {
      case 'match_update':
        // Navigate to match details
        break;
      case 'contest_result':
        // Navigate to contest results
        break;
      case 'new_contest':
        // Navigate to new contest
        break;
      default:
    }
  } catch (error) {
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

export const schedulePushNotification = async (title, message, notificationData = {}) => {
  if (Platform.OS !== 'android') return; // fix: don't touch iOS

  try {
    // Enhanced input validation
    if (!title || !message) {
      return;
    }
    if (typeof title !== 'string' || typeof message !== 'string') {
      return;
    }
    if (!title.trim().length || !message.trim().length) {
      return;
    }

    // Suppress test or placeholder notifications universally (foreground/background/quit)
    if (title === NOTIFICATION_MESSAGES.TESTING.title) {
      return;
    }

    // Android 13+ runtime permission check to avoid native crashes
    if (Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (!granted) {
          return;
        }
      } catch (permErr) {
        return;
      }
    }

    // Add timeout to prevent hanging
    const hasChannel = await Promise.race([
      ensureChannelReady('tribalshaadi'),
      new Promise((resolve) => setTimeout(() => resolve(false), 3000)) // 3 second timeout
    ]);
    
    if (!hasChannel) {
      return;
    }

    // Additional safety check before showing notification
    try {
      PushNotification.localNotification({
        channelId: 'tribalshaadi',
        title: title.trim(),
        message: message.trim(),
        playSound: true,
        soundName: 'default',
        autoCancel: true,
        allowWhileIdle: true,
        userInfo: {
          ...notificationData,
          notificationTitle: title.trim(),
          notificationBody: message.trim()
        },
        // priority and importance are controlled by the channel; avoid passing mismatched types here
      });
    } catch (notificationError) {
      // Don't re-throw to prevent crashes
    }
  } catch (err) {
    // Don't re-throw to prevent app crashes
  }
};


// Subscribe all users to general topics
const subscribeToAllUsersTopics = async () => {
  if (!isFirebaseReady()) {
    return;
  }

  try {
    // Subscribe to topic for all users - this allows sending notifications to everyone
    const topics = ['all_users', 'general_updates'];
    
    for (const topic of topics) {
      try {
        await messaging().subscribeToTopic(topic);
      } catch (topicError) {
        // Continue with other topics even if one fails
      }
    }
  } catch (error) {
  }
};

// Function to refresh FCM token
export const refreshFCMToken = async () => {
  if (!isFirebaseReady()) {
    return;
  }

  try {
    // Get a new token
    const newToken = await messaging().getToken();
    if (newToken && typeof newToken === 'string') {
      
      // Store the new token
      await AsyncStorage.setItem(ASYNC_VARIBLES.FCM_TOKEN, newToken);
      
      // Send new token to server
      await sendTokenToServer(newToken);
      
      // Subscribe to topics again
      await subscribeToAllUsersTopics();
      
      return newToken;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export default {
  requestUserPermission,
  notificationListner,
  schedulePushNotification,
  configurePushNotification,
  refreshFCMToken,
  checkNotificationPermission,
  openAppSettings,
};
