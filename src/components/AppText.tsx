import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TextProps,
} from 'react-native';
import { fontSize16 } from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import FONT_FAMILY from '../constants/Fonts';

interface AppTextProps extends TextProps {
  text?: string;
  children?: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
  useChildren?: boolean; // 🔑 Flag to toggle child-based rendering
}

const AppText = ({ text, children, textStyle, useChildren = false, ...rest }: AppTextProps) => {
  return (
    <Text style={[styles.text, textStyle]} {...rest}>
      {useChildren ? children : text}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    fontSize: fontSize16,
    color: COLORS.black,
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_SEMI_BOLD,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
});
