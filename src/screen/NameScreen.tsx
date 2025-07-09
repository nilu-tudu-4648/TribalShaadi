import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import HeaderBack from '../components/HeaderBack';
import AppTextInput from '../components/AppTextInput';
import {
  fontSize14,
  lignHeight24,
  Size10,
  lignHeight72,
  Size40,
  Size20,
  fontSize24,
  fontSize16,
  Size12,
  borderWidth,
} from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import AppButton from '../components/AppButton';
import { completeUserProfileV2Name } from '../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import AppToast from '../components/AppToast';
import { getUserDetailsApi, updateUrl } from '../constants/functions';
import { getUserDetailsUrl } from '../constants/functions';
import AppText from '../components/AppText';

const NameScreen = () => {
  const [fullName, setFullName] = useState('');
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  console.log(user, 'user');

  // Function to validate and filter input to only allow letters and spaces
  const validateAndSetName = (text: string) => {
    // Remove any numbers and special characters, keep only letters and spaces
    const filteredText = text.replace(/[^a-zA-Z\s]/g, '');
    setFullName(filteredText);
  };

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
      };
      dispatch(completeUserProfileV2Name(updateUrl, requestBody));
      await new Promise(resolve => setTimeout(resolve, 2000));
      await getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <HeaderBack />
        <AppText text="Your name" textStyle={styles.title} />
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
        <AppButton
          title="Confirm"
          onPress={handleConfirm}
          isLoading={loader}
          isButtonDisabled={!fullName.trim() || loader}
          buttonStyle={[
            styles.button,
            !fullName.trim() || loader
              ? styles.buttonDisabled
              : styles.buttonEnabled,
          ]}
          textStyle={[
            styles.buttonText,
            !fullName.trim() || loader
              ? styles.buttonTextDisabled
              : styles.buttonTextEnabled,
          ]}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: lignHeight24,
    paddingVertical: lignHeight24,
    gap: Size20,
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
});

export default NameScreen;
