import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React from 'react';
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
import { ROUTES } from '../constants/data';
import SwipeButton from '../components/SwipeButton';

type RootStackParamList = {
  Login: undefined;
  OTP: { phoneNumber: string };
};

type SwipeButtonHandle = {
  reset: () => void;
};

const WelcomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const swipeButtonRef = React.useRef<SwipeButtonHandle>(null);
  useFocusEffect(
    React.useCallback(() => {
      if (swipeButtonRef.current) {
        swipeButtonRef.current.reset();
      }
    }, []),
  );

  return (
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
        <Image
          source={require('../assets/images/SplashImage.png')}
          style={styles.profileSection}
        />

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <View style={styles.brandContainer}>
            {/* Logo placeholder - you can replace this with your actual logo */}
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logoPlaceholder}
            />
            <AppText text="Tribalshaadi.ai" textStyle={styles.brandText} />
          </View>
          <View>
            <AppText text="AI - powered" textStyle={styles.aiText} />
            <AppText text="Tribal Matchmaking" textStyle={styles.titleText} />
          </View>
          <View style={{ gap: Size12 }}>
            <View style={{ alignItems: 'center' }}>
              <SwipeButton
                ref={swipeButtonRef}
                onToggle={() => navigation.navigate(ROUTES.LOGIN as never)}
              />
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.LOGIN as never)}
            >
              <AppText
                text="Already have an account? Log in"
                textStyle={styles.loginText}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
});

export default WelcomeScreen;
