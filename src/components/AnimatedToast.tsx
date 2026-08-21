import React, { useEffect } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../constants/AppColors';
import { fontSize16, Size10, SIZES } from '../constants/Sizes';
import AppText from './AppText';
import FONTS from '../constants/Fonts';

interface AnimatedToastProps {
  visible: boolean;
  message: string;
  duration?: number;
  onHide?: () => void;
  icon?: string;
}

const AnimatedToast: React.FC<AnimatedToastProps> = ({
  visible,
  message,
  duration = 2000,
  onHide,
  icon = require('../assets/images/sendtoastIcon.png'),
}) => {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSequence(
        withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) }),
        withDelay(
          duration,
          withTiming(
            100,
            { duration: 300, easing: Easing.in(Easing.cubic) },
            finished => {
              if (finished && onHide) {
                runOnJS(onHide)();
              }
            },
          ),
        ),
      );
      opacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(duration, withTiming(0, { duration: 300 })),
      );
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none">
       <Image source={icon} style={styles.icon} />
      <AppText style={styles.text} text={message}/>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: SIZES.height*0.02,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#31C440',
    paddingVertical: Size10*1.3,
    paddingHorizontal: Size10 * 1.6,
    borderRadius: Size10*2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 999,
  },
  icon: {
    marginRight: 8,
    width: Size10*2,
    height: Size10*2,
  },
  text: {
    color: COLORS.white,
    fontSize: fontSize16,
    fontFamily: FONTS.OPEN_SANS_MEDIUM,
  },
});

export default AnimatedToast;
