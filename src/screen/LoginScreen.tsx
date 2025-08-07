import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import {
  fontSize14,
  fontSize16,
  fontSize24,
  lignHeight24,
  Size8,
  Size10,
  lignHeight72,
  Size22,
} from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { useSelector } from 'react-redux';
import AppToast from '../components/AppToast';
import { validateIndianPhoneNumber, verifyOTPForLogin } from '../constants/functions';
type RootStackParamList = {
  Login: undefined;
  OTP: { phoneNumber: string };
};

const LoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneValidation, setPhoneValidation] = useState({
    isValid: false,
    message: '',
  });
  const { loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const { register } = useRoute().params as { register?: boolean };
  // const phone = '9546230774';
  const url = register
    ? 'admin/users/sendLoginOTP'
    : 'admin/users/sendOTPForLogin';
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    const validation = validateIndianPhoneNumber(text);
    setPhoneValidation(validation);
  };

  const handleVerify = async () => {
    const validation = validateIndianPhoneNumber(phoneNumber);
    if (!validation.isValid) {
      AppToast(validation.message);
      return false;
    }

    try {
      const requestBody: any = {
        // contactNo: '+91' + phone,
        contactNo: '+91' + validation.cleanedNumber,
      };
      const response = await verifyOTPForLogin(url, requestBody);
      if (response) {
        navigation.navigate('OTP', {
          phoneNumber: validation.cleanedNumber || phoneNumber,
        });
      }
    } catch (error: any) {
      console.error(error?.response?.data || error.message);
      AppToast(error?.response?.data?.message || 'Failed to send OTP');
      return false;
    }
  };

  const isButtonDisabled = !phoneValidation.isValid;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <AppText text="Phone number" textStyle={styles.title} />
          <AppText
            text="Enter your mobile number"
            textStyle={styles.subtitle}
          />
        </View>

        {/* Phone Number Input */}
        <AppTextInput
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          placeholder="Phone number"
          placeholderTextColor={COLORS.placeholderText}
          keyboardType="phone-pad"
          autoComplete="tel"
          maxLength={10}
          autoFocus={true}
        />
        <AppButton
          isLoading={loader}
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
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: {
    flex: 1,
    paddingHorizontal: lignHeight24,
    paddingVertical: lignHeight24,
    gap: lignHeight24,
    paddingTop: lignHeight72,
  },
  headerSection: { gap: Size8 },
  title: {
    fontSize: fontSize24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  subtitle: { fontSize: fontSize16, color: COLORS.grey },
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
});
