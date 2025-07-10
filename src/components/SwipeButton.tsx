import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {
  lignHeight24,
  Size10,
  Size25,
  Size8,
  screenWidth,
} from '../constants/Sizes';
import { PhoneSvg } from './svg/SvgIcons';
import { COLORS } from '../constants/AppColors';

const BUTTON_WIDTH = screenWidth('85%');
const BUTTON_HEIGHT = 50;
const BUTTON_PADDING = Size10;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;

const H_SWIPE_RANGE =
  BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;

type SwipeButtonProps = {
  onToggle: () => void;
};

const SwipeButton = React.forwardRef<
  { reset: () => void },
  SwipeButtonProps
>(({ onToggle }, ref) => {
  const X = useSharedValue(0);

  React.useImperativeHandle(ref, () => ({
    reset: () => {
      X.value = withSpring(0);
    },
  }));

  const handleComplete = (isToggled: boolean) => {
    if (isToggled) {
      onToggle();
    }
  };

  const animatedGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = X.value;
    },
    onActive: (e, ctx) => {
      X.value = ctx.startX + e.translationX;
    },
    onEnd: () => {
      if (X.value < H_SWIPE_RANGE) {
        X.value = withSpring(0);
      } else {
        X.value = withSpring(H_SWIPE_RANGE);
        runOnJS(handleComplete)(true);
      }
    },
  });

  const AnimatedStyles = {
    swipeable: useAnimatedStyle(() => {
      return {
        transform: [{ translateX: X.value }],
      };
    }),
    swipeText: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          X.value,
          [0, H_SWIPE_RANGE / 2],
          [1, 0],
          Extrapolate.CLAMP,
        ),
      };
    }),
  };

  return (
    <View style={styles.swipeCont}>
      <PanGestureHandler onGestureEvent={animatedGestureHandler}>
        <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]}>
          <PhoneSvg />
        </Animated.View>
      </PanGestureHandler>
      <Animated.Text style={[styles.swipeText, AnimatedStyles.swipeText]}>
        Register with phone
      </Animated.Text>
    </View>
  );
});

const styles = StyleSheet.create({
  swipeCont: {
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
    backgroundColor: COLORS.black,
    borderRadius: Size25,
    padding: BUTTON_PADDING,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  swipeable: {
    position: 'absolute',
    left: BUTTON_PADDING,
    height: SWIPEABLE_DIMENSIONS,
    width: SWIPEABLE_DIMENSIONS,
    borderRadius: SWIPEABLE_DIMENSIONS,
    backgroundColor: COLORS.white,
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeText: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '400',
    zIndex: 2,
    color: COLORS.white,
  },
});

export default SwipeButton; 