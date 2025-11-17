import { Pressable, StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { ROUTES } from '../../constants/data';
import { ArrowIosBackSvg } from '../svg/SvgIcons';
import { COLORS } from '../../constants/AppColors';
import AppText from '../AppText';
import { useNavigation } from '@react-navigation/native';
import {
  fontSize16,
  fontSize20,
  fontSize12,
  Size4,
  Size8,
  Size12,
  Size16,
  Size20,
  Size25,
  Size40,
  fontSize36,
  SIZES,
} from '../../constants/Sizes';
import FONT_FAMILY from '../../constants/Fonts';

interface Feature {
  icon: React.ReactNode;
  title: string;
}

interface PremiumCardProps {
  packageData: {
    netAmount: number;
    endDate: string;
  };
  features: Feature[];
  endDateText: string;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  packageData,
  features,
  endDateText,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.premiumContainer}>
      <Pressable
        onPress={() =>
          (navigation as any).navigate(ROUTES.MAIN_TABS, {
            screen: ROUTES.ACCOUNT,
          })
        }
        style={styles.header}
      >
        <View style={styles.backButton}>
          <ArrowIosBackSvg color={COLORS.black} />
        </View>
        <Image
          source={require('../../assets/images/premiumLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Pressable>

      <View style={styles.offerContainer}>
        <AppText text="Premium Member" textStyle={styles.offerTitleWhite} />
        <View style={styles.priceRow}>
          <AppText
            text={`₹${packageData.netAmount}`}
            textStyle={styles.offerPriceWhite}
          />
          <View style={styles.weekContainer}>
            <AppText
              text={packageData.endDate}
              textStyle={styles.offerContainerText}
            />
          </View>
        </View>
        <View style={styles.offerBadge}>
          <AppText
            text={endDateText}
            textStyle={[
              styles.offerContainerText,
              { color: COLORS.offerBg, fontStyle: 'italic' },
            ]}
          />
        </View>
      </View>

      <Image
        source={require('../../assets/images/offers.png')}
        style={styles.offerImage}
        resizeMode="contain"
      />

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={styles.featureIconContainer}>{feature.icon}</View>
            <AppText text={feature.title} textStyle={styles.featureTitle} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default PremiumCard;

const styles = StyleSheet.create({
  premiumContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: Size20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Size16,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: Size16,
    width: fontSize36,
    height: fontSize36,
    borderRadius: fontSize36 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  logo: {
    width: '100%',
    height: Size40 * 1.2,
    resizeMode: 'contain',
  },
  offerContainer: {
    backgroundColor: COLORS.violet,
    height: SIZES.height * 0.15,
    borderRadius: Size12,
    width: '92%',
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: Size12,
  },
  offerTitleWhite: {
    fontSize: fontSize20,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: COLORS.white,
  },
  priceRow: {
    flexDirection: 'row',
    gap: Size4,
    bottom: Size8 * 0.6,
  },
  offerPriceWhite: {
    fontSize: fontSize20,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    textAlign: 'center',
    color: COLORS.white,
    fontWeight: '700',
  },
  weekContainer: {
    borderLeftColor: COLORS.white,
    borderLeftWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    left: Size8,
    paddingLeft: Size8,
  },
  offerContainerText: {
    fontSize: fontSize12,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '700',
  },
  offerBadge: {
    padding: Size4,
    borderRadius: Size12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerImage: {
    width: '100%',
    height: SIZES.height * 0.3,
    resizeMode: 'contain',
  },
  featuresContainer: {
    paddingVertical: Size40,
    gap: Size16,
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    gap: Size12,
  },
  featureIconContainer: {
    width: Size25,
    height: Size25,
    borderRadius: Size12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.violet,
  },
  featureTitle: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    color: COLORS.black,
  },
});
