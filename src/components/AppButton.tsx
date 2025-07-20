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
import { Size12, Size25, Size4 } from '../constants/Sizes';
import { fontSize16 } from '../constants/Sizes';

const AppButton = ({
  title,
  onPress,
  isButtonDisabled,
  buttonStyle,
  textStyle,
  isLoading,
}: {
  title: string;
  onPress: () => void;
  isButtonDisabled?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={onPress}
      disabled={isButtonDisabled || isLoading}
      activeOpacity={0.8}>
      {isLoading ? (
        <GradientLoader size={Size25} />
      ) : (
        <AppText text={title} textStyle={[styles.text, textStyle]} />
      )}
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: Size4,
    paddingVertical: Size12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: fontSize16,
    fontWeight: '500',
  },
});
