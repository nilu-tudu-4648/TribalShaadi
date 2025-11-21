import { StyleSheet } from 'react-native';
import { COLORS } from './AppColors';
import {
  fontSize20,
  fontSize18,
  Size8,
  lignHeight24,
  lignHeight20,
  lignHeight72,
  borderWidth,
  fontSize16,
  inputHeight,
  Size4,
  fontSize34,
  Size20,
  Size16,
  Size12,
} from './Sizes';
import FONT_FAMILY from './Fonts';

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
    fontSize: fontSize34,
    fontWeight: '500',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: fontSize20,
    color: COLORS.greyText2,
  },
  continueButton: {
    width: '100%',
    borderRadius: Size8*0.8,
  },
  continueButtonActive: {
    backgroundColor: COLORS.violet,
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
  inputField: {
    borderWidth: 0,
    borderBottomWidth: borderWidth,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Size8,
    width: '100%',
    paddingHorizontal: Size8 * 2,
    paddingVertical: Size4 / 2,
    borderRadius: Size4,
    borderColor: COLORS.greyText,
    borderWidth: borderWidth,
    height: inputHeight,
  },
  inputStyl: {
    borderWidth: 0,
    width: '100%',
    borderLeftWidth: borderWidth,
    borderLeftColor: COLORS.greyText,
    borderRadius: 0,
    paddingLeft: Size8 * 2,
    fontSize: fontSize16,
    height: inputHeight * 0.8,
    fontWeight: '500',
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
  },
  handleIndicator: {
    backgroundColor: COLORS.divider,
    width: 40,
    height: 8,
  },
  bottomSheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: Size20,
    borderTopRightRadius: Size20,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Size16,
    paddingVertical: Size12,
  },
});
