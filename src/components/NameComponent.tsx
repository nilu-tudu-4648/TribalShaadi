import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import AppText from './AppText';
import { fontSize14, fontSize24, SIZES, Size25 } from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import { HomeIcon2 } from './svg/SvgIcons';
import { convertCmToReadableHeight } from '../constants/functions';

const NameComponent = ({
  name,
  age,
  isVerified,
  isPremium,
  height,
  religion,
  caste,
  districtName,
  stateName,
}: {
  name: string;
  age: number;
  isVerified: boolean;
  isPremium: boolean;
  height: string;
  religion: string;
  caste: string;
  districtName: string;
  stateName: string;
}) => {
  return (
    <View style={styles.cardContent}>
      <View style={styles.nameContainer}>
        <AppText text={`${name}, ${age}`} textStyle={styles.name} />
        {isVerified && (
          <Image
            source={require('./../assets/images/tick.png')}
            style={styles.verificationIcon}
          />
        )}
        {isPremium && (
          <Image
            source={require('./../assets/images/crown.png')}
            style={styles.verificationIcon}
          />
        )}
      </View>
      <AppText
        text={`${convertCmToReadableHeight(height)} · ${religion} · ${caste}`}
        textStyle={styles.details}
      />
      <View style={styles.homeIconContainer}>
        <HomeIcon2 color={COLORS.white} />
        <AppText
          text={`${districtName}, ${stateName}`}
          textStyle={styles.location}
        />
      </View>
      <View>
        {isVerified && (
          <Image
            source={require('./../assets/images/aiverified.png')}
            style={styles.aiVerifiedIcon}
          />
        )}
      </View>
    </View>
  );
};

export default NameComponent;

const styles = StyleSheet.create({
  cardContent: {
    padding: SIZES.padding,
    gap: SIZES.base / 2,
    paddingBottom: SIZES.mediumTitle,
  },
  name: {
    fontSize: fontSize24,
    fontWeight: '700',
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    zIndex: 1,
  },
  age: {
    fontWeight: '400',
  },
  details: {
    fontSize: fontSize14,
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    zIndex: 1,
  },
  location: {
    fontSize: fontSize14,
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    zIndex: 1,
  },

  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base2,
  },
  verificationIcon: {
    width: Size25,
    height: Size25,
    resizeMode: 'contain',
  },
  aiVerifiedIcon: {
    width: '100%',
    height: Size25,
    resizeMode: 'contain',
    right: SIZES.base,
  },
  homeIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base / 2,
  },
});
