/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Handle background messages (required by RN Firebase)
messaging().setBackgroundMessageHandler(async () => {
  // no-op for now
});

AppRegistry.registerComponent(appName, () => App);
