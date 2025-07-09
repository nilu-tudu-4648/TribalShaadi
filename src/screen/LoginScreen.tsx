import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import {
  fontSize14,
  fontSize16,
  fontSize24,
  lignHeight24,
  Size8,
  Size10,
  lignHeight72,
} from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import { sendOTP } from '../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
    import { debounce } from 'lodash';
import AppToast from '../components/AppToast';
type RootStackParamList = {
  Login: undefined;
  OTP: { phoneNumber: string };
};

const LoginScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { loader, otpSent } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
      let mounted = true;
      if (otpSent && mounted) {
        navigation.navigate('OTP', { phoneNumber });
      }
      return () => { mounted = false; };
    }, [otpSent, navigation, phoneNumber]);
    const handlePhoneNumberChange = debounce((text: string) => {
      const numericOnly = text.replace(/[^0-9]/g, '');
      setPhoneNumber(numericOnly);
    }, 300);
    


  const handleVerify = async () => {
    if (!phoneNumber.trim()) {
      AppToast('Please enter a phone number');
      return false;
    }

    try {
      const requestBody: any = {
        contactNo: phoneNumber.trim(),
      };
      dispatch(sendOTP('admin/users/sendLoginOTP', requestBody));
    } catch (error: any) {
      console.error(error?.response?.data || error.message);
      AppToast(error?.response?.data?.message || 'Failed to send OTP');
      return false;
    }
  };

  const isButtonDisabled = !phoneNumber.trim() || phoneNumber.length !== 10;

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} /> */}

      <View style={styles.content}>
        {/* Header */}
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

        {/* Referral Code Input (Optional) */}
        {/* <AppTextInput
            value={referralCode}
            onChangeText={setReferralCode}
            placeholder="Referral code (optional)"
            placeholderTextColor={COLORS.placeholder}
            keyboardType="numeric"
          /> */}

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
