import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import React, { useEffect, useCallback } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/AppColors';
import {
  fontSize28,
  fontSize24,
  fontSize18,
  fontSize16,
  Size16,
  Size20,
  Size25,
  Size40,
  screenWidth,
  screenHeight,
  Size50,
} from '../constants/Sizes';
import AppText from '../components/AppText';
import { CloseIcon } from '../components/svg/SvgIcons2';
import FONT_FAMILY from '../constants/Fonts';
import { ASYNC_VARIBLES, ROUTES } from '../constants/data';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentSuccess = () => {
  const navigation = useNavigation();
  // Helper to check isComingFromAccount async and navigate accordingly
  const handleClose = useCallback(async () => {
    try {
      const comingFromAccountValue = await AsyncStorage.getItem(
        ASYNC_VARIBLES.IS_COMING_FROM_ACCOUNT,
      );
      if (comingFromAccountValue === 'true') {
        (navigation as any).navigate(ROUTES.STACK, {
          screen: ROUTES.UPGRADE,
        });
      } else {
        (navigation as any).navigate(ROUTES.MAIN_TABS, {
          screen: ROUTES.INTEREST,
        });
      }
    } catch (error) {
      (navigation as any).navigate(ROUTES.MAIN_TABS, {
        screen: ROUTES.INTEREST,
      });
    } finally {
      try {
        await AsyncStorage.removeItem(ASYNC_VARIBLES.IS_COMING_FROM_ACCOUNT);
      } catch (error) {
        console.log(error, 'error');
      }
    }
  }, [navigation]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleClose();
        return true;
      },
    );
    return () => backHandler.remove();
  }, [handleClose]);

  return (
    <LinearGradient
      colors={[COLORS.violet, '#9B5DE5', '#7B68EE']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.8}
        >
          <CloseIcon width={24} height={24} color={COLORS.white} />
        </TouchableOpacity>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Success Image and Text */}
          <View style={styles.successSection}>
            <Image
              source={require('../assets/images/success.png')}
              style={styles.successImage}
              resizeMode="contain"
            />
          </View>

          {/* Main Content */}
          <View style={styles.textSection}>
            <AppText text="Congratulations" textStyle={styles.congratsText} />
            <AppText
              text="You are a premium user now!"
              textStyle={styles.subtitleText}
            />
            <AppText
              text="See 2X matches, send unlimited requests and unlock all your chats"
              textStyle={styles.descriptionText}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Size20,
  },
  closeButton: {
    position: 'absolute',
    top: Size40,
    right: Size20,
    width: Size40,
    height: Size40,
    borderRadius: Size20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Size40,
    paddingBottom: Size50 * 2,
  },
  successSection: {
    alignItems: 'center',
  },
  successImage: {
    width: screenWidth('60%'),
    height: screenHeight('25%'),
  },
  successText: {
    fontSize: fontSize28,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BLACK,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  textSection: {
    alignItems: 'center',
    paddingHorizontal: Size25,
    gap: Size16,
  },
  congratsText: {
    fontSize: fontSize24 * 1.5,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
  },
  subtitleText: {
    fontSize: fontSize18,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    opacity: 0.9,
  },
  descriptionText: {
    fontSize: fontSize16,
    fontWeight: '400',
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
    lineHeight: 24,
    opacity: 0.8,
  },
});
