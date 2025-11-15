import React, { useCallback, useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  Keyboard,
} from 'react-native';
import {
  fontSize14,
  lignHeight24,
  Size10,
  Size22,
  Size20,
  fontSize16,
} from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
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

const RegisterScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [phoneValidation, setPhoneValidation] = useState({
    isValid: false,
    message: '',
  });
  const url = 'admin/users/sendLoginOTP';
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    const validation = validateIndianPhoneNumber(text);
    setPhoneValidation(validation);
    if (alreadyExists) {
      setAlreadyExists(false);
    }
  };

  const handleVerify = async () => {
    const validation = validateIndianPhoneNumber(phoneNumber);
    if (!validation.isValid) {
      // AppToast(validation.message);
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
      return false;
    }
  };

  const handleNavigateToLogin = useCallback(() => {
    Keyboard.dismiss();
    setAlreadyExists(false);
    navigation.replace('Login');
  }, [navigation]);

  const isButtonDisabled = !phoneValidation.isValid;

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.content}>
        <AppText text="What’s your phone number?" textStyle={globalStyles.title} />
        <AppText text="A special experience might just be ‘calling‘ !" textStyle={globalStyles.subtitle} />

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
            autoFocus={true}
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
        {/* Spacer */}
        <View style={styles.spacer} />
        {alreadyExists && (
          <View style={styles.alreadyExistsContainer}>
            <Image
              source={require('../assets/images/crossred.png')}
              style={styles.crossIcon}
            />
            <AppText text="Phone number already exists." />
            <AppButton
              title="Log In"
              loaderSize={Size22}
              onPress={handleNavigateToLogin}
              isButtonDisabled={isButtonDisabled}
              buttonStyle={[
                styles.button,
                { width: '25%', backgroundColor: '#FFDCE4' },
              ]}
              textStyle={[
                styles.buttonText,
                { color: '#FF507A', fontSize: fontSize14 },
              ]}
            />
          </View>
        )}

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

export default RegisterScreen;

const styles = StyleSheet.create({
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
  },
  crossIcon: {
    width: Size20 * 1.5,
    height: Size20 * 1.5,
  },
  phoneIcon: {
    width: Size20*1.5,
    height: Size20*1.5,
  },
  phoneCode: {
    fontSize: fontSize16,
    color: COLORS.greyText,
    fontWeight: '500',
  },
});
