import { StyleSheet } from 'react-native';
import React from 'react';
import AppButton from '../AppButton';
import { COLORS } from '../../constants/AppColors';
import { fontSize20, Size8 } from '../../constants/Sizes';

const OnboardingButton = ({
  onPress,
  isFormValid,
  loader,
  title,
}: {
  onPress: () => void;
  isFormValid: boolean;
  loader: boolean;
  title: string;
}) => {
  return (
    <AppButton
      title={title || 'Continue'}
      onPress={onPress}
      isButtonDisabled={!isFormValid || loader}
      isLoading={loader}
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
  );
};

export default OnboardingButton;

const styles = StyleSheet.create({
  continueButton: {
    borderRadius: Size8*.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonActive: {
    backgroundColor: COLORS.violet,
  },
  continueButtonInactive: {
    backgroundColor: COLORS.borderLight,
  },
  continueButtonText: {
    fontSize: fontSize20,
    fontWeight: '400',
    letterSpacing: 0,
  },
  continueButtonTextActive: {
    color: COLORS.white,
  },
  continueButtonTextInactive: {
    color: COLORS.placeholderInactive,
  },
});
