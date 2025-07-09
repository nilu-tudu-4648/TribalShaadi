import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg';

const GradientLoader = ({size = 20}: {size: number}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{transform: [{rotate}]}}>
        <Svg height={size} width={size} viewBox="0 0 50 50">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#B97FFF" />
              <Stop offset="100%" stopColor="#2563EB" />
            </LinearGradient>
          </Defs>
          <Circle
            cx="25"
            cy="25"
            r="20"
            stroke="url(#grad)"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray="125.6"
            strokeDashoffset="31.4"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GradientLoader; 