import React, { useEffect, useState } from 'react';
import { StatusBar, View, Image, StyleSheet, AppState, Alert, Linking } from 'react-native';
import LogoComponent from './src/components/LogoComponent';
import { NavigationContainer } from '@react-navigation/native';
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
import { checkAuth, checkUserLoggedIn } from './src/constants/functions';
import { COLORS } from './src/constants/AppColors';
import WelcomeHome from './src/screen/WelcomeHome';
import BottomNavigation from './src/navigation/BottomNavigation';
import { logoutFromReducer } from './src/store/reducers/authReducer';
import {
  navigationRef,
  setIsReady,
  navigate,
} from './src/navigation/NavigationRef';
import { ROUTES } from './src/constants/data';
import StackNavigation, {
  RootStackParamList as StackNavigationParamList,
} from './src/navigation/StackNavigation';
import {
  requestUserPermission,
  notificationListner,
  createNotificationChannel,
  requestAndroidNotificationPermission,
  configurePushNotification,
} from './src/notification/notifications';
import { onAppClose, onAppForeground } from './src/constants/functions';
import ForegroundHandler from './src/notification/ForegroundHandler';
import NetworkAlert from './src/components/NetworkAlert';
import RegisterScreen from './src/screen/RegisterScreen';
import { PostHogProvider, usePostHog } from 'posthog-react-native';
import ErrorBoundary from './src/components/ErrorBoundary';
import TermScreen from './src/screen/TermScreen';
import PrivacyScreen from './src/screen/PrivacyScreen';
import VersionCheck from 'react-native-version-check';
import { initFacebook } from './src/utils/FacebookEvents';

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
    <LogoComponent width={200} height={200} />
  </View>
);

const MainApp = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Safe selectors with fallback values to prevent crashes
  const { user, tokenExpired } = useSelector(
    (state: any) =>
      state?.entities?.authReducer || { user: null, tokenExpired: false },
  );
  const { userRegistrationCompleted } = useSelector(
    (state: any) =>
      state?.entities?.userReducer || { userRegistrationCompleted: false },
  );
  const dispatch = useDispatch();
  const posthog = usePostHog();

  // Capture initial app open
  useEffect(() => {
    if (posthog) {
      console.log('[PostHog] Capturing initial Application Opened');
      posthog.capture('Application Opened', {
        source: 'initial_app_launch',
        timestamp: new Date().toISOString(),
      });
      // Flush to ensure event is sent immediately
      posthog.flush();
    } else {
      console.log('[PostHog] PostHog not available yet');
    }
  }, [posthog]);

  // Initialize app with error handling
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Pass true for isInitialLoad to handle 401 errors gracefully
        await checkUserLoggedIn(dispatch, true);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error during app initialization:', error);
        setIsInitialized(true); // Continue with app flow even if initialization fails
      }
    };

    initializeApp();
  }, [dispatch]);

  useEffect(() => {
    if (!isInitialized) return; // Wait for initialization

    try {
      if (tokenExpired) {
        dispatch(logoutFromReducer());
        navigate(ROUTES.LOGIN, undefined);
      }
      checkAuth(dispatch);
    } catch (error) {
      console.error('Error in auth check:', error);
    }
  }, [user, dispatch, tokenExpired, isInitialized]);
  useEffect(() => {
    // Initialize notification system in proper sequence
    const initializeNotifications = async () => {
      try {
        // Step 1: Configure push notifications for local notification handling
        configurePushNotification();

        // Step 2: Create notification channel (required for Android)
        createNotificationChannel();

        // Step 3: Request Android 13+ permissions if needed
        await requestAndroidNotificationPermission();

        // Step 4: Setup notification listeners (background/quit state handlers)
        // This is safe to call early as it has Firebase checks
        notificationListner();
      } catch (error) {
        console.error('Error initializing notification system:', error);
      }
    };

    initializeNotifications();
  }, []);

  // Setup FCM permissions and token after user authentication is initialized
  useEffect(() => {
    if (isInitialized) {
      // Add small delay to ensure all other initializations are complete
      const timer = setTimeout(async () => {
        try {
          await requestUserPermission();
        } catch (error) {
          console.error('Error setting up FCM permissions:', error);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  // Call functions when app transitions between background and foreground
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextState => {
        try {
          if (nextState === 'background') {
            await onAppClose(dispatch);
          } else if (nextState === 'active') {
            await onAppForeground(dispatch);
            if (posthog) {
              console.log('[PostHog] Capturing Application Opened from background');
              posthog.capture('Application Opened', {
                source: 'app_foreground',
                timestamp: new Date().toISOString(),
              });
              posthog.flush();
            }
          }
        } catch (error) {
          console.error('Error in AppState change handler:', error);
        }
      },
    );

    return () => {
      try {
        subscription.remove();
      } catch (error) {
        // no-op
      }
    };
  }, [dispatch, posthog]);
  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        const update = await VersionCheck.needUpdate({
          packageName: 'com.tribalshaadi',
        });

        if (update?.isNeeded) {
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to continue using the app.',
            [
              {
                text: 'Update Now',
                onPress: () => {
                  Linking.openURL(update.storeUrl);
                },
              },
            ],
            { cancelable: false }
          );
        }
      } catch (e) {
        console.log('Version check error:', e);
      }
    };

    checkAppVersion();
  }, []);


  if (showSplash || !isInitialized) {
    return <SplashScreen />;
  }

  // Safely determine initial route with fallback
  const getInitialRoute = () => {
    try {
      return userRegistrationCompleted === true
        ? ROUTES.MAIN_TABS
        : ROUTES.WELCOME;
    } catch (error) {
      console.error('Error determining initial route:', error);
      return ROUTES.WELCOME; // Safe fallback
    }
  };

  return (
    <>
      <ForegroundHandler />
      <NetworkAlert />
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={{ headerShown: false }}
      >
        {userRegistrationCompleted === true ? (
          <>
            <Stack.Screen
              name={ROUTES.MAIN_TABS}
              component={BottomNavigation}
            />
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
            <Stack.Screen
              name={ROUTES.TERMS_AND_CONDITIONS}
              component={TermScreen}
            />
            <Stack.Screen
              name={ROUTES.PRIVACY_POLICY}
              component={PrivacyScreen}
            />
            <Stack.Screen name={ROUTES.NAME} component={NameScreen} />
            <Stack.Screen
              name={ROUTES.BIRTH_DATE}
              component={BirthDateScreen}
            />
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
// Initialize once when JS bundle loads
initFacebook();

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider style={{ flex: 1 }}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor={COLORS.white}
              translucent={false}
            />
            <PostHogProvider
              apiKey="phc_hzf2ffl8p76r9RC3vhi50NK9CRXKOG4Z4gyrhJ5ngo"
              options={{
                host: 'https://us.i.posthog.com',
                enableSessionReplay: true,
                flushAt: 1,
                flushInterval: 0,
                sessionReplayConfig: {
                  maskAllTextInputs: true,
                  maskAllImages: false,
                  captureLog: true,
                  captureNetworkTelemetry: true,
                  androidDebouncerDelayMs: 1000,
                },
              }}
              autocapture={{
                captureTouches: true,
                captureScreens: true,
              }}
            >
              <NavigationContainer
                ref={navigationRef}
                onReady={() => {
                  setIsReady();
                }}
              >
                <ErrorBoundary>
                  <MainApp />
                </ErrorBoundary>
            </NavigationContainer>
            </PostHogProvider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </Provider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 200,
    height: 200,
  },
});
