import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
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
  fontSize20,
  Size14,
  Size10,
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import AppLinearButton from '../components/AppLinearButton';
import AppSafeView from '../components/AppSafeView';
import { ROUTES } from '../constants/data';
import { InfinityIcon } from '../components/svg/SvgIcons2';
import { getPackageListUrl } from '../constants/functions';
import {
  getPackageListApi,
} from '../store/reducers/paymentReducer';
import { useDispatch, useSelector } from 'react-redux';
import AppToast from '../components/AppToast';

const UpgradeScreen = () => {
  const navigation = useNavigation();
  const { packageList, loader } = useSelector(
    (state: any) => state.entities.paymentReducer,
  );
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [paymentStep, setPaymentStep] = useState(0); // 0: normal, 1: justpay, 2: wallet, 3: success
  const updated = true;
  const dispatch = useDispatch();

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

  const handlePlanSelect = (planId: number) => {
    setSelectedPlan(planId);
  };

  const handlePayment = () => {
    const selectedPackage = packageList.find((p: any) => p.id === selectedPlan);
    if (!selectedPackage) {
      AppToast('Please select a plan');
      return;
    }

    // Start payment sequence
    setPaymentStep(1); // Show justpay screen
    
    // After 2 seconds, show wallet screen
    setTimeout(() => {
      setPaymentStep(2);
    }, 2000);
    
    // After another 2 seconds, navigate to success page
    setTimeout(() => {
      setPaymentStep(0);
      (navigation as any).navigate(ROUTES.STACK, {
        screen: ROUTES.PAYMENT_SUCCESS,
      });
    }, 4000); // Total 4 seconds
  };

  useEffect(() => {
    dispatch(getPackageListApi(getPackageListUrl));
  }, [dispatch]);

  // Custom Payment Processing Screens
  const renderJustPayScreen = () => (
    <View style={styles.paymentOverlay}>
      <View style={styles.justpayContainer}>
        <Image
          source={require('../assets/images/justpay.png')}
          style={styles.justpayLogo}
          resizeMode="contain"
        />
        <AppText text="Processing your payment" textStyle={styles.processingText} />
      </View>
    </View>
  );

  const renderWalletScreen = () => (
    <View style={styles.paymentOverlay}>
      <View style={styles.walletContainer}>
        <Image
          source={require('../assets/images/wallet.png')}
          style={styles.walletImage}
          resizeMode="contain"
        />
        <View style={styles.walletTextContainer}>
          <AppText text="Processing your payment..." textStyle={styles.processingTextLarge} />
          <AppText 
            text="This may take a few seconds, please don't exit the app" 
            textStyle={styles.warningText} 
          />
        </View>
      </View>
    </View>
  );

  return (
    <AppSafeView style={styles.container}>
      {loader && (
        <View style={styles.paymentOverlay}>
          <View style={styles.paymentContainer}>
            <AppText text="Loading..." textStyle={styles.processingText} />
          </View>
        </View>
      )}
      
      {paymentStep === 1 && renderJustPayScreen()}
      {paymentStep === 2 && renderWalletScreen()}
      
      {updated ? (
        <>
          <ImageBackground
            source={require('../assets/images/update.jpg')}
            style={styles.backgroundImage}
          >
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
                source={require('../assets/images/premiumLogo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </Pressable>

            <View style={styles.featuresContainer}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureIconContainer}>
                    {feature.icon}
                  </View>
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
                {packageList.map((option: any) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.pricingOption,
                      selectedPlan === option.id &&
                        styles.selectedPricingOption,
                    ]}
                    onPress={() => handlePlanSelect(option.id)}
                  >
                    <View style={styles.pricingLeft}>
                      <View
                        style={[
                          styles.radioButton,
                          selectedPlan === option.id &&
                            styles.selectedRadioButton,
                        ]}
                      >
                        {selectedPlan === option.id && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <View style={styles.pricingTextContainer}>
                        <AppText
                          text={`${option.package[0].value} Months`}
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
                        text={`₹${option.package[0].baseAmount}`}
                        textStyle={styles.pricingPrice}
                      />
                      <AppText
                        text={`₹${Math.floor(
                          option.package[0].baseAmount / option.package[0].value,
                        )} per month`}
                        textStyle={styles.pricingSubtext}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <AppLinearButton
              title={`Get ${
                packageList.find((p: any) => p.id === selectedPlan)?.package[0]
                  .value
              } Months for ₹${
                packageList.find((p: any) => p.id === selectedPlan)?.package[0]
                  .baseAmount
              }`}
              onPress={handlePayment}
              linearGradientColors={['#21BEFE', '#EE50C1']}
              textStyle={styles.continueButtonText}
            />
            <AppText
              text="This app can be used without a subscription. With a subscription, you get access to paid features."
              textStyle={styles.disclaimerText}
            />
          </View>
        </>
      ) : (
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
              source={require('../assets/images/premiumLogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Pressable>
          <View style={styles.offerContainer}>
            <AppText
              text="Premium Member"
              textStyle={{
                ...styles.offerTitle,
                fontStyle: 'italic',
                fontWeight: 'bold',
                color: COLORS.white,
              }}
            />
            <AppText
              text="₹1499"
              textStyle={{
                ...styles.offerTitle,
                color: COLORS.white,
              }}
            />
            <View
              style={{
                backgroundColor: COLORS.offerBg,
                padding: Size4,
                borderRadius: Size12,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: Size14,
              }}
            >
              <AppText
                text="Ends on 20 May, 2025"
                textStyle={styles.offerContainerText}
              />
            </View>
          </View>
          <View>
            <AppText
              text="Get more with Premium"
              textStyle={styles.offerTitle}
            />
            <AppText
              text="Go Premium and enjoy full control of"
              textStyle={styles.offerSubTitle}
            />
            <AppText text="your Matchmaking" textStyle={styles.offerSubTitle} />
          </View>
          <Image
            source={require('../assets/images/offers.png')}
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
      )}
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
  // Payment Processing Overlay Styles
  paymentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Size20,
  },
  justpayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Size20,
    gap: Size12,
  },
  walletContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Size20,
    gap: Size20,
  },
  walletTextContainer: {
    alignItems: 'center',
    gap: Size12,
    paddingHorizontal: Size20,
  },
  justpayLogo: {
    width: Size40*2.5,
    height: Size40*2.5,
  },
  juspayText: {
    fontSize: fontSize18,
    fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
    color: COLORS.black,
  },
  processingText: {
    fontSize: fontSize14,
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    color: COLORS.black,
    textAlign: 'center',
  },
  walletImage: {
    width: Size40 * 5,
    height: Size40 * 4,
  },
  processingTextLarge: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    color: COLORS.black,
    textAlign: 'center',
  },
  warningText: {
    fontSize: fontSize12,
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    color: COLORS.grey,
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
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
    borderRadius: fontSize36 / 2,
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
    padding: Size16,
    paddingBottom: 0,
    justifyContent: 'space-between',
    borderTopLeftRadius: Size40,
    borderTopRightRadius: Size40,
    bottom: Size25,
    height: SIZES.height * 0.47,
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
    padding: Size10,
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
    color: COLORS.black,
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
  offerImage: {
    width: '100%',
    height: SIZES.height * 0.3,
    resizeMode: 'contain',
  },
  premiumContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: Size20,
    justifyContent: 'space-between',
  },
  offerTitle: {
    fontSize: fontSize20,
    fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
    color: COLORS.black,
    textAlign: 'center',
  },
  offerSubTitle: {
    fontSize: fontSize14,
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    color: COLORS.black,
    textAlign: 'center',
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
  offerContainerText: {
    fontSize: fontSize12,
    fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
    color: COLORS.black,
    textAlign: 'center',
  },
});
