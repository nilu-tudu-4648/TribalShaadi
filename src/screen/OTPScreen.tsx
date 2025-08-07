import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppText from '../components/AppText';
import { COLORS } from '../constants/AppColors';
import {
  lignHeight24,
  lignHeight72,
  SIZES,
  fontSize14,
  Size10,
  fontSize24,
} from '../constants/Sizes';
import { RootStackParamList } from '../../App';
import HeaderBack from '../components/HeaderBack';
import { sendOTP } from '../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP } from '../constants/functions';

const OTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const route = useRoute<RouteProp<RootStackParamList, 'OTP'>>();
  const { phoneNumber } = (route.params as { phoneNumber: string | number }) || {};
  const { loader } = useSelector((state: any) => state.entities.authReducer);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);


  const handleInputChange = (text: string, index: number) => {
    setError(null);
    const newOtp = [...otp];
    
    // Handle single digit input
    if (text.length <= 1) {
      newOtp[index] = text;
      setOtp(newOtp);
      
      // Auto-focus next field if text is entered
      if (text && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      setError(null);
      const newOtp = [...otp];
      
      if (otp[index]) {
        // Clear current field if it has content
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous field and clear it if current field is empty
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const clearOTP = () => {
    setOtp(['', '', '', '']);
    setError(null);
    inputRefs.current[0]?.focus();
  };

  const handleVerifyOTP = useCallback(async (otpString: string) => {
    if (otpString.length < 4) {
      setError('Incorrect OTP, please enter the valid OTP you received');
      return;
    }
    verifyOTP(
      'admin/users/loginWithOTP',
      { otp: otpString },
      dispatch,
      navigation,
      setError,
    );
  }, [dispatch, navigation]);

  useEffect(() => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 4) {
      handleVerifyOTP(enteredOtp);
    }
  }, [otp, handleVerifyOTP]);

  const handleResend = () => {
    try {
      setTimer(30);
      clearOTP();
      dispatch(sendOTP('admin/users/sendLoginOTP', { contactNo: phoneNumber }));
    } catch (error) {
      console.log(error, 'error');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <HeaderBack />
        <AppText text="OTP" textStyle={styles.title} />
        <AppText
          text={`4 digit code sent to +91 ${phoneNumber}`}
          textStyle={styles.subtitle}
        />

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              value={digit}  
              autoFocus={index === 0}      
              onChangeText={text => handleInputChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={1}
              style={{
                ...styles.otpInput,
                borderColor: error ? COLORS.red : COLORS.borderColor,
                borderWidth: error ? 1 : 0.5,
              }}
              ref={ref => {
                inputRefs.current[index] = ref;
              }}
            />
          ))}
        </View>

        <TouchableOpacity onPress={handleResend} disabled={timer > 0 || loader}>
          <AppText
            text={
              timer > 0
                ? `Resend in 00:${timer.toString().padStart(2, '0')}`
                : 'Resend'
            }
            textStyle={[
              styles.resendText,
              { color: timer > 0 ? COLORS.grey : COLORS.violet },
            ]}
          />
        </TouchableOpacity>

        {error && <AppText text={error} textStyle={styles.errorText} />}
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: lignHeight24,
    paddingVertical: lignHeight24,
    gap: lignHeight24,
    paddingTop: lignHeight72,
  },
  title: {
    fontSize: fontSize24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  subtitle: { fontSize: fontSize14, color: COLORS.grey },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Size10,
    width: '70%',
  },
  otpInput: {
    width: SIZES.h1 * 1.5,
    height: SIZES.h1 * 1.5,
    borderWidth: 1,
    borderRadius: (SIZES.h1 * 1.5) / 2,
    textAlign: 'center',
    fontSize: SIZES.h3,
    color: COLORS.textPrimary,
  },
  resendText: {
    fontWeight: '600',
    fontSize: SIZES.font,
  },
  errorText: {
    color: COLORS.red,
    fontSize: SIZES.font,
  },
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
});
