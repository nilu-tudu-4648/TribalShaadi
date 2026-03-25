import {
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
  Pressable,
} from 'react-native';
import React, {useCallback} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import AppText from './AppText';
import GradientLoader from './GradientLoader';
import {Size12, Size25, Size4} from '../constants/Sizes';
import {fontSize16} from '../constants/Sizes';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING_CONFIG = {damping: 15, stiffness: 300};

const AppButton = ({
  title,
  onPress,
  isButtonDisabled,
  buttonStyle,
  textStyle,
  isLoading,
  loaderSize,
}: {
  title: string;
  onPress: () => void;
  isButtonDisabled?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
  loaderSize?: number;
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  return (
    <AnimatedPressable
      style={[styles.button, buttonStyle, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isButtonDisabled || isLoading}
    >
      {isLoading ? (
        <GradientLoader size={loaderSize || Size25} />
      ) : (
        <AppText text={title} textStyle={[styles.text, textStyle]} />
      )}
    </AnimatedPressable>
  );
};

export default React.memo(AppButton);

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
