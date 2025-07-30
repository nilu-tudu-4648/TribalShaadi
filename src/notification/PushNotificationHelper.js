import PushNotificationConfig from './PushNotificationConfig';
import PushNotification from 'react-native-push-notification';

class PushNotificationHelper {
  constructor() {
    // The configuration is already initialized when importing PushNotificationConfig
    console.log('PushNotificationHelper initialized');
  }

  // Show a local notification
  showLocalNotification = (title, message, data = {}) => {
    PushNotificationConfig.showNotification(title, message, data);
  };

  // Schedule a notification for later
  scheduleNotification = (title, message, fireDate, data = {}) => {
    PushNotificationConfig.scheduleNotification(title, message, fireDate, data);
  };

  // Cancel all notifications
  cancelAllNotifications = () => {
    PushNotificationConfig.cancelAllNotifications();
  };

  // Check if notifications are enabled
  checkPermissions = () => {
    return new Promise((resolve) => {
      PushNotificationConfig.checkPermissions((permissions) => {
        resolve(permissions);
      });
    });
  };

  // Request notification permissions
  requestPermissions = () => {
    PushNotificationConfig.requestPermissions();
  };

  // Get notification channels (Android only)
  getChannels = () => {
    return new Promise((resolve) => {
      PushNotificationConfig.getChannels((channels) => {
        resolve(channels);
      });
    });
  };

  // Example: Show a welcome notification
  showWelcomeNotification = () => {
    this.showLocalNotification(
      'Welcome!',
      'Welcome to TribalShaadi! Find your perfect match today.',
      {
        id: 'welcome',
        userInfo: { screen: 'Home' }
      }
    );
  };

  // Example: Show a match notification
  showMatchNotification = (matchName) => {
    this.showLocalNotification(
      'New Match! 💕',
      `You have a new match with ${matchName}! Check it out now.`,
      {
        id: 'new_match',
        userInfo: { screen: 'Matches' }
      }
    );
  };

  // Example: Show a message notification
  showMessageNotification = (senderName, message) => {
    this.showLocalNotification(
      `Message from ${senderName}`,
      message,
      {
        id: 'new_message',
        userInfo: { screen: 'Chat', senderId: senderName }
      }
    );
  };

  // Example: Schedule a daily reminder
  scheduleDailyReminder = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0); // 10 AM tomorrow

    this.scheduleNotification(
      'Find Your Match Today! 💖',
      'Check out new profiles and find your perfect match on TribalShaadi.',
      tomorrow,
      {
        id: 'daily_reminder',
        userInfo: { screen: 'Home' }
      }
    );
  };
}

export default new PushNotificationHelper(); 