import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Video from 'react-native-video';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/AppColors';
import {
  Size16,
  Size8,
  Size12,
  fontSize36,
  lignHeight20,
  lignHeight24,
  screenHeight,
  screenWidth,
  fontSize20,
  fontSize14,
  Size4,
  fontSize24,
  Size20,
  fontSize26,
} from '../constants/Sizes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppText from '../components/AppText';
import ErrorBoundary from '../components/ErrorBoundary';
import OnboardingButton from '../components/buttons/OnboardingButton';
import { ROUTES } from '../constants/data';
import NLogoComponent from '../components/NLogoComponent';
import { usePostHog } from 'posthog-react-native';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  OTP: { phoneNumber: string };
  TermsAndConditions: undefined;
  PrivacyPolicy: undefined;
};


const WelcomeScreen = () => {
  const [imageError, setImageError] = useState(false);

  const posthog = usePostHog();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  React.useEffect(() => {
    // Initialize welcome screen and preload critical resources
    console.log('WelcomeScreen mounted successfully');
  }, []);


  const handleNavigation = (route: 'Login' | 'Register') => {
    try {
      navigation.navigate(route);
      posthog.capture(route==='Login'?'Login_button_tapped':'registration_started')
    } catch (error) {
      console.error(`Error navigating to ${route}:`, error);
    }
  };

  const handleImageError = () => {
    console.warn('Error loading welcome screen images');
    setImageError(true);
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          {/* <View style={styles.header}>
            <NLogoComponent width={260} height={30} />
          </View> */}

          {/* Profile Circle Section */}
          <Video
            source={require('../assets/video/matrimony-app.mp4')}
            style={styles.profileSection}
            resizeMode="contain"
            repeat={true}
            muted={true}
            paused={false}
            playInBackground={false}
            playWhenInactive={false}
          />

            <AppText textStyle={styles.titleText} text="Tribal Matchmaking made, safe, with AI "/>
          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <OnboardingButton 
              title="Create a free account" 
              onPress={() => handleNavigation('Register')} 
              isFormValid={true} 
              loader={false} 
            />
            
            <View style={styles.loginContainer}>
              <AppText textStyle={styles.orText} text="Or "/>
              <TouchableOpacity onPress={() => handleNavigation('Login')}>
                <AppText textStyle={styles.loginLink} text="Log in"/>
              </TouchableOpacity>
            </View>

            <View style={styles.termsContainer}>
              <AppText textStyle={styles.termsText} text="By continuing, you agree to our"/>
              <View style={{flexDirection:'row',gap:Size4,alignItems:'center',justifyContent:'center'}}>
                <Pressable onPress={() => navigation.navigate(ROUTES.TERMS_AND_CONDITIONS as 'TermsAndConditions')}>

              <AppText textStyle={[styles.termsText,{borderBottomWidth:1,borderBottomColor:COLORS.greyText}]} text="Terms & Conditions"/>
                </Pressable>
                <AppText textStyle={styles.termsText} text="and"/>
                <Pressable onPress={() => navigation.navigate(ROUTES.PRIVACY_POLICY as 'PrivacyPolicy')}>
                  <AppText textStyle={[styles.termsText,{borderBottomWidth:1,borderBottomColor:COLORS.greyText}]} text="Privacy Policy"/>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingTop: Size16,
  },
  header: {
    paddingTop: Size16*2,
    alignItems: 'center',
  },
  logo: {
    width: 139,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  profileSection: {
    width: screenWidth('100%'),
    height: screenHeight('60%'),
    alignSelf: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    backgroundColor: COLORS.lightgrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: fontSize36 * 2,
    textAlign: 'center',
  },
  titleSection: {
    paddingHorizontal: lignHeight24,
    paddingBottom: Size16,
  },
  titleText: {
    color: COLORS.black,
    fontSize: fontSize26,
    textAlign: 'center',
    fontFamily:"product-sans-medium",
    fontWeight: '800',
    marginHorizontal: Size20,
  },
  ctaSection: {
    backgroundColor: COLORS.white,
    padding: lignHeight24,
    paddingVertical: lignHeight20,
    gap: Size12,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orText: {
    color: COLORS.black,
    fontSize: fontSize20,
  },
  loginLink: {
    color: COLORS.violet,
    fontSize: fontSize20,
  },
  termsContainer: {
    paddingTop: Size8,
  },
  termsText: {
    textAlign: 'center',
    color: COLORS.greyText,
    fontSize: fontSize14,
  },
});

export default WelcomeScreen;
