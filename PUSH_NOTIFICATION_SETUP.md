# React Native Push Notification Setup for TribalShaadi

This document explains how to use the push notification system that has been set up for the TribalShaadi Android app.

## What's Been Installed and Configured

### 1. Package Installation
- `react-native-push-notification@8.1.1` has been installed

### 2. Android Configuration
- **AndroidManifest.xml**: Added necessary permissions and receivers
- **MainApplication.kt**: Added push notification package
- **colors.xml**: Added notification color configurations
- **Notification channels**: Created for different types of notifications

### 3. Configuration Files Created
- `src/notification/PushNotificationConfig.js`: Main configuration file
- `src/notification/PushNotificationHelper.js`: Helper functions for easy usage

## How to Use Push Notifications

### 1. Import the Helper
```javascript
import PushNotificationHelper from '../notification/PushNotificationHelper';
```

### 2. Initialize in Your App (App.tsx)
Add this to your main App.tsx file:

```javascript
import PushNotificationHelper from './src/notification/PushNotificationHelper';

// In your App component or index.js, the helper will automatically initialize
// when imported. No additional setup needed!
```

### 3. Basic Usage Examples

#### Show a Simple Notification
```javascript
PushNotificationHelper.showLocalNotification(
  'Hello!', 
  'This is a test notification'
);
```

#### Show App-Specific Notifications
```javascript
// Welcome notification
PushNotificationHelper.showWelcomeNotification();

// New match notification
PushNotificationHelper.showMatchNotification('Priya');

// New message notification
PushNotificationHelper.showMessageNotification('Raj', 'Hi there!');
```

#### Schedule a Notification
```javascript
const futureDate = new Date();
futureDate.setMinutes(futureDate.getMinutes() + 5); // 5 minutes from now

PushNotificationHelper.scheduleNotification(
  'Reminder',
  'Check out new profiles!',
  futureDate
);
```

#### Check Permissions
```javascript
const permissions = await PushNotificationHelper.checkPermissions();
console.log('Notification permissions:', permissions);
```

#### Request Permissions (if needed)
```javascript
PushNotificationHelper.requestPermissions();
```

### 4. Advanced Usage

#### Cancel All Notifications
```javascript
PushNotificationHelper.cancelAllNotifications();
```

#### Get Available Channels (Android)
```javascript
const channels = await PushNotificationHelper.getChannels();
console.log('Available channels:', channels);
```

#### Schedule Daily Reminder
```javascript
PushNotificationHelper.scheduleDailyReminder();
```

## Integration Points in TribalShaadi App

### 1. User Registration/Login
```javascript
// In LoginScreen.tsx or after successful login
PushNotificationHelper.showWelcomeNotification();
```

### 2. New Matches
```javascript
// When a new match is found
PushNotificationHelper.showMatchNotification(matchUserName);
```

### 3. New Messages
```javascript
// When a new message is received
PushNotificationHelper.showMessageNotification(senderName, messageText);
```

### 4. Daily Engagement
```javascript
// Schedule daily reminders for user engagement
PushNotificationHelper.scheduleDailyReminder();
```

## Android Permissions Added

The following permissions have been added to `AndroidManifest.xml`:
- `WAKE_LOCK`: To wake the device for notifications
- `VIBRATE`: For notification vibration
- `RECEIVE_BOOT_COMPLETED`: To restore scheduled notifications after device restart
- `POST_NOTIFICATIONS`: For Android 13+ notification permission

## Notification Channels

Two default channels have been created:
1. **default-channel-id**: For regular notifications
2. **sound-channel-id**: For notifications with sound

## Testing

To test the notifications:

1. **Local Notifications**: Use the helper functions to show immediate notifications
2. **Scheduled Notifications**: Set a future date and test scheduling
3. **Permission Check**: Test on Android 13+ devices to ensure permission requests work

## Troubleshooting

### Common Issues

1. **Notifications not showing**: Check if permissions are granted
2. **No sound**: Ensure the sound channel is being used
3. **App crashes**: Check if the package is properly linked in MainApplication.kt

### Debug Commands
```javascript
// Check if notifications are enabled
PushNotificationHelper.checkPermissions().then(console.log);

// Get all channels
PushNotificationHelper.getChannels().then(console.log);
```

## Next Steps

1. **Import the helper** in your main App.tsx file
2. **Test basic notifications** using the provided examples
3. **Integrate with your app logic** at appropriate places
4. **Customize notification content** based on your app's needs
5. **Test on physical devices** for best results

## Firebase Integration (Optional)

For remote push notifications, you can integrate with Firebase Cloud Messaging (FCM):
1. The manifest is already configured for FCM
2. Add Firebase configuration to your project
3. Use the token from `onRegister` callback to send from your server

## Notes

- The package has a peer dependency warning for iOS, but since you only need Android, this can be ignored
- All configuration is set up for immediate use
- The helper provides both basic and advanced notification features
- Notifications will work both when the app is in foreground and background 