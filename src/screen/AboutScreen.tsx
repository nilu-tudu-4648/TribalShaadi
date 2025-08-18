import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import {
  fontSize16,
  fontSize24,
  lignHeight24,
  Size8,
  lignHeight72,
  fontSize14,
  Size12,
  Size4,
  SIZES,
  borderWidth,
  screenHeight,
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
  setReducerLoadingfalse,
  updateUrl,
} from '../constants/functions';

const AboutScreen = () => {
  const [aboutText, setAboutText] = useState('');

  const { user, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const dispatch = useDispatch();
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
      const requestBody = {
        aboutMe: aboutText,
      };

      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const isFormValid = aboutText.trim().length > 0 && wordCount <= MAX_WORDS;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <HeaderBack />

          {/* Title */}
          <AppText text="About Yourself" textStyle={styles.title} />

          {/* Text Input Area */}
          <View style={styles.textInputContainer}>
            <AppTextInput
              placeholder="Write about yourself in 35 words"
              placeholderTextColor={COLORS.grey}
              value={aboutText}
              onChangeText={setAboutText}
              keyboardType="default"
              style={styles.textInputWrapper}
              textInputStyle={styles.textInput}
              multiline={true}
              textAlignVertical="top"
            />
          </View>

          {/* Word Counter */}
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

          {/* Continue Button */}
          <AppButton
            title="Continue"
            onPress={handleContinue}
            isLoading={loader}
            isButtonDisabled={!isFormValid || loader}
            buttonStyle={[
              styles.continueButton,
              isFormValid
                ? styles.continueButtonActive
                : styles.continueButtonInactive,
            ]}
            textStyle={[
              styles.continueButtonText,
              isFormValid
                ? styles.continueButtonTextActive
                : styles.continueButtonTextInactive,
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
    gap: lignHeight24,
    paddingTop: lignHeight72,
  },
  title: {
    fontSize: fontSize24,
    color: COLORS.textBlack,
    // fontFamily: FONTS.OPEN_SANS_CONDENSED_BOLD,
    fontWeight: '600',
  },
  textInputContainer: {
    paddingVertical: Size8,
    gap: Size8,
  },
  textInputWrapper: {
    // Container wrapper style for AppTextInput
  },
  textInput: {
    fontSize: fontSize16,
    color: COLORS.textBlack,
    minHeight: SIZES.height * 0.2,
    maxHeight: SIZES.height * 0.4,
    paddingVertical: Size12,
    paddingHorizontal: Size12,
    textAlign: 'left',
    borderWidth: borderWidth,
    borderColor: COLORS.borderGrey,
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
  continueButton: {
    borderRadius: Size8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonActive: {
    backgroundColor: COLORS.textBlack,
  },
  continueButtonInactive: {
    backgroundColor: COLORS.borderLight,
  },
  continueButtonText: {
    fontSize: fontSize16,
    fontWeight: '600',
  },
  continueButtonTextActive: {
    color: COLORS.white,
  },
  continueButtonTextInactive: {
    color: COLORS.placeholderInactive,
  },
});

export default AboutScreen;
