import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ArrowIosBackSvg, HeartIcon2 } from '../components/svg/SvgIcons';
import AppText from '../components/AppText';
import { COLORS } from '../constants/AppColors';
import {
  fontSize16,
  fontSize18,
  fontSize14,
  fontSize12,
  Size8,
  Size12,
  Size16,
  Size20,
  Size4,
  Size40,
  SIZES,
  Size25,
  fontSize36,
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import AppLinearButton from '../components/AppLinearButton';
import AppSafeView from '../components/AppSafeView';
import { PRICING_OPTIONS } from '../constants/data';
import { InfinityIcon } from '../components/svg/SvgIcons2';

const UpgradeScreen = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState('3months');

  const features = [
    {
      icon: <InfinityIcon color={COLORS.white} />,
      title: 'Unlimited Chat Access',
    },
    {
      icon: <HeartIcon2 color={COLORS.white} />,
      title: 'See All Received Interests',
    },
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    // Handle subscription logic here
    console.log('Selected plan:', selectedPlan);
  };

  return (
    <AppSafeView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/update.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowIosBackSvg  color={COLORS.black} />
          </TouchableOpacity>
          <Image
            source={require('../assets/images/premiumLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIconContainer}>{feature.icon}</View>
              <AppText text={feature.title} textStyle={styles.featureTitle} />
            </View>
          ))}
        </View>
      </ImageBackground>

      <View style={styles.bottomContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.pricingContainer}>
            {PRICING_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.pricingOption,
                  selectedPlan === option.id && styles.selectedPricingOption,
                ]}
                onPress={() => handlePlanSelect(option.id)}
              >
                <View style={styles.pricingLeft}>
                  <View
                    style={[
                      styles.radioButton,
                      selectedPlan === option.id && styles.selectedRadioButton,
                    ]}
                  >
                    {selectedPlan === option.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <View style={styles.pricingTextContainer}>
                    <AppText
                      text={option.duration}
                      textStyle={styles.pricingDuration}
                    />
                    {option.badge && (
                      <View style={styles.badgeContainer}>
                        <AppText
                          text={option.badge}
                          textStyle={styles.badgeText}
                        />
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.pricingRight}>
                  <AppText
                    text={option.price}
                    textStyle={styles.pricingPrice}
                  />
                  {option.pricePerMonth && (
                    <AppText
                      text={option.pricePerMonth}
                      textStyle={styles.pricingSubtext}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <AppLinearButton
          title={`Get ${
            PRICING_OPTIONS.find(p => p.id === selectedPlan)?.duration || ''
          } for ${
            PRICING_OPTIONS.find(p => p.id === selectedPlan)?.price || ''
          }`}
          onPress={handleContinue}
          linearGradientColors={['#21BEFE', '#EE50C1']}
          buttonStyle={styles.continueButton}
          textStyle={styles.continueButtonText}
        />
        <AppText
          text="This app can be used without a subscription. With a subscription, you get access to paid features."
          textStyle={styles.disclaimerText}
        />
      </View>
    </AppSafeView>
  );
};

export default UpgradeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 0,
  },
  backgroundImage: {
    height: SIZES.height * 0.5,
    paddingTop: Size40,
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
    borderRadius: fontSize36/2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  logo: {
    width: '100%',
    height: Size40,
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
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    color: COLORS.black,
  },
  bottomContainer: {
    backgroundColor: COLORS.white,
    paddingTop: Size20,
    paddingHorizontal: Size16,
    borderTopLeftRadius: Size40 * 5,
    borderTopRightRadius: Size40 * 5,
  },
  pricingContainer: {
    paddingVertical: Size12,
    gap: Size12,
  },
  pricingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: Size12,
    padding: Size12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  selectedPricingOption: {
    borderColor: COLORS.violet,
    backgroundColor: COLORS.chipSelected,
  },
  pricingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Size12,
  },
  pricingTextContainer: {
    gap: Size4,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: COLORS.violet,
  },
  radioButtonInner: {
    width: Size12,
    height: Size12,
    borderRadius: Size12 / 2,
    backgroundColor: COLORS.violet,
  },
  pricingDuration: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
  },
  pricingSubtext: {
    fontSize: fontSize14,
    color: COLORS.textSecondary,
  },
  pricingRight: {
    alignItems: 'flex-end',
    gap: Size4,
  },
  pricingPrice: {
    fontSize: fontSize18,
    fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
    color: COLORS.violet,
  },
  badgeContainer: {
    backgroundColor: COLORS.success,
    borderRadius: Size4,
    paddingHorizontal: Size8,
    paddingVertical: Size4,
  },
  badgeText: {
    fontSize: fontSize12,
    color: COLORS.white,
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
  },
  buttonContainer: {
    paddingVertical: Size12,
    flex: 1,
  },
  continueButton: {},
  continueButtonText: {
    fontSize: fontSize18,
    fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
  },
  disclaimerText: {
    textAlign: 'center',
    color: COLORS.grey,
    fontSize: fontSize12,
    paddingVertical: Size12,
    paddingHorizontal: Size20,
  },
});
