import { ToastAndroid } from 'react-native';

const AppToast = (message: string) => {
  ToastAndroid.show(message, ToastAndroid.SHORT);
};

export default AppToast;
