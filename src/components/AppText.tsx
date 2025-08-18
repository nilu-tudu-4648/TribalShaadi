import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TextProps,
  Platform,
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
  // Safe text rendering with fallbacks
  const renderText = () => {
    try {
      if (useChildren) {
        return children;
      }
      return text || '';
    } catch (error) {
      console.error('Error rendering text:', error);
      return text || children || '';
    }
  };

  return (
    <Text style={[styles.text, textStyle]} {...rest}>
      {renderText()}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    fontSize: fontSize16,
    color: COLORS.black,
    // Use system fonts as fallback for production safety
    fontFamily: Platform.OS === 'ios' 
      ? FONT_FAMILY.OPEN_SANS_CONDENSED_SEMI_BOLD || 'System' 
      : FONT_FAMILY.OPEN_SANS_CONDENSED_SEMI_BOLD || 'sans-serif',
    fontWeight: '600',
    letterSpacing: 0.6,
  },
});
