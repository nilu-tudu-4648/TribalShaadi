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
  editable,
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
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        style={[styles.textInput, textInputStyle]}
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
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_SEMI_BOLD,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
});
