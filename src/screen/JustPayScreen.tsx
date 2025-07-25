import { Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import AppSafeView from '../components/AppSafeView';
import { COLORS } from '../constants/AppColors';
import { fontSize14, fontSize16 } from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import AppText from '../components/AppText';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../constants/data';

const JustPayScreen = () => {
  const [isSuccessful, setIsSuccessful] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const successTimer = setTimeout(() => {
      setIsSuccessful(true);
    }, 1000);

    const navigationTimer = setTimeout(() => {
      (navigation as any).navigate(ROUTES.STACK, {
        screen: ROUTES.PAYMENT_SUCCESS,
      } as never);
    }, 2000);

    return () => {
      clearTimeout(successTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigation]);
  return (
    <AppSafeView style={styles.container}>
      {!isSuccessful ? (
        <>
          <Image
            source={require('../assets/images/justpay.png')}
            style={styles.image}
          />
          <AppText text="Processing your payment" style={styles.title} />
        </>
      ) : (
        <>
          <Image
            source={require('../assets/images/wallet.png')}
            style={[styles.image,{height:100}]}
          />
          <AppText text="Payment successful" style={[styles.title]} />
          <AppText
            text="This may take a few seconds, please don’t exit the app"
            style={[
              styles.title,
              {
                textAlign: 'center',
                fontSize: fontSize14,
                fontWeight: '400',
                fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
              },
            ]}
          />
        </>
      )}
    </AppSafeView>
  );
};

export default JustPayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
    color: COLORS.black,
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
    height: 70,
  },
});
