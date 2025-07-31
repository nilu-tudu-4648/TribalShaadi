import { StyleSheet, View } from 'react-native';
import React from 'react';
import { SIZES } from '../../constants/Sizes';
import GradientLoader from '../GradientLoader';

const Loader = () => {
  return (
    <View style={styles.container}>
      <GradientLoader size={SIZES.largeTitle} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
