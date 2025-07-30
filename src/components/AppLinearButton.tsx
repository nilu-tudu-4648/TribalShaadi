import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import AppText from './AppText';
import GradientLoader from './GradientLoader';
import { Size18, Size8, SIZES } from '../constants/Sizes';
import { fontSize16 } from '../constants/Sizes';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../constants/AppColors';

const AppLinearButton = ({
  title,
  onPress,
  isButtonDisabled,
  buttonStyle,
  textStyle,
  isLoading,
  linearGradientColors,
}: {
  title?: string;
  onPress: () => void;
  isButtonDisabled?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
  linearGradientColors?: string[];
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      disabled={isButtonDisabled || isLoading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={linearGradientColors || ['#22C5F8', '#5167FC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.connectButton}
      >
        {isLoading ? (
          <GradientLoader size={Size18} />
        ) : (
          <AppText text={title || ''} textStyle={[styles.text, textStyle]} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default React.memo(AppLinearButton);

const styles = StyleSheet.create({
  button: {
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  text: {
    fontSize: fontSize16,
    fontWeight: '500',
    color: COLORS.white,
  },
  connectButton: {
    borderRadius: Size8,
    paddingVertical: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
