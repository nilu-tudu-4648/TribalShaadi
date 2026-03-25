import { Settings } from 'react-native-fbsdk-next';

export function initFacebook() {
  Settings.setAutoLogAppEventsEnabled(true);
  Settings.setAdvertiserIDCollectionEnabled(true);
}
