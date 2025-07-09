import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  fontSize16,
  fontSize24,
  lignHeight24,
  Size20,
  Size8,
  lignHeight72,
  Size12,
  Size16,
} from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import HeaderBack from '../components/HeaderBack';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { completeUserProfileV2Updated } from '../store/reducers/authReducer';
import { getUserDetailsApi, setReducerLoadingfalse } from '../constants/functions';
import { getUserDetailsUrl } from '../constants/functions';
import { updateUrl } from '../constants/functions';
import AppToast from '../components/AppToast';

interface Question {
  id: string;
  question: string;
  options: string[];
}

const question: Question = {
  id: 'values',
  question: 'What values are most important to you in a life partner?',
  options: [
    'Kindness and empathy',
    'Respect for culture and traditions',
    'Ambition and hard work',
    'Open-mindedness and adaptability',
    'Strong family values',
  ],
};

const AboutPartnerScreen = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const dispatch = useDispatch();
  const { user, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );

  const isAnswered = answers[question.id] !== undefined;

  const handleOptionSelect = (option: string) => {
    setAnswers(prev => ({
      ...prev,
      [question.id]: option,
    }));
  };

  const handleContinue = async () => {
    if (!isAnswered) {
      AppToast('Please select an answer before continuing');
      console.log('Please select an answer before continuing');
      return;
    }

    try {
      const requestBody = {
        id: user.id,
        about_lifepartener: answers.values,
      };
      console.log(requestBody, 'requestBody');
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
      } catch (error) {
      console.log('NETWORK ERROR:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <HeaderBack />

        {/* Question Title */}
        <AppText text={question.question} textStyle={styles.title} />

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionItem,
                answers[question.id] === option &&
                  styles.optionItemSelected,
              ]}
              onPress={() => handleOptionSelect(option)}
            >
              <AppText
                textStyle={[
                  styles.optionText,
                  answers[question.id] === option &&
                    styles.optionTextSelected,
                ]}
                text={option}
              />
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioOuter,
                    answers[question.id] === option &&
                      styles.radioOuterSelected,
                  ]}
                >
                  {answers[question.id] === option && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Continue Button */}
        <AppButton
          title={'Continue'}
          onPress={handleContinue}
          isLoading={loader}
          isButtonDisabled={!isAnswered || loader}
          buttonStyle={[
            styles.continueButton,
            isAnswered
              ? styles.continueButtonActive
              : styles.continueButtonInactive,
          ]}
          textStyle={[
            styles.continueButtonText,
            isAnswered
              ? styles.continueButtonTextActive
              : styles.continueButtonTextInactive,
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
    paddingTop: lignHeight72,
    gap: Size20,
  },
  title: {
    fontSize: fontSize24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  optionsContainer: {
    gap: Size16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Size16,
    paddingHorizontal: Size8,
    borderRadius: Size8,
    borderBottomWidth: 1,
    borderColor: COLORS.borderGrey,
    gap: Size12,
  },
  optionItemSelected: {
    borderColor: COLORS.textBlack,
    backgroundColor: COLORS.disabledBG,
  },
  radioContainer: {
  },
  radioOuter: {
    width: Size20,
    height: Size20,
    borderRadius: Size20 / 2,
    borderWidth: 2,
    borderColor: COLORS.borderGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.textBlack,
  },
  radioInner: {
    width: Size8,
    height: Size8,
    borderRadius: Size8 / 2,
    backgroundColor: COLORS.textBlack,
  },
  optionText: {
    fontSize: fontSize16,
    color: COLORS.black,
    flex: 1,
    lineHeight: 24,
  },
  optionTextSelected: {
    fontWeight: '600',
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

export default AboutPartnerScreen;
