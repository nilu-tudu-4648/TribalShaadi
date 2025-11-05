import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';
import AppText from './AppText';
import { COLORS } from '../constants/AppColors';
import {
  fontSize16,
  Size8,
  Size4,
  borderWidth,
  inputHeight,
} from '../constants/Sizes';

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
  const handlePress = () => {
    onPress();
  };

  return (
    <View style={[styles.dropdownContainer, dropdownContainerStyle]}>
      {label && <AppText text={label} textStyle={styles.dropdownLabel} />}
      <Pressable
        style={[
          styles.dropdown,
          disabled && styles.dropdownDisabled,
          dropdownStyle,
        ]}
        onPress={disabled ? undefined : handlePress}
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
        {/* <DropdownIcon 
          width={Size18} 
          height={Size10} 
          color={disabled ? COLORS.placeholderInactive : COLORS.borderBottom} 
        /> */}
      </Pressable>
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
    fontWeight: '400',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: borderWidth,
    borderColor: COLORS.greyText,
    borderRadius: Size4,
    height: inputHeight,
    paddingHorizontal: Size8,
  },
  dropdownFocused: {
    borderColor: COLORS.violet,
    borderWidth: 1,
  },
  dropdownDisabled: {
    borderBottomColor: COLORS.placeholderInactive,
    opacity: 0.6,
  },
  dropdownText: {
    fontSize: fontSize16,
    color: COLORS.textBlack,
  },
  placeholderText: {
    color: COLORS.greyText,
  },
  disabledText: {
    color: COLORS.greyText,
  },
});

export default AppDropdown;
