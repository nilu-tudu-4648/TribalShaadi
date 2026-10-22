import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import { Size25 } from '../constants/Sizes';

const PremiumCrown = ({ style }: { style?: StyleProp<ImageStyle> }) => (
  <Image
    source={require('../assets/images/crown.png')}
    style={[styles.crown, style]}
    resizeMode="contain"
  />
);

export default PremiumCrown;

const styles = StyleSheet.create({
  crown: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: Size25,
    height: Size25,
  },
});
