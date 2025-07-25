import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/AppColors';
import {
  fontSize14,
  Size8,
  borderWidth,
  Size12,
} from '../../constants/Sizes';
import AppText from '../AppText';

interface AppChip2Props {
  title: string;
  onPress: () => void;
  isSelected?: boolean;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
}

const AppChip2: React.FC<AppChip2Props> = ({
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
    paddingVertical: Size12,
    paddingHorizontal: Size12,
    borderRadius: Size8,
    borderWidth: borderWidth,
    borderColor: COLORS.bgDisabled,
  },
  chipSelected: {
    backgroundColor: COLORS.chipSelected,
    borderColor: COLORS.chipSelctedBorder,
    borderWidth: borderWidth,
  },
  chipDisabled: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.bgDisabled,
    opacity: 0.5,
  },
  chipText: {
    fontSize: fontSize14,
    color: COLORS.black,
    fontWeight: '500',
    letterSpacing: 1.5,
  },
  chipTextSelected: {
    color: COLORS.violet,
  },
  chipTextDisabled: {
    color: COLORS.placeholderInactive,
  },
});

export default AppChip2;