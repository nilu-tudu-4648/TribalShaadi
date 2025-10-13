import React, { useEffect, useMemo, useState } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import HeaderBack from '../components/HeaderBack';
import AppTextInput from '../components/AppTextInput';
import {
  fontSize14,
  lignHeight24,
  Size10,
  lignHeight72,
  Size40,
  fontSize24,
  fontSize16,
  Size12,
  borderWidth,
  Size18,
  screenHeight,
} from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import AppButton from '../components/AppButton';
import { completeUserProfileV2Updated } from '../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import AppToast from '../components/AppToast';
import {
  getUserDetailsApi,
  navigateToLastScreen,
  setReducerLoadingfalse,
  updateUrl,
} from '../constants/functions';
import { getUserDetailsUrl } from '../constants/functions';
import AppText from '../components/AppText';
import { ROUTES } from '../constants/data';
import { useNavigation } from '@react-navigation/native';

const NameScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );

  // Function to validate and filter input to only allow letters and spaces
  const validateAndSetName = (text: string) => {
    // Remove any numbers and special characters, keep only letters and spaces
    const filteredText = text.replace(/[^a-zA-Z\s]/g, '');
    setFullName(filteredText);
  };
  const [isValidEmail, setIsValidEmail] = useState(false);

  // Email validation regex
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  useEffect(() => {
    // Validate email on change
    if (email.trim() === '') {
      setIsValidEmail(false);
    } else {
      setIsValidEmail(emailRegex.test(email));
    }
  }, [email, emailRegex]);
  // Function to check if name contains only letters and spaces
  const isValidName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  };

  const handleConfirm = async () => {
    try {
      if (!fullName.trim()) {
        AppToast('Please enter your full name');
        return;
      }

      // Validate that name contains only letters and spaces
      if (!isValidName(fullName.trim())) {
        AppToast('Name should contain only letters and spaces');
        return;
      }

      // Validate email
      if (!email.trim()) {
        AppToast('Please enter your email address');
        return;
      }

      if (!isValidEmail) {
        AppToast('Please enter a valid email address');
        return;
      }

      // Split full name into firstName and lastName
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      if (!firstName) {
        AppToast('Please enter at least a first name');
        return;
      }

      const requestBody = {
        id: user.id,
        firstName: firstName,
        lastName: lastName,
        email: email.trim(),
      };
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
      console.log(error);
    } finally {
      navigateToLastScreen(navigation, ROUTES.BIRTH_DATE);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <HeaderBack
            onPress={() => navigateToLastScreen(navigation, ROUTES.GENDER)}
          />
          <AppText text="Name & Email" textStyle={styles.title} />
          {/* Text Input */}
          <AppTextInput
            placeholder="Full Name"
            placeholderTextColor={COLORS.placeholderText}
            value={fullName}
            onChangeText={validateAndSetName}
            keyboardType="default"
            textInputStyle={styles.textInput}
            style={styles.inputContainer}
          />
          <AppTextInput
            placeholder="Email"
            placeholderTextColor={COLORS.placeholderText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            textInputStyle={styles.textInput}
            style={styles.inputContainer}
          />
          {!isValidEmail && email.trim() !== '' && (
            <AppText
              text="Please enter a valid email address"
              textStyle={styles.errorText}
            />
          )}
          <AppButton
            title="Confirm"
            onPress={handleConfirm}
            isLoading={loader}
            isButtonDisabled={!isValidEmail || loader}
            buttonStyle={[
              styles.button,
              !isValidEmail || loader
                ? styles.buttonDisabled
                : styles.buttonEnabled,
            ]}
            textStyle={[
              styles.buttonText,
              !isValidEmail || loader
                ? styles.buttonTextDisabled
                : styles.buttonTextEnabled,
            ]}
          />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: screenHeight(2),
  },
  content: {
    flex: 1,
    paddingHorizontal: lignHeight24,
    paddingVertical: lignHeight24,
    gap: Size18,
    paddingTop: lignHeight72,
  },
  backButton: {
    width: Size40,
    height: Size40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: fontSize24,
    color: COLORS.black,
    fontWeight: '400',
  },
  title: {
    fontSize: fontSize24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  inputContainer: {},
  textInput: {
    fontSize: fontSize16,
    color: COLORS.textBlack,
    paddingVertical: Size12,
    paddingHorizontal: 0,
    borderBottomWidth: borderWidth,
    borderBottomColor: COLORS.borderBottom,
    backgroundColor: 'transparent',
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
  errorText: {
    color: COLORS.red,
    fontSize: fontSize14,
  },
});

export default NameScreen;
