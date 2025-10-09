import {
  KeyboardTypeOptions,
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React from 'react';
import { borderWidth, fontSize16, Size16, SIZES } from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import FONT_FAMILY from '../constants/Fonts';

// Function to remove emojis from text
const removeEmojis = (text: string): string => {
  return text.replace(
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}]|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23EC}]|[\u{23F0}]|[\u{23F3}]|[\u{25FD}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2705}]|[\u{270A}-\u{270B}]|[\u{2728}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2795}-\u{2797}]|[\u{27B0}]|[\u{27BF}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]/gu,
    ''
  );
};

const AppTextInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoComplete,
  maxLength,
  placeholderTextColor,
  style,
  textInputStyle,
  multiline,
  textAlignVertical,
  autoFocus,
  onFocus,
  onBlur,
  editable = true,
  selectTextOnFocus,
}: {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType: KeyboardTypeOptions;
  autoComplete?: TextInputProps['autoComplete'];
  maxLength?: number;
  placeholderTextColor?: string;
  style?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<ViewStyle>;
  multiline?: boolean;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
  placeholderStyle?: StyleProp<TextStyle>;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  editable?: boolean;
  selectTextOnFocus?: boolean;
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={(text) => {
          const cleanText = removeEmojis(text);
          onChangeText(cleanText);
        }}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        style={[
          styles.textInput,
          {
            color: editable ? COLORS.textPrimary : COLORS.disabledText,
            borderColor: editable ? COLORS.borderBottom : COLORS.borderLight,
          },
          textInputStyle,
        ]}
        placeholderTextColor={placeholderTextColor}
        maxLength={maxLength}
        multiline={multiline}
        textAlignVertical={textAlignVertical}
        autoFocus={autoFocus}
        onFocus={onFocus}
        onBlur={onBlur}
        editable={editable}
        selectTextOnFocus={selectTextOnFocus}
      />
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  inputContainer: { gap: Size16 },
  textInput: {
    fontSize: fontSize16,
    color: COLORS.textPrimary,
    paddingVertical: SIZES.base,
    borderBottomWidth: borderWidth,
    borderColor: COLORS.borderBottom,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_MEDIUM,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
});
