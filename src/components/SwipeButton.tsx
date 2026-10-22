import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {
  Size10,
  Size25,
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
      try {
        X.value = withSpring(0);
      } catch (error) {
      }
    },
  }));

  const handleComplete = (isToggled: boolean) => {
    try {
      if (isToggled && typeof onToggle === 'function') {
        onToggle();
      }
    } catch (error) {
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Store initial position for gesture
      try {
        // No additional logic needed for start
      } catch (error) {
      }
    })
    .onUpdate((e) => {
      try {
        const newValue = e.translationX;
        X.value = Math.max(0, Math.min(newValue, H_SWIPE_RANGE));
      } catch (error) {
      }
    })
    .onEnd(() => {
      try {
        if (X.value < H_SWIPE_RANGE) {
          X.value = withSpring(0);
        } else {
          X.value = withSpring(H_SWIPE_RANGE);
          runOnJS(handleComplete)(true);
        }
      } catch (error) {
      }
    });

  const AnimatedStyles = {
    swipeable: useAnimatedStyle(() => {
      try {
        return {
          transform: [{ translateX: X.value }],
        };
      } catch (error) {
        return { transform: [{ translateX: 0 }] };
      }
    }),
    swipeText: useAnimatedStyle(() => {
      try {
        return {
          opacity: interpolate(
            X.value,
            [0, H_SWIPE_RANGE / 2],
            [1, 0],
            Extrapolate.CLAMP,
          ),
        };
      } catch (error) {
        return { opacity: 1 };
      }
    }),
  };

  return (
    <View style={styles.swipeCont}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]}>
          {/* Safe SVG rendering with fallback */}
          {React.createElement(() => {
            try {
              return <PhoneSvg />;
            } catch (error) {
              return (
                <View style={styles.svgFallback}>
                  <Animated.Text style={styles.fallbackIcon}>📞</Animated.Text>
                </View>
              );
            }
          })}
        </Animated.View>
      </GestureDetector>
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
    borderRadius: SWIPEABLE_DIMENSIONS / 2,
    backgroundColor: COLORS.white,
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  swipeText: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '400',
    zIndex: 2,
    color: COLORS.white,
  },
  svgFallback: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  fallbackIcon: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default SwipeButton; 