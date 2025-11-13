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
} from '../constants/Sizes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppText from '../components/AppText';
import ErrorBoundary from '../components/ErrorBoundary';
import OnboardingButton from '../components/buttons/OnboardingButton';
import { ROUTES } from '../constants/data';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  OTP: { phoneNumber: string };
  TermsAndConditions: undefined;
  PrivacyPolicy: undefined;
};


const WelcomeScreen = () => {
  const [imageError, setImageError] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  React.useEffect(() => {
    // Initialize welcome screen and preload critical resources
    console.log('WelcomeScreen mounted successfully');
  }, []);


  const handleNavigation = (route: 'Login' | 'Register') => {
    try {
      navigation.navigate(route);
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
          <View style={styles.header}>
            <Image source={require('../assets/images/nlogo.png')} style={styles.logo} />
          </View>

          {/* Profile Circle Section */}
          {!imageError ? (
            <Image
              source={require('../assets/images/welcomeImage.png')}
              style={styles.profileSection}
              onError={handleImageError}
              defaultSource={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/59/AwYDAQEA' }}
            />
          ) : (
            <View style={[styles.profileSection, styles.imagePlaceholder]}>
              <AppText text="📱" textStyle={styles.placeholderEmoji} />
            </View>
          )}

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
    alignItems: 'center',
  },
  logo: {
    width: 139,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  profileSection: {
    width: screenWidth('90%'),
    height: screenHeight('50%'),
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
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
    fontSize: fontSize36,
    textAlign: 'left',
  },
  tribeText: {
    fontFamily: 'Brush Script MT',
    fontStyle: 'italic',
    fontWeight: '700',
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
