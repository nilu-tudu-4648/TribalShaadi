import { StyleSheet } from 'react-native';
import { COLORS } from './AppColors';
import {
  fontSize36,
  fontSize20,
  fontSize18,
  Size8,
  lignHeight24,
  lignHeight20,
  lignHeight72,
} from './Sizes';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: lignHeight24,
    paddingVertical: lignHeight24,
    gap: lignHeight20,
    paddingTop: lignHeight72,
  },
  title: {
    fontSize: fontSize36,
    fontWeight: '500',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: fontSize20,
    color: COLORS.greyText2,
    fontWeight: '400',
  },
  continueButton: {
    width: '100%',
    borderRadius: Size8,
  },
  continueButtonActive: {
    backgroundColor: COLORS.black,
  },
  continueButtonInactive: {
    backgroundColor: COLORS.continueInactive,
  },
  continueButtonText: {
    fontSize: fontSize18,
    fontWeight: '600',
  },
  continueButtonTextActive: {
    color: COLORS.white,
  },
  continueButtonTextInactive: {
    color: COLORS.textInactive,
  },
});
