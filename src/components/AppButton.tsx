import {
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
  Pressable,
  Platform,
  Vibration,
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

type AppButtonProps = {
  title: string;
  onPress: () => void;
  isButtonDisabled?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isLoading?: boolean;
  loaderSize?: number;
};

const triggerAndroidPressFeedback = () => {
  if (Platform.OS === 'android') {
    // 50ms is more reliable; some devices ignore vibrations shorter than 40-50ms due to motor spin-up time
    Vibration.vibrate(50);
  }
};

const AppButton = ({
  title,
  onPress,
  isButtonDisabled,
  buttonStyle,
  textStyle,
  isLoading,
  loaderSize,
}: AppButtonProps) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    triggerAndroidPressFeedback();
    scale.value = withSpring(0.95, SPRING_CONFIG);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
  }, [scale]);

  return (
    <AnimatedPressable
      style={[styles.button, buttonStyle, animatedStyle]}
      onPress={onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.12)', borderless: false }}
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
