import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/AppColors';
import {
  borderWidth,
  fontSize16,
  Size10,
  Size14,
  Size4,
} from '../constants/Sizes';
import AppText from './AppText';

interface AppChipProps {
  title: string;
  onPress: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
}

const AppChip: React.FC<AppChipProps> = ({
  title,
  onPress,
  isSelected = false,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected && styles.chipSelected,
        disabled && styles.chipDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <AppText
        textStyle={[
          styles.chipText,
          isSelected && styles.chipTextSelected,
          disabled && styles.chipTextDisabled,
          textStyle,
        ]}
        text={title}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingVertical: Size10,
    paddingHorizontal: Size14,
    borderRadius: Size4,
    backgroundColor: COLORS.lightGrey,
    borderWidth: borderWidth,
    borderColor: COLORS.lightGrey2,
  },
  chipSelected: {
    backgroundColor: COLORS.violet,
  },
  chipDisabled: {
    backgroundColor: COLORS.disabledBG,
  },
  chipText: {
    fontSize: fontSize16,
    color: COLORS.textBlack,
    fontWeight: '400',
  },
  chipTextSelected: {
    color: COLORS.white,
  },
  chipTextDisabled: {
    color: COLORS.placeholderInactive,
  },
});

export default AppChip;
