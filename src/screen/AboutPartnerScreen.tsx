import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  fontSize16,
  fontSize24,
  lignHeight24,
  Size20,
  Size8,
  lignHeight72,
  Size16,
  Size4,
} from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import HeaderBack from '../components/HeaderBack';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { completeUserProfileV2Updated } from '../store/reducers/authReducer';
import { getUserDetailsApi, navigateToLastScreen, setReducerLoadingfalse } from '../constants/functions';
import { getUserDetailsUrl } from '../constants/functions';
import { updateUrl } from '../constants/functions';
import AppToast from '../components/AppToast';
import { ROUTES } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../constants/globalStyles';
import { usePostHog } from 'posthog-react-native';

interface Question {
  id: string;
  question: string;
  subtitle: string;
  options: string[];
}

const question: Question = {
  id: 'values',
  question: 'Values that matter most in a life partner',
  subtitle: "Select the value that best describe what you look for in a life partner.",
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
  const navigation = useNavigation();
  const posthog = usePostHog();
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
      return;
    }

    try {
      posthog.capture('values_selected')
      const requestBody = {
        id: user.id,
        about_lifepartener: answers.values,
      };
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
    } finally {
      navigateToLastScreen(navigation, ROUTES.UPLOAD_IMAGE);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.content}>
        <HeaderBack onPress={() => navigateToLastScreen(navigation, ROUTES.ABOUT)} progress={0.8} />
        <View style={globalStyles.headerSection}>
          <AppText text={question.question} textStyle={globalStyles.title} />
          <AppText text={question.subtitle} textStyle={globalStyles.subtitle} />
        </View>
        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <Pressable
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
                ]}
                text={option}
              />
            </Pressable>
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
            globalStyles.continueButton,
            isAnswered
              ? globalStyles.continueButtonActive
              : globalStyles.continueButtonInactive,
          ]}
          textStyle={[
            globalStyles.continueButtonText,
            isAnswered
              ? globalStyles.continueButtonTextActive
              : globalStyles.continueButtonTextInactive,
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
    justifyContent: 'center',
    paddingVertical: Size16 * 1.2,
    paddingHorizontal: Size8 * 2,
    borderRadius: Size4,
    borderWidth: 1,
    borderColor: COLORS.lightGrey2,
    backgroundColor: COLORS.lightGrey,
  },
  optionItemSelected: {
    borderColor: COLORS.violet,
    backgroundColor: COLORS.lightViolet2,
  },
  optionText: {
    fontSize: fontSize16,
    color: COLORS.black,
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
});

export default AboutPartnerScreen;
