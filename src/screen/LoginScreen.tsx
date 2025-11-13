import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  fontSize14,
  lignHeight24,
  Size8,
  Size10,
  lignHeight72,
  Size22,
  Size20,
  fontSize36,
  fontSize20,
  fontSize16,
} from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import AppToast from '../components/AppToast';
import {
  sendOTPForLogin,
  validateIndianPhoneNumber,
} from '../constants/functions';
import { globalStyles } from '../constants/globalStyles';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  OTP: { phoneNumber: string };
};

const LoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const url = 'admin/users/sendOTPForLogin';
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Memoize phone validation to avoid recalculating on every render
  const phoneValidation = useMemo(() => {
    return validateIndianPhoneNumber(phoneNumber);
  }, [phoneNumber]);

  const handlePhoneNumberChange = useCallback((text: string) => {
    setPhoneNumber(text);
  }, []);

  const handleVerify = useCallback(async () => {
    const validation = validateIndianPhoneNumber(phoneNumber);
    if (!validation.isValid) {
      AppToast(validation.message);
      return false;
    }

    try {
      setLoading(true);
      const requestBody: any = {
        contactNo: '+91' + validation.cleanedNumber,
      };
      console.log('requestBody', requestBody);
      const response = await sendOTPForLogin(url, requestBody, setLoading);
      console.log('response', response);
      if (response) {
        navigation.navigate('OTP', {
          phoneNumber: validation.cleanedNumber || phoneNumber,
        });
      } else {
        setAlreadyExists(true);
      }
    } catch (error: any) {
      console.error(error?.response?.data || error.message);
      AppToast(error?.response?.data?.message || 'Failed to send OTP');
      return false;
    }
  }, [phoneNumber, navigation, url]);

  const isButtonDisabled = !phoneValidation.isValid;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.headerSection}>
              <AppText text="Phone number" textStyle={styles.title} />
              <AppText text="Enter Mobile Number" textStyle={styles.subtitle} />
            </View>
            <View style={globalStyles.inputContainer}>
              <Image
                source={require('../assets/images/india.png')}
                style={styles.phoneIcon}
              />
              <AppText text="+91" textStyle={styles.phoneCode} />

              {/* Phone Number Input */}
              <TextInput
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                placeholder="Phone number"
                keyboardType="phone-pad"
                autoComplete="tel"
                maxLength={10}
                style={globalStyles.inputStyl}
              />
            </View>
            <AppButton
              isLoading={loading}
              title="Verify"
              loaderSize={Size22}
              onPress={handleVerify}
              isButtonDisabled={isButtonDisabled}
              buttonStyle={[
                styles.button,
                isButtonDisabled ? styles.buttonDisabled : styles.buttonEnabled,
              ]}
              textStyle={[
                styles.buttonText,
                isButtonDisabled
                  ? styles.buttonTextDisabled
                  : styles.buttonTextEnabled,
              ]}
            />

            {/* Error Message - Now positioned before spacer */}
            {alreadyExists && (
              <View style={styles.alreadyExistsContainer}>
                <Image
                  source={require('../assets/images/crossred.png')}
                  style={styles.crossIcon}
                />
                <AppText
                  text="User not found. Please register first."
                  textStyle={styles.alreadyExistsText}
                />
                <AppButton
                  title="Register"
                  loaderSize={Size22}
                  onPress={() => navigation.navigate('Register')}
                  isButtonDisabled={false}
                  buttonStyle={[styles.button, styles.registerButton]}
                  textStyle={[styles.buttonText, styles.registerButtonText]}
                />
              </View>
            )}

            {/* Spacer */}
            <View style={styles.spacer} />

            {/* Info */}
            <View style={styles.infoContainer}>
              <AppText
                text="We'll send you a verification code via SMS"
                textStyle={styles.infoText}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: {
    flex: 1,
    paddingHorizontal: lignHeight24,
    paddingVertical: lignHeight24,
    gap: lignHeight24,
    paddingTop: lignHeight72,
  },
  headerSection: { gap: Size8 },
  title: {
    fontSize: fontSize36,
    fontWeight: '500',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: fontSize20,
    color: COLORS.greyText2,
    fontWeight: '400',
  },
  spacer: { flex: 1 },
  button: {
    borderRadius: lignHeight24,
    paddingVertical: Size10,
    width: '30%',
    alignSelf: 'flex-end',
  },
  buttonEnabled: { backgroundColor: COLORS.black },
  buttonDisabled: { backgroundColor: COLORS.disabledBG },
  buttonContent: { alignItems: 'center' },
  buttonText: { fontSize: fontSize14, fontWeight: '600' },
  buttonTextEnabled: { color: COLORS.white },
  buttonTextDisabled: { color: COLORS.disabledText },
  infoContainer: { alignItems: 'center' },
  infoText: {
    fontSize: fontSize14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  alreadyExistsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: lignHeight24,
  },
  alreadyExistsText: {
    fontSize: fontSize14,
    textAlign: 'center',
  },

  phoneIcon: {
    width: Size20 * 1.5,
    height: Size20 * 1.5,
  },
  phoneCode: {
    fontSize: fontSize16,
    color: COLORS.greyText,
    fontWeight: '500',
  },
  crossIcon: {
    width: Size20 * 1.5,
    height: Size20 * 1.5,
  },
  registerButton: {
    width: '25%',
    backgroundColor: '#FFDCE4',
  },
  registerButtonText: {
    color: '#FF507A',
    fontSize: fontSize14,
  },
});
