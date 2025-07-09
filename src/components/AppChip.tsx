import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/AppColors';
import {
  fontSize14,
  Size8,
  Size20,
  Size16,
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
    paddingHorizontal: Size16,
    paddingVertical: Size8,
    borderRadius: Size20,
    backgroundColor: COLORS.disabledBG,
  },
  chipSelected: {
    backgroundColor: COLORS.black,
  },
  chipDisabled: {
    backgroundColor: COLORS.borderLight,
    borderColor: COLORS.borderLight,
    opacity: 0.5,
  },
  chipText: {
    fontSize: fontSize14,
    color: COLORS.black,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: COLORS.white,
  },
  chipTextDisabled: {
    color: COLORS.placeholderInactive,
  },
});

export default AppChip;