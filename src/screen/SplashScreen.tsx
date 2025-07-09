import { Image, StyleSheet, View } from 'react-native';
import React from 'react';

const SplashScreen = () => {
  return (
    <View style={styles.splashContainer}>
      <Image
        source={require('../assets/images/textlogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
  },
});
