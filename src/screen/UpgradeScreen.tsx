import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowIosBackSvg,
  InfinityIcon,
  FilledHeartIcon,
} from '../components/svg/SvgIcons';
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
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import AppLinearButton from '../components/AppLinearButton';

const UpgradeScreen = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState('3months');

  const pricingOptions = [
    {
      id: '3months',
      duration: '3 Month',
      price: '₹449',
      pricePerMonth: '₹149 per month',
    },
    {
      id: '6months',
      duration: '6 Months',
      price: '₹749',
      pricePerMonth: '₹125 per month',
    },
    {
      id: 'lifetime',
      duration: 'Till Marriage',
      price: '₹1499',
      badge: 'Lifetime Access',
    },
  ];

  const features = [
    {
      icon: <InfinityIcon width={28} height={28} color={COLORS.violet} />,
      title: 'Unlimited Chat Access',
    },
    {
      icon: <FilledHeartIcon width={24} height={24} color={COLORS.violet} />,
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
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/update.jpg')}
        style={styles.backgroundImage}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <ArrowIosBackSvg width={24} height={24} color={COLORS.black} />
          </TouchableOpacity>
          <Image
            source={require('../assets/images/textlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIconContainer}>{feature.icon}</View>
              <AppText
                text={feature.title}
                textStyle={styles.featureTitle}
              />
            </View>
          ))}
        </View>
      </ImageBackground>

      <View style={styles.bottomContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.pricingContainer}>
            {pricingOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.pricingOption,
                  selectedPlan === option.id && styles.selectedPricingOption,
                ]}
                onPress={() => handlePlanSelect(option.id)}>
                <View style={styles.pricingLeft}>
                  <View
                    style={[
                      styles.radioButton,
                      selectedPlan === option.id &&
                        styles.selectedRadioButton,
                    ]}>
                    {selectedPlan === option.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <View>
                    <AppText
                      text={option.duration}
                      textStyle={styles.pricingDuration}
                    />
                    {option.pricePerMonth && (
                      <AppText
                        text={option.pricePerMonth}
                        textStyle={styles.pricingSubtext}
                      />
                    )}
                  </View>
                </View>
                <View style={styles.pricingRight}>
                  <AppText text={option.price} textStyle={styles.pricingPrice} />
                  {option.badge && (
                    <View style={styles.badgeContainer}>
                      <AppText
                        text={option.badge}
                        textStyle={styles.badgeText}
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <AppLinearButton
            title={`Get ${
              pricingOptions.find((p) => p.id === selectedPlan)?.duration || ''
            } for ${
              pricingOptions.find((p) => p.id === selectedPlan)?.price || ''
            }`}
            onPress={handleContinue}
            linearGradientColors={['#22D3EE', '#A855F7']}
            buttonStyle={styles.continueButton}
            textStyle={styles.continueButtonText}
          />
        </View>
        <AppText
          text="This app can be used without a subscription. With a subscription, you get access to paid features."
          textStyle={styles.disclaimerText}
        />
      </View>
    </SafeAreaView>
  );
};

export default UpgradeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  backgroundImage: {
    height: SIZES.height * 0.5,
    paddingTop: Size40,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 180,
    height: 40,
  },
  featuresContainer: {
    marginTop: Size40,
    paddingHorizontal: Size40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Size16,
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Size12,
  },
  featureTitle: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    color: COLORS.white,
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: Size20,
    borderTopRightRadius: Size20,
    marginTop: -Size40,
    paddingTop: Size20,
    paddingHorizontal: Size16,
  },
  pricingContainer: {
    marginVertical: Size12,
  },
  pricingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: Size12,
    padding: Size16,
    marginBottom: Size12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  selectedPricingOption: {
    borderColor: COLORS.violet,
    backgroundColor: 'transparent',
  },
  pricingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.grey,
    marginRight: Size12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: COLORS.violet,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.violet,
  },
  pricingDuration: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
  },
  pricingSubtext: {
    fontSize: fontSize14,
    color: COLORS.textSecondary,
    marginTop: Size4,
  },
  pricingRight: {
    alignItems: 'flex-end',
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
    marginTop: Size4,
  },
  badgeText: {
    fontSize: fontSize12,
    color: COLORS.white,
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
  },
  buttonContainer: {
    height: 50,
    marginVertical: Size12,
  },
  continueButton: {
    // flex: 0,
  },
  continueButtonText: {
    fontSize: fontSize18,
    fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
  },
  disclaimerText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: fontSize12,
    marginVertical: Size12,
    paddingHorizontal: Size20,
  },
});