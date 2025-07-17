import React from 'react';
import { View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import AppText from './AppText';
import { COLORS } from '../constants/AppColors';
import {
  fontSize16,
  Size8,
  Size12,
  Size4,
  borderWidth,
  Size18,
  Size10,
} from '../constants/Sizes';
import { DropdownIcon } from './svg/SvgIcons';

interface AppDropdownProps {
  label: string;
  selectedValue: string;
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
  dropdownContainerStyle?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
}

const AppDropdown: React.FC<AppDropdownProps> = ({
  label,
  selectedValue,
  placeholder,
  onPress,
  disabled = false,
  dropdownContainerStyle,
  dropdownStyle,
}) => {
  return (
    <View style={[styles.dropdownContainer, dropdownContainerStyle]}>
      {label && <AppText text={label} textStyle={styles.dropdownLabel} />}
      <TouchableOpacity 
        style={[
          styles.dropdown,
          disabled && styles.dropdownDisabled,
          dropdownStyle,
        ]} 
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
      >
        <AppText
          text={selectedValue || placeholder}
          textStyle={[
            styles.dropdownText,
            !selectedValue && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
        />
        <DropdownIcon 
          width={Size18} 
          height={Size10} 
          color={disabled ? COLORS.placeholderInactive : COLORS.borderBottom} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    gap: Size8, 
  },
  dropdownLabel: {
    fontSize: fontSize16,
    color: COLORS.textBlack,
    fontWeight: '500',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: borderWidth,
    borderBottomColor: COLORS.borderBottom,
    paddingVertical: Size12,
    paddingHorizontal: Size4,
    gap: Size8,
  },
  dropdownDisabled: {
    borderBottomColor: COLORS.placeholderInactive,
    opacity: 0.6,
  },
  dropdownText: {
    fontSize: fontSize16,
    color: COLORS.textBlack,
    flex: 1,
  },
  placeholderText: {
    color: COLORS.placeholderText,
  },
  disabledText: {
    color: COLORS.placeholderInactive,
  },
});

export default AppDropdown; 