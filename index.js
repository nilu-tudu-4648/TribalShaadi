/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import { NOTIFICATION_MESSAGES } from './src/constants/data';

// Handle background messages (required by RN Firebase)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  try {
    const { title, body } = remoteMessage?.notification || {};
    console.log(title, body, 'title, body background');
    if (!title || !body || title === NOTIFICATION_MESSAGES.TESTING.title) return;
    // Intentionally do not show local notifications in background/quit; OS handles notification payloads
  } catch (_) {}
});

AppRegistry.registerComponent(appName, () => App);
