import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

class PushNotificationConfig {
  constructor() {
    this.configure();
    this.createDefaultChannels();
  }

  configure = () => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
        // You can save this token to your server here
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // process the notification here
        if (notification.userInteraction) {
          // User tapped on notification
          console.log('User tapped notification');
        }

        // (required) Called when a remote is received or opened, or local notification is opened
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function(err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  };

  createDefaultChannels = () => {
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id', // (required)
        channelName: 'Default', // (required)
        channelDescription: 'A default channel', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );

    PushNotification.createChannel(
      {
        channelId: 'sound-channel-id', // (required)
        channelName: 'Sound Channel', // (required)
        channelDescription: 'A sound channel', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 5, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      (created) => console.log(`createChannel 'sound-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  // Local notification
  showNotification = (title, message, data = {}, options = {}) => {
    PushNotification.localNotification({
      autoCancel: true,
      bigText: message,
      subText: 'Local Notification Demo',
      title: title,
      message: message,
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      actions: ['Yes', 'No'],
      invokeApp: true,
      channelId: 'default-channel-id',
      ...options,
    });
  };

  // Schedule notification
  scheduleNotification = (title, message, date, data = {}) => {
    PushNotification.localNotificationSchedule({
      title: title,
      message: message,
      date: date,
      allowWhileIdle: true,
      channelId: 'default-channel-id',
      ...data,
    });
  };

  // Cancel all notifications
  cancelAllNotifications = () => {
    PushNotification.cancelAllLocalNotifications();
  };

  // Check permission status
  checkPermissions = (callback) => {
    PushNotification.checkPermissions(callback);
  };

  // Request permissions (mainly for iOS)
  requestPermissions = () => {
    PushNotification.requestPermissions();
  };

  // Get all scheduled notifications
  getScheduledLocalNotifications = (callback) => {
    PushNotification.getScheduledLocalNotifications(callback);
  };

  // Cancel notification by ID
  cancelLocalNotification = (id) => {
    PushNotification.cancelLocalNotification(id);
  };

  // Get notification channels (Android)
  getChannels = (callback) => {
    PushNotification.getChannels(callback);
  };

  // Delete channel (Android)
  deleteChannel = (channelId) => {
    PushNotification.deleteChannel(channelId);
  };
}

export default new PushNotificationConfig(); 