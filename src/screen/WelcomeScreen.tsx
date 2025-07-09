import { useNavigation } from '@react-navigation/native';
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
  Size25,
  Size4,
  Size40,
  Size8,
  fontSize16,
  fontSize18,
  fontSize24,
  lignHeight24,
  lignHeight56,
  screenHeight,
  screenWidth,
  lignHeight28,
  lignHeight32,
  Size48,
  lignHeight47,
  Size10,
  Size20,
  fontSize36,
} from '../constants/Sizes';
import { PhoneSvg } from '../components/svg/SvgIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppText from '../components/AppText';
import { ROUTES } from '../constants/data';

type RootStackParamList = {
  Login: undefined;
  OTP: { phoneNumber: string };
};


const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <AppText text="Made with ❤️ in Jharkhand" textStyle={styles.headerText} />
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
            <AppText text="AI - Powered" textStyle={styles.aiText} />
            <AppText text="Tribal Matchmaking" textStyle={styles.titleText} />
          </View>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate(ROUTES.LOGIN as never)}
          >
            <PhoneSvg />
            <AppText text="Register with phone" textStyle={styles.buttonText} />
            <View style={{ width: Size20 * 2 }} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.LOGIN as never)}
          >
            <AppText text="Already have an account? Log in" textStyle={styles.loginText} />
          </TouchableOpacity>
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
  avatar: {
    position: 'absolute',
  },
  avatar1: {
    top: Size48,
    left: lignHeight32,
  },
  avatar2: {
    top: Size16,
    right: Size40,
  },
  avatar3: {
    bottom: Size40,
    right: lignHeight56,
  },
  avatar4: {
    bottom: lignHeight24,
    left: Size40,
  },
  avatarImage: {
    width: lignHeight56,
    height: lignHeight56,
    borderRadius: lignHeight28,
  },
  ctaSection: {
    backgroundColor: COLORS.violet,
    borderTopLeftRadius: lignHeight47,
    borderTopRightRadius: lignHeight47,
    padding: lignHeight24,
    paddingVertical: lignHeight47,
    gap: Size20,
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
  },
  titleText: {
    color: COLORS.black,
    fontSize: fontSize36,
    fontWeight: '400',
  },
  ctaButton: {
    backgroundColor: COLORS.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Size8,
    borderRadius: Size25,
    gap: lignHeight24,
    paddingLeft: Size10,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '400',
    alignSelf: 'center',
    fontSize: fontSize16,
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
