import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/AppColors';
import {
  Size16,
  Size4,
  Size40,
  Size8,
  fontSize18,
  fontSize24,
  lignHeight24,
  screenHeight,
  screenWidth,
  fontSize36,
  Size12,
  lignHeight20,
} from '../constants/Sizes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppText from '../components/AppText';
import SwipeButton from '../components/SwipeButton';
import ErrorBoundary from '../components/ErrorBoundary';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  OTP: { phoneNumber: string };
};

type SwipeButtonHandle = {
  reset: () => void;
};

const WelcomeScreen = () => {
  const [imageError, setImageError] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const swipeButtonRef = React.useRef<SwipeButtonHandle>(null);

  React.useEffect(() => {
    // Initialize welcome screen and preload critical resources
    console.log('WelcomeScreen mounted successfully');
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      try {
        if (swipeButtonRef.current) {
          swipeButtonRef.current.reset();
        }
      } catch (error) {
        console.error('Error resetting swipe button:', error);
      }
    }, []),
  );

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
            <AppText
              text="Made with ❤️ in Jharkhand"
              textStyle={styles.headerText}
            />
          </View>

          {/* Profile Circle Section */}
          {!imageError ? (
            <Image
              source={require('../assets/images/SplashImage.png')}
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
            <View style={styles.brandContainer}>
              {/* Logo with fallback */}
              {!imageError ? (
                <Image
                  source={require('../assets/images/logo.png')}
                  style={styles.logoPlaceholder}
                  onError={handleImageError}
                />
              ) : (
                <View style={[styles.logoPlaceholder, styles.logoFallback]} />
              )}
              <AppText text="Tribalshaadi.ai" textStyle={styles.brandText} />
            </View>
            <View>
              <AppText text="AI - powered" textStyle={styles.aiText} />
              <AppText text="Tribal Matchmaking" textStyle={styles.titleText} />
            </View>
            <View style={styles.actionContainer}>
              <View style={styles.swipeButtonContainer}>
                <ErrorBoundary
                  fallback={
                    <TouchableOpacity 
                      style={styles.fallbackButton}
                      onPress={() => handleNavigation('Register')}
                    >
                      <AppText 
                        text="Register with phone" 
                        textStyle={styles.fallbackButtonText} 
                      />
                    </TouchableOpacity>
                  }
                >
                  <SwipeButton
                    ref={swipeButtonRef}
                    onToggle={() => handleNavigation('Register')}
                  />
                </ErrorBoundary>
              </View>
              <TouchableOpacity onPress={() => handleNavigation('Login')}>
                <AppText
                  text="Already have an account? Log in"
                  textStyle={styles.loginText}
                />
              </TouchableOpacity>
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
  headerText: {
    color: COLORS.black,
    fontSize: fontSize18,
    fontWeight: '600',
  },
  heartText: {
    color: COLORS.redHeart,
  },
  profileSection: {
    width: screenWidth('90%'),
    height: screenHeight('50%'),
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  mainCircle: {
    width: screenWidth('75%'),
    height: screenWidth('75%'),
    borderRadius: screenWidth('37.5%'),
    backgroundColor: COLORS.lightYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainProfile: {
    width: screenWidth('20%'),
    height: screenWidth('20%'),
    borderRadius: screenWidth('10%'),
  },
  ctaSection: {
    backgroundColor: COLORS.welcomeBottom,
    padding: lignHeight24,
    paddingVertical: lignHeight20,
    gap: Size40,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Size8,
  },
  logoPlaceholder: {
    width: lignHeight24,
    height: lignHeight24,
    backgroundColor: COLORS.white,
    borderRadius: Size4,
  },
  brandText: {
    color: COLORS.black,
    fontSize: fontSize18,
    fontWeight: '600',
  },
  aiText: {
    color: COLORS.white,
    fontSize: fontSize24,
    backgroundColor: COLORS.black,
    width: screenWidth('40%'),
    textAlign: 'center',
    borderRadius: Size8,
  },
  titleText: {
    color: COLORS.black,
    fontSize: fontSize36,
    fontWeight: '400',
  },
  loginText: {
    textAlign: 'center',
    color: COLORS.black,
  },
  loginLink: {
    textDecorationLine: 'underline',
  },
  // Fallback styles for error states
  imagePlaceholder: {
    backgroundColor: COLORS.lightgrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: fontSize36 * 2,
    textAlign: 'center',
  },
  logoFallback: {
    backgroundColor: COLORS.violet,
  },
  fallbackButton: {
    backgroundColor: COLORS.black,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: screenWidth('85%'),
    alignItems: 'center',
  },
  fallbackButtonText: {
    color: COLORS.white,
    fontSize: fontSize18,
    fontWeight: '600',
  },
  actionContainer: {
    gap: Size12,
  },
  swipeButtonContainer: {
    alignItems: 'center',
  },
});

export default WelcomeScreen;
