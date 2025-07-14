import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppSafeView from '../components/AppSafeView';
import AppText from '../components/AppText';
const PaymentConfirmation = () => {
  return (
    <AppSafeView style={styles.container}>
      <View style={styles.content}>
        <AppText text="9:41" textStyle={styles.time} />
        <AppText text="Congratulations" textStyle={styles.congrats} />
        <AppText text="You are a premium user now!" textStyle={styles.message} />
        
        <View style={styles.features}>
          <AppText text="• See 2X matches" textStyle={styles.featureText} />
          <AppText text="• Send unlimited requests" textStyle={styles.featureText} />
          <AppText text="• Unlock all your chats" textStyle={styles.featureText} />
        </View>
      </View>
    </AppSafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  content: {
    gap: 16,
  },
  time: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  congrats: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
  },
  features: {
    gap: 8,
    paddingVertical: 16,
  },
  featureText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});

export default PaymentConfirmation;