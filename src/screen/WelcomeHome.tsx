import { StyleSheet, View, Image, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import AppButton from '../components/AppButton';
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
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserDetailsApi,
  getUserDetailsUrl,
  savedLastScreenName,
} from '../constants/functions';
import { setUserRegistrationCompleted } from '../store/reducers/userReducer';
import { ROUTES } from '../constants/data';
import { globalStyles } from '../constants/globalStyles';

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
      dispatch(setUserRegistrationCompleted(true));
      savedLastScreenName(ROUTES.MAIN_TABS);
    }
  };
  return (
      <SafeAreaView style={globalStyles.container}>
        <View style={styles.content}>
          <Image
            source={require('../assets/images/welcome2.png')}
            style={styles.welcomeImage}
            resizeMode="contain"
          />

          <AppButton
            isLoading={isLoading}
            title="Continue"
            onPress={getUserDetails}
            buttonStyle={globalStyles.continueButton}
            textStyle={styles.continueButtonText}
          />
        </View>
      </SafeAreaView>
  );
};

export default WelcomeHome;

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
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
    width: screenWidth('100%'),
    height: screenHeight('80%'),
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
    paddingVertical: Size16,
    borderRadius: 100,
    width: '100%',
  },
  continueButtonText: {
    color: COLORS.violet,
    fontSize: fontSize20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
