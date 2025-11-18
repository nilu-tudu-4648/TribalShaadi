import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import AppText from './AppText';
import { fontSize24, SIZES, Size25, fontSize16 } from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import { HomeIcon2 } from './svg/SvgIcons';
import { convertCmToReadableHeight } from '../constants/functions';

interface NameComponentProps {
  name: string;
  age: number;
  isVerified: boolean;
  isPremium: boolean;
  height: string;
  religion: string;
  caste: string;
  districtName: string;
  stateName: string;
  isNameLoading?: boolean;
}

const NameComponent: React.FC<NameComponentProps> = ({
  name,
  age,
  isVerified,
  isPremium,
  height,
  religion,
  caste,
  districtName,
  stateName,
  isNameLoading = false,
}) => {
  return (
    <View style={styles.cardContent}>
      {isNameLoading ? (
        <View style={styles.loadingContainer}>
          <View style={styles.nameLoadingContainer}>
            <View style={styles.nameSkeleton} />
            <View style={styles.smallSkeleton} />
          </View>
          <View style={styles.detailsSkeleton} />
          <View style={styles.locationLoadingContainer}>
            <View style={styles.smallSkeleton} />
            <View style={styles.locationSkeleton} />
          </View>
        </View>
      ) : (
        <View style={styles.nameMainContainer}>
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
            text={`${convertCmToReadableHeight(
              height,
            )} · ${religion} · ${caste}`}
            textStyle={styles.details}
          />
          <View style={styles.homeIconContainer}>
            <HomeIcon2 color={COLORS.white} />
            <AppText
              text={`${districtName}, ${stateName}`}
              textStyle={styles.location}
            />
          </View>
          <View style={styles.aiVerifiedContainer}>
          {isVerified && (
            <Image
            source={require('./../assets/images/aiverified.png')}
            style={styles.aiVerifiedIcon}
            />
          )}
          </View>
        </View>
      )}
    </View>
  );
};

export default NameComponent;
export type { NameComponentProps };

const styles = StyleSheet.create({
  cardContent: {
    padding: SIZES.padding,
    gap: SIZES.base / 2,
    paddingBottom: SIZES.mediumTitle,
  },
  nameMainContainer: {
    top: '10%',
    gap: SIZES.base*.8,
  },
  name: {
    fontSize: fontSize24,
    fontWeight: '700',
    color: COLORS.white,
  },
  age: {
    fontWeight: '400',
  },
  details: {
    fontSize: fontSize16,
    color: COLORS.white,
    fontWeight: '400',
  },
  location: {
    fontSize: fontSize16,
    color: COLORS.white,
    fontWeight: '400',
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
    width: '80%',
    height: Size25 * 1.5,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    left: -Size25,
  },
  homeIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base / 2,
  },
  loadingContainer: {
    gap: SIZES.base / 2,
  },
  nameLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base2,
  },
  nameSkeleton: {
    width: 180,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
  },
  smallSkeleton: {
    width: 25,
    height: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12.5,
  },
  detailsSkeleton: {
    width: 250,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
  },
  locationLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base / 2,
  },
  locationSkeleton: {
    width: 150,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
  },
  aiVerifiedContainer: {
    width: "100%",
  },
});
