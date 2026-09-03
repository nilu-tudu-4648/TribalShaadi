import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import AppText from './AppText';
import { fontSize24, SIZES, Size25, fontSize16, Size4, fontSize14 } from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import { HomeIcon2 } from './svg/SvgIcons';

interface NameComponentProps {
  name: string;
  age?: number;
  isVerified: boolean;
  isPremium: boolean;
  height: string;
  religion: string;
  caste: string;
  districtName: string;
  stateName: string;
  isNameLoading?: boolean;
  freeConnect: string;
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
  freeConnect,
}) => {
  const asNumber = Number(height);
  const heightLabel =
    Number.isFinite(asNumber) && asNumber > 0
      ? (() => {
          let feet = Math.floor(asNumber / 30.48);
          let inches = Math.round((asNumber / 30.48 - feet) * 12);
          if (inches >= 12) {
            feet += 1;
            inches -= 12;
          }
          return `${feet} ft ${inches} in`;
        })()
      : height && String(height) !== '0'
        ? String(height)
        : '';
  const detailsParts = [heightLabel, religion, caste].filter(
    part => part != null && String(part).trim() !== '',
  );

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
        <View style={styles.content}>
          <View style={styles.nameContainer}>
            <AppText
              text={`${name}${age ? `, ${age}` : ''}`}
              textStyle={styles.name}
              numberOfLines={1}
            />
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
          {detailsParts.length > 0 ? (
            <AppText
              text={detailsParts.join(' · ')}
              textStyle={styles.location}
            />
          ) : null}
          <View style={styles.locationRow}>
            <View style={styles.homeIconContainer}>
              <HomeIcon2 color={COLORS.white} />
              <AppText
                text={`${districtName}, ${stateName}`}
                textStyle={styles.location}
              />
            </View>

          </View>
          <View style={styles.aiVerifiedContainer}>
            <View>
              {isVerified && (
                <Image
                  source={require('./../assets/images/aiverified.png')}
                  style={styles.aiVerifiedIcon}
                />
              )}
            </View>
            {
              freeConnect &&
              <View style={styles.pillContainer}>
                <AppText
                  text={`${freeConnect} Free Profiles`}
                  textStyle={styles.pillText}
                />
              </View>
            }
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
    paddingLeft: SIZES.padding,
    width: '100%',
  },
  nameMainContainer: {
  },
  name: {
    fontSize: fontSize24,
    fontWeight: '700',
    color: COLORS.white,
    flex: 1,
    flexShrink: 1,
  },
  age: {
    fontSize: fontSize24,
    fontWeight: '700',
    color: COLORS.white,
    flexShrink: 0,
  },
  details: {
    fontSize: fontSize16,
    color: COLORS.white,
    marginVertical: 4,
  },
  location: {
    fontSize: fontSize16,
    color: COLORS.white,
    fontWeight: '400',
  },
  pillText: {
    fontSize: fontSize14,
    color: "#570660",
    fontWeight: 'bold',
  },

  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base2,
    width: '100%',
    paddingRight: Size4 * 3,
  },
  content: {
    width: '100%',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: Size4 * 3,
  },
  verificationIcon: {
    width: Size25,
    height: Size25,
    resizeMode: 'contain',
  },
  aiVerifiedIcon: {
    width: SIZES.width * 0.5,
    height: Size25 * 1.5,
    resizeMode: 'contain',
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
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: Size4 * 2.5,
    justifyContent: 'space-between',
  },
  pillContainer: {
    backgroundColor: COLORS.pill,
    borderRadius: Size4 * 5,
    paddingHorizontal: Size4 * 2.5,
    height: Size25 * .8,
    justifyContent: 'center',
    alignItems: 'center',
    right: Size4 * 3,
  },
});
