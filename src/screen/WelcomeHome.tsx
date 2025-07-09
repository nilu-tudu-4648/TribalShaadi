import { StyleSheet, View, Image, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import { COLORS } from '../constants/AppColors';
import {
  screenHeight,
  screenWidth,
  fontSize18,
  fontSize20,
  fontSize24,
  Size40,
  Size20,
  Size12,
  compPadding,
  fontSize36,
  lignHeight38,
  radius,
  Size16,
  lignHeight32,
} from '../constants/Sizes';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetailsApi, getUserDetailsUrl } from '../constants/functions';

const WelcomeHome = () => {
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const getUserDetails = async () => {
    try {
      setIsLoading(true);
      await getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <LinearGradient
      colors={[COLORS.white, '#F3EFFF', '#E9F0FF']}
      style={styles.gradientBg}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Optional: Logo/Icon */}
          {/* <Image source={require('../assets/images/logo.png')} style={styles.logo} /> */}

          {/* Title Section */}
          <View style={styles.titleContainer}>
            <AppText text="Welcome to" textStyle={styles.welcomeText} />
            <AppText text="Tribalshaadi.ai" textStyle={styles.appNameText} />
            <AppText
              text="Find your perfect match"
              textStyle={styles.taglineText}
            />
          </View>

          {/* Subtitle Section */}
          <View style={styles.subtitleContainer}>
            <AppText text="The app designed" textStyle={styles.subtitleText} />
            <View style={styles.deletedTextContainer}>
              <AppText text="to be " textStyle={styles.subtitleText} />
              <AppText text="Deleted!" textStyle={styles.deletedText} />
            </View>
          </View>

          {/* Welcome Image */}
          <View style={styles.imageCardShadow}>
            <View style={styles.imageWrapper}>
              <Image
                source={require('../assets/images/welcome.png')}
                style={styles.welcomeImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={[COLORS.violet, COLORS.primaryBlue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <AppButton
              isLoading={isLoading}
              title="Continue"
              onPress={getUserDetails}
              buttonStyle={styles.continueButton}
              textStyle={styles.continueButtonText}
            />
          </LinearGradient>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default WelcomeHome;

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: compPadding,
    gap: Size40,
  },
  titleContainer: {
    alignItems: 'center',
    gap: Size12,
  },
  welcomeText: {
    fontSize: fontSize20,
    fontWeight: '400',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  appNameText: {
    fontSize: fontSize36,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: lignHeight38,
    letterSpacing: 0.5,
  },
  taglineText: {
    fontSize: fontSize18,
    fontWeight: '600',
    color: COLORS.violet,
    letterSpacing: 0.2,
  },
  subtitleContainer: {
    alignItems: 'center',
    gap: Size12,
  },
  subtitleText: {
    fontSize: fontSize24,
    fontWeight: '400',
    color: COLORS.textPrimary,
    lineHeight: lignHeight32,
    textAlign: 'center',
  },
  deletedTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deletedText: {
    fontSize: fontSize20,
    fontWeight: '700',
    color: COLORS.violet,
    lineHeight: lignHeight32,
    textAlign: 'center',
  },
  imageCardShadow: {
    borderRadius: radius * 2,
    shadowColor: COLORS.primaryBlue,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
    backgroundColor: 'transparent',
  },
  imageWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: radius * 2,
    padding: Size20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeImage: {
    width: screenWidth('60%'),
    height: screenHeight('22%'),
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: compPadding,
    paddingBottom: screenHeight('5%'),
  },
  gradientButton: {
    borderRadius: 100,
    width: '100%',
    shadowColor: COLORS.violet,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  continueButton: {
    backgroundColor: 'transparent',
    paddingVertical: Size16,
    borderRadius: 100,
    width: '100%',
    elevation: 0,
    shadowColor: 'transparent',
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: fontSize20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
