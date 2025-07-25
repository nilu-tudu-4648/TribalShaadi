import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import AppSafeView from '../components/AppSafeView';
import { COLORS } from '../constants/AppColors';
import AppHeader from '../components/AppHeader';
import AppScrollView from '../components/AppScrollView';
import {
  ABOUT_US_CARDS,
  ABOUT_US_CARDS_SEC_1,
  ABOUT_US_CARDS_SEC_2,
  ABOUT_US_CARDS_SEC_3,
  ABOUT_US_CARDS_SEC_4,
} from '../constants/data';
import {
  fontSize20,
  fontSize30,
  Size12,
  Size16,
  SIZES,
} from '../constants/Sizes';
import AboutusCard from '../components/Cards/AboutusCard';
import AboutusCardSec from '../components/Cards/AboutusCardSec';
import AppText from '../components/AppText';

const AboutUsScreen = () => {
  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="About Us" />
      <AppScrollView style={{}}>
        <View style={styles.content}>
          <View style={styles.cards}>
            <AboutusCardSec
              style={{ backgroundColor: COLORS.cardBg }}
              title={ABOUT_US_CARDS_SEC_1.title}
              description={ABOUT_US_CARDS_SEC_1.description}
            />
          </View>
          <Image source={require('../assets/images/about1.png')} style={styles.image} />
          <View style={styles.cards}>
            <AboutusCardSec
              style={{ backgroundColor: COLORS.cardBg1 }}
              titleStyle={{ color: COLORS.white }}
              textStyle={{ color: COLORS.white }}
              title={ABOUT_US_CARDS_SEC_2.title}
              description={ABOUT_US_CARDS_SEC_2.description}
            />
          </View>
          <View style={styles.cards}>
            <Image
              source={require('../assets/images/about4.png')}
              style={[styles.image, { resizeMode: 'stretch', height: SIZES.height*.43}]}
            />
          </View>
          <View style={styles.cards}>
            <AboutusCardSec
              style={{ backgroundColor: COLORS.cardBg1 }}
              titleStyle={{ color: COLORS.white }}
              textStyle={{ color: COLORS.white }}
              title={ABOUT_US_CARDS_SEC_3.title}
              description={ABOUT_US_CARDS_SEC_3.description}
            />
          </View>
            <Image
              source={require('../assets/images/about2.png')}
              style={styles.image}
            />
            <Image
              source={require('../assets/images/about3.png')}
              style={styles.image}
            />
          <View style={{ gap: Size12 }}>
            <AppText
              text="Our Values"
              style={{
                fontSize: fontSize30,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            />
            <AppText
              text="They guide how we build, who we serve, and where we’re headed next."
              style={{
                fontSize: fontSize20,
                color: COLORS.aboutText,
                textAlign: 'center',
              }}
            />
          </View>
          <View style={styles.cards}>
            {ABOUT_US_CARDS.map((item: any, index: number) => (
              <AboutusCard
                title={item.title}
                description={item.description}
                key={index}
              />
            ))}
          </View>
          <View style={styles.cards}>
            <AboutusCardSec
              style={{ backgroundColor: COLORS.cardBg1 }}
              titleStyle={{ color: COLORS.white }}
              textStyle={{ color: COLORS.white }}
              title={ABOUT_US_CARDS_SEC_4.title}
              description={ABOUT_US_CARDS_SEC_4.description}
            />
          </View>
        </View>
      </AppScrollView>
    </AppSafeView>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: Size16,
    gap: Size16,
  },
  image: {
    width: '100%',
    height: SIZES.height*.25,
    resizeMode: 'contain',
  },
  cards: {
    gap: Size16,
  },
});
