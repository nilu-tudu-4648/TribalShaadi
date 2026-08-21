import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import {
  fontSize16,
  fontSize24,
  Size8,
  fontSize14,
  Size12,
  Size4,
  SIZES,
} from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import HeaderBack from '../components/HeaderBack';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import AppToast from '../components/AppToast';
import { useDispatch, useSelector } from 'react-redux';
import { completeUserProfileV2Updated } from '../store/reducers/authReducer';
import {
  getUserDetailsApi,
  getUserDetailsUrl,
  navigateToLastScreen,
  setReducerLoadingfalse,
  updateUrl,
} from '../constants/functions';
import { ROUTES } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../constants/globalStyles';
import { usePostHog } from 'posthog-react-native';

const AboutScreen = () => {
  const [aboutText, setAboutText] = useState('');

  const { user, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const posthog = usePostHog();
  const MAX_WORDS = 35;
  // Count words in the text
  const getWordCount = (text: string) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };

  const wordCount = getWordCount(aboutText);

  const handleContinue = async () => {
    if (!aboutText.trim()) {
      AppToast('Please write something about yourself');
      return false;
    }

    if (wordCount > MAX_WORDS) {
      AppToast(`Please keep your description within ${MAX_WORDS} words`);
      return false;
    }
    try {
      posthog.capture('bio_submitted')
      const requestBody = {
        aboutMe: aboutText,
      };

      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
      console.log(error);
    } finally {
      navigateToLastScreen(navigation, ROUTES.ABOUT_PARTNER);
    }
  };

  const isFormValid = aboutText.trim().length > 0 && wordCount <= MAX_WORDS;

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        style={globalStyles.scrollView}
        contentContainerStyle={globalStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={globalStyles.content}>
          <HeaderBack onPress={() => navigateToLastScreen(navigation, ROUTES.PHYSICAL_ATTRIBUTES)} progress={0.7} />
          <View style={globalStyles.headerSection}>
            <AppText text="What makes you a 11/10?" textStyle={globalStyles.title} />
            <AppText text="Share a few lines about yourself — honest, simple, and real" textStyle={globalStyles.subtitle} />
          </View>
          {/* Text Input Area */}
          <View style={styles.textInputContainer}>
            <AppTextInput
              label={false}
              placeholder="Write something"
              placeholderTextColor={COLORS.black}
              value={aboutText}
              onChangeText={setAboutText}
              keyboardType="default"
              style={styles.textInputWrapper}
              textInputStyle={styles.textInput}
              multiline={true}
              textAlignVertical="top"
            />
          </View>


          <View style={styles.counterContainer}>
            <AppText
              text={`${wordCount}/${MAX_WORDS} words`}
              textStyle={[
                styles.counterText,
                wordCount > MAX_WORDS && styles.counterTextError,
              ]}
            />
          </View>
          {/* Spacer */}
          <View style={styles.spacer} />
          {/* Word Counter */}

          {/* Continue Button */}
          <AppButton
            title="Continue"
            onPress={handleContinue}
            isLoading={loader}
            isButtonDisabled={!isFormValid || loader}
            buttonStyle={[
              globalStyles.continueButton,
              isFormValid
                ? globalStyles.continueButtonActive
                : globalStyles.continueButtonInactive,
            ]}
            textStyle={[
              globalStyles.continueButtonText,
              isFormValid
                ? globalStyles.continueButtonTextActive
                : globalStyles.continueButtonTextInactive,
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize24,
    color: COLORS.textBlack,
    fontWeight: '600',
  },
  textInputContainer: {
    minHeight: SIZES.height * 0.2,
    maxHeight: SIZES.height * 0.4,
    gap: Size8,
    backgroundColor: COLORS.cardBg,
  },
  textInputWrapper: {
    // Container wrapper style for AppTextInput
  },
  textInput: {
    fontSize: fontSize16,
    color: COLORS.textBlack,
    minHeight: SIZES.height * 0.2,
    maxHeight: SIZES.height * 0.4,
    paddingHorizontal: Size12,
    textAlign: 'left',
    borderWidth: 0,
    borderRadius: Size4,
  },
  counterContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: Size8,
  },
  counterText: {
    fontSize: fontSize14,
    color: COLORS.black,
  },
  counterTextError: {
    color: COLORS.red,
  },
  spacer: {
    flex: 1,
  },
});

export default AboutScreen;
