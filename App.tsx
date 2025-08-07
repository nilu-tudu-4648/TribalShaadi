import React, { useEffect, useState } from 'react';
import { StatusBar, View, Image, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WelcomeScreen from './src/screen/WelcomeScreen';
import LoginScreen from './src/screen/LoginScreen';
import OTPScreen from './src/screen/OTPScreen';
import GenderSelectionScreen from './src/screen/GenderSelectionScreen';
import NameScreen from './src/screen/NameScreen';
import BirthDateScreen from './src/screen/BirthDateScreen';
import ReligionScreen from './src/screen/ReligionScreen';
import AddressScreen from './src/screen/AddressScreen';
import QualificationScreen from './src/screen/QualificationScreen';
import PhysicalAttributesScreen from './src/screen/PhysicalAttributesScreen';
import AboutScreen from './src/screen/AboutScreen';
import AboutPartnerScreen from './src/screen/AboutPartnerScreen';
import UploadImageScreen from './src/screen/UploadImageScreen';
import { store } from './src/store/configureStore';
import SelectInterestsScreen from './src/screen/SelectInterestsScreen';
import { checkAuth, checkUserLoggedIn, delay } from './src/constants/functions';
import { COLORS } from './src/constants/AppColors';
import WelcomeHome from './src/screen/WelcomeHome';
import BottomNavigation from './src/navigation/BottomNavigation';
import { logoutFromReducer } from './src/store/reducers/authReducer';
import { navigationRef, setIsReady } from './src/navigation/NavigationRef';
import { ROUTES } from './src/constants/data';
import StackNavigation, {
  RootStackParamList as StackNavigationParamList,
} from './src/navigation/StackNavigation';
import { 
  requestUserPermission, 
  notificationListner, 
  createNotificationChannel 
} from './src/notification/notifications';
import ForegroundHandler from './src/notification/ForegroundHandler';
import NetworkAlert from './src/components/NetworkAlert';
import RegisterScreen from './src/screen/RegisterScreen';

export type RootStackParamList = {
  [ROUTES.WELCOME]: undefined;
  [ROUTES.LOGIN]: undefined;
  [ROUTES.REGISTER]: undefined;
  [ROUTES.OTP]: { phoneNumber: string | number };
  [ROUTES.GENDER]: undefined;
  [ROUTES.NAME]: undefined;
  [ROUTES.BIRTH_DATE]: undefined;
  [ROUTES.RELIGION]: undefined;
  [ROUTES.ADDRESS]: undefined;
  [ROUTES.QUALIFICATION]: undefined;
  [ROUTES.PHYSICAL_ATTRIBUTES]: undefined;
  [ROUTES.ABOUT]: undefined;
  [ROUTES.ABOUT_PARTNER]: undefined;
  [ROUTES.UPLOAD_IMAGE]: undefined;
  [ROUTES.SELECT_INTERESTS]: undefined;
  [ROUTES.WELCOME_HOME]: undefined;
  [ROUTES.MAIN_TABS]: undefined;
  [ROUTES.STACK]: { screen: keyof StackNavigationParamList };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const SplashScreen = () => (
  <View style={styles.splashContainer}>
    <Image
      source={require('./src/assets/images/textlogo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  </View>
);

const MainApp = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, tokenExpired } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const { userRegistrationCompleted } = useSelector(
    (state: any) => state.entities.userReducer,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    checkUserLoggedIn(dispatch);
  }, [navigation, dispatch]);

  useEffect(() => {
    if (tokenExpired) {
      dispatch(logoutFromReducer());
      navigation.navigate(ROUTES.LOGIN, undefined);
    }
    checkAuth(dispatch);
  }, [user, navigation, dispatch, tokenExpired]);

  useEffect(() => {
    // Initialize push notification setup with a delay to allow Firebase to auto-initialize
    const setupNotifications = async () => {
      // Wait for Firebase to auto-initialize from config files
      await delay();
      
      try {
        // Create notification channel (Android)
        createNotificationChannel();
        
        // Request permission and get FCM token
        await requestUserPermission();
        
        // Set up notification listeners
        await notificationListner();
        
      } catch (error) {
        console.error('Error initializing push notifications:', error);
      }
    };

    setupNotifications();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <>
      <ForegroundHandler />
      <NetworkAlert />
      <Stack.Navigator
        initialRouteName={
          userRegistrationCompleted ? ROUTES.MAIN_TABS : ROUTES.WELCOME
        }
        screenOptions={{ headerShown: false }}
      >
        {userRegistrationCompleted ? (
          <>
            <Stack.Screen name={ROUTES.MAIN_TABS} component={BottomNavigation} />
            <Stack.Screen name={ROUTES.STACK} component={StackNavigation} />
          </>
        ) : (
          <>
            <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
            <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
            <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
            <Stack.Screen name={ROUTES.OTP} component={OTPScreen} />
            <Stack.Screen
              name={ROUTES.GENDER}
              component={GenderSelectionScreen}
            />
            <Stack.Screen name={ROUTES.NAME} component={NameScreen} />
            <Stack.Screen name={ROUTES.BIRTH_DATE} component={BirthDateScreen} />
            <Stack.Screen name={ROUTES.RELIGION} component={ReligionScreen} />
            <Stack.Screen name={ROUTES.ADDRESS} component={AddressScreen} />
            <Stack.Screen
              name={ROUTES.QUALIFICATION}
              component={QualificationScreen}
            />
            <Stack.Screen
              name={ROUTES.PHYSICAL_ATTRIBUTES}
              component={PhysicalAttributesScreen}
            />
            <Stack.Screen name={ROUTES.ABOUT} component={AboutScreen} />
            <Stack.Screen
              name={ROUTES.ABOUT_PARTNER}
              component={AboutPartnerScreen}
            />
            <Stack.Screen
              name={ROUTES.UPLOAD_IMAGE}
              component={UploadImageScreen}
            />
            <Stack.Screen
              name={ROUTES.SELECT_INTERESTS}
              component={SelectInterestsScreen}
            />
            <Stack.Screen name={ROUTES.WELCOME_HOME} component={WelcomeHome} />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={COLORS.white}
            translucent={false}
          />
          <NavigationContainer ref={navigationRef} onReady={() => setIsReady()}>
            <MainApp />
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.violet,
  },
  logo: {
    width: 200,
    height: 200,
  },
});
