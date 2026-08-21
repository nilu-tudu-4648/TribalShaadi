import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
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
  fontSize36,
  Size10,
  fontSize20,
  fontWeight500,
  fontWeight700,
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import AppLinearButton from '../components/AppLinearButton';
import AppSafeView from '../components/AppSafeView';
import { ROUTES } from '../constants/data';
import { BellIcon } from '../components/svg/SvgIcons2';
import {
  generateRazorPayOrderIdUrl,
  getPackageByUserIdUrl,
  getPaymentGatewaysUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  insertPaymentUrl,
  savePremiumAccountUrl,
  setReducerLoadingfalse,
} from '../constants/functions';
import {
  getPaymentGatewaysApi,
  generateRazorPayOrderIdApi,
  insertPaymentApi,
  savePremiumAccountApi,
  getPackageByUserIdApi,
} from '../store/reducers/paymentReducer';
import { useDispatch, useSelector } from 'react-redux';
import AppToast from '../components/AppToast';
import RazorpayCheckout from 'react-native-razorpay';
import Loader from '../components/loader/Loader';
import PremiumCard from '../components/Cards/PremiumCard';
import { usePostHog } from 'posthog-react-native';
const UpgradeScreen = () => {
  const navigation = useNavigation();
  const {
    packageList,
    loader,
    paymentGateways,
    razorPayOrderId,
    packageByUserId,
  } = useSelector((state: any) => state.entities.paymentReducer);
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const [selectedPlan, setSelectedPlan] = useState(packageList[0]?.packageId);
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);
  const dispatch = useDispatch();
  // console.log('packageList', packageList);
  const posthog = usePostHog();
  const features = [
    {
      icon: <HeartIcon2 color={COLORS.white} />,
      title: 'Send Unlimited Interests',
    },
    {
      icon: <BellIcon color={COLORS.white} />,
      title: 'See Who’s Sent You Interest',
    },
    {
      icon: <BellIcon color={COLORS.white} />,
      title: 'Complete Contact Access',
    },
  ];
  const handlePlanSelect = (planId: number) => {
    setSelectedPlan(planId);
  };
  const paymentSuccessfull = useCallback(
    async (data: any, selectedPackage: any) => {
      try {
        (navigation as any).navigate(ROUTES.JUST_PAY);
        dispatch(
          insertPaymentApi(insertPaymentUrl, {
            paymentReference: data.razorpay_payment_id,
            amount: selectedPackage.price,
            currency: 'INR',
            paymentStatus: 'Success',
            signature: data.razorpay_signature,
            orderId: data.razorpay_order_id,
            paymentMode: 'Razorpay',
          }),
        );
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(
          savePremiumAccountApi(savePremiumAccountUrl, {
            packageId: selectedPackage.packageId,
            packageDurationId: selectedPackage.durations[0].packageDurationId,
            netAmount: selectedPackage.price,
          }),
        );
        setReducerLoadingfalse(dispatch, () => {
          getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
        });
      }
    },
    [dispatch, user.id, navigation],
  );
  const openRazorpayCheckout = () => {
    if (!paymentGateways) {
      AppToast('Payment configuration not ready. Please try again.');
      return;
    }

    const selectedPackage = packageList.find((p: any) => p.packageId === selectedPlan);
    console.log('selectedPackage found:', selectedPackage);

    if (!selectedPackage) {
      console.log('No selected package found for planId:', selectedPlan);
      return;
    }

    console.log('Setting checkout in progress to true');
    setCheckoutInProgress(true);

    const paymentData = {
      amount: selectedPackage.price,
      currency: 'INR',
    };

    dispatch(
      generateRazorPayOrderIdApi(generateRazorPayOrderIdUrl, paymentData),
    );
  };
  useEffect(() => {
    if (checkoutInProgress && razorPayOrderId) {
      const selectedPackage = packageList.find(
        (p: any) => p.packageId === selectedPlan,
      );

      if (!selectedPackage) {
        setCheckoutInProgress(false);
        return;
      }

      const options = {
        key: paymentGateways.jsonData.apiKey,
        amount: selectedPackage.price * 100,
        currency: 'INR',
        name: 'TribalShaadi',
        description: `${selectedPackage.duration} Months Premium Subscription`,
        order_id: razorPayOrderId.id,
        handler: function (response: any) {
          console.log('Payment handler response:', response);
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.contactNo,
        },
        notes: {
          package_name: 'Premium Package',
        },
        theme: {
          color: COLORS.violet,
        },
      };

      // Validate Razorpay options before opening
      if (!options.key || options.key.trim() === '') {
        console.error('Invalid Razorpay key:', options.key);
        AppToast('Payment configuration error: Invalid key');
        setCheckoutInProgress(false);
        return;
      }

      if (!options.order_id || options.order_id.trim() === '') {
        console.error('Invalid order ID:', options.order_id);
        AppToast('Payment configuration error: Invalid order ID');
        setCheckoutInProgress(false);
        return;
      }

      if (!options.amount || options.amount < 100) {
        console.error('Invalid amount (minimum ₹1):', options.amount);
        AppToast('Payment configuration error: Invalid amount');
        setCheckoutInProgress(false);
        return;
      }

      RazorpayCheckout.open(options)
        .then((data: any) => {
          console.log('Razorpay checkout completed successfully:', data);
          paymentSuccessfull(data, selectedPackage);
        })
        .catch((error: any) => {
          console.log('=== RAZORPAY ERROR DETAILS ===');
          console.log('Full error object:', JSON.stringify(error, null, 2));
          console.log('=== END ERROR DETAILS ===');

          // Handle specific error cases
          if (error.code === 'payment_cancelled') {
            console.log('User cancelled payment');
            AppToast('Payment cancelled by user');
          } else if (error.code === 'network_error') {
            console.log('Network error occurred');
            AppToast('Network error. Please check your internet connection.');
          } else if (error.code === 'invalid_order_id') {
            console.log('Invalid order ID error');
            AppToast('Payment failed: Invalid order. Please try again.');
          } else if (error.code === 'payment_failed') {
            console.log('Payment failed');
            AppToast('Payment failed. Please try again.');
          } else {
            console.log('Unknown error occurred');
            AppToast(`Payment error: ${error.description || 'Unknown error'}`);
          }
        })
        .finally(() => {
          console.log('Setting checkout in progress to false');
          setCheckoutInProgress(false);
        });
    }
  }, [
    checkoutInProgress,
    razorPayOrderId,
    selectedPlan,
    packageList,
    user,
    paymentGateways?.jsonData?.apiKey,
    dispatch,
    paymentSuccessfull,
  ]);

  useEffect(() => {
    dispatch(getPaymentGatewaysApi(getPaymentGatewaysUrl));
    dispatch(getPackageByUserIdApi(getPackageByUserIdUrl, { userId: user.id }));
  }, [dispatch, user.id]);

  return (
    <>
      <AppSafeView style={styles.container}>
        {/* If user is female, always show as premium */}
        {user.gender === 'Female' ? (
          <PremiumCard
            packageData={{
              netAmount: packageList[0]?.price,
              endDate: packageList[0]?.name,
            }}
            features={features}
            endDateText={`Lifetime Access`}
          />
        ) : packageByUserId.length === 0 ? (
          <>
            <ImageBackground
              source={require('../assets/images/upgradebg.png')}
              style={styles.backgroundImage}
            >
              <View style={styles.topSection}>
                <Pressable
                  onPress={() => navigation.goBack()}
                  style={styles.header}
                >
                  <View style={styles.backButton}>
                    <ArrowIosBackSvg color={COLORS.white} />
                  </View>
  
                  <Image
                    source={require('../assets/images/premiumLogo1.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </Pressable>
  
                <Image
                  source={require('../assets/images/upgradeblur.png')}
                  style={styles.interestImage}
                />
  
                <View style={styles.featuresContainer}>
                  {features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <AppText
                        text="•"
                        textStyle={styles.featureBullet}
                      />
                      <AppText
                        text={feature.title}
                        textStyle={styles.featureTitle}
                      />
                    </View>
                  ))}
                </View>
              </View>

              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pricingContainer}
                bounces={false}
              >
                {packageList.filter((option: any) => option.isActive === 1).map((option: any) => (
                  <TouchableOpacity
                    key={option.packageId}
                    style={[
                      styles.pricingCard,
                      selectedPlan === option.packageId &&
                      styles.selectedPricingCard,
                    ]}
                    onPress={() => handlePlanSelect(option.packageId)}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.durationBadge}>
                        <AppText
                          text={option.name === 'Till Marriage' ? 'Lifetime' : option.name}
                          textStyle={styles.durationText}
                        />
                      </View>
                      <View
                        style={[
                          styles.radioButton,
                          selectedPlan === option.packageId &&
                          styles.selectedRadioButton,
                        ]}
                      >
                        {selectedPlan === option.packageId && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                    </View>
                    
                    <View style={[styles.priceContainer, option.name !== 'Till Marriage' && { paddingBottom: Size10 }]}>
                      <AppText
                        text={`₹${option.price}`}
                        textStyle={styles.pricingPrice}
                      />
                    </View>
                    
                    {option.name === 'Till Marriage' ? (
                      <View style={styles.bestValueBadge}>
                        <AppText
                          text="Best Value"
                          textStyle={styles.bestValueText}
                        />
                      </View>
                    ) : null}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ImageBackground>

            <View style={styles.bottomContainer}>
              <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <Image source={require('../assets/images/PremiumCard.png')} style={styles.lifeTimeImage} />
              </ScrollView>

              <View style={styles.actionContainer}>
                <AppLinearButton
                  title={`Get ${packageList.find((p: any) => p.packageId === selectedPlan)
                    ?.name
                    } for ₹${packageList.find((p: any) => p.packageId === selectedPlan)
                      ?.price
                    }`}
                  onPress={() => {
                    posthog.capture('premium_plan_selected')
                    openRazorpayCheckout();
                  }}
                  linearGradientColors={['#21BEFE', '#EE50C1']}
                  textStyle={styles.continueButtonText}
                />
                <AppText
                  text="This app can be used without a subscription. With a subscription, you get access to paid features."
                  textStyle={styles.disclaimerText}
                />
              </View>
            </View>
          </>
        ) : (
          <PremiumCard
            packageData={{
              netAmount: packageByUserId[0].netAmount,
              endDate: packageByUserId[0].name,
            }}
            features={features}
            endDateText={`Ends on ${new Date(packageByUserId[0].endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`}
          />
        )}
      </AppSafeView>
      {loader && (
        <View style={styles.loaderOverlay}>
          <Loader />
        </View>
      )}
    </>
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
    flex: 1,
    height: SIZES.height * 0.58,
    justifyContent: 'space-between',
    resizeMode: 'cover',
  },
  topSection: {
    paddingTop: Size40/2,
    gap: Size8,
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
    borderColor: COLORS.white,
    zIndex: 1,
  },
  logo: {
    width: '100%',
    height: Size40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: fontSize20,
    fontWeight: fontWeight500,
    color: COLORS.black,
  },
  subtitle: {
    fontSize: fontSize14,
    color: COLORS.black,
  },
  interestContainer: {
    alignItems: 'flex-start',
    left: Size16,
  },
  interestImage: {
    width: '40%',
    height: Size40 * 1.5,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: Size10,

  },
  featuresContainer: {
    gap: Size8,
    alignItems: 'flex-start',
    alignSelf: 'center',
    marginVertical: Size10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Size8,
  },
  featureBullet: {
    fontSize: fontSize20,
    color: COLORS.white,
    lineHeight: fontSize20,
  },
  featureTitle: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    color: COLORS.white,
  },
  bottomContainer: {
    backgroundColor: COLORS.white,
    padding: Size16,
    paddingBottom: Size10,
    flex: .8,
  },
  pricingContainer: {
    paddingHorizontal: Size16,
    paddingTop: Size20,
    paddingBottom: Size10,
    gap: Size12,
    alignItems: 'center',
  },
  pricingCard: {
    backgroundColor: COLORS.white,
    borderRadius: Size16,
    padding: Size12,
    borderWidth: 3,
    borderColor: 'transparent',
    width: SIZES.width * 0.28,
    minHeight: SIZES.height * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPricingCard: {
    borderColor: '#E68A2E', // The orange border color from image
    borderWidth: 3,
    transform: [{ scale: 1.05 }, { translateY: -10 }], // Slight scale up and move up for selected card
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: Size8,
    paddingHorizontal: 2,
  },
  durationBadge: {
    backgroundColor: '#F5EBE1', // Light beige color from image
    paddingHorizontal: Size8 * 1.2,
    paddingVertical: Size4 * 1.2,
    borderRadius: Size12,
    marginRight: Size4,
  },
  durationText: {
    fontSize: fontSize12 * 0.9,
    color: '#8B6A47', // Brownish text color from image
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
  },
  priceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Size4,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: '#7337BD', // Purple from image
    borderWidth: 2,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7337BD', // Purple from image
  },
  pricingDuration: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
  },
  pricingPrice: {
    fontSize: fontSize20 * 1.4,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    color: COLORS.black, // The price is black in the image
    fontWeight: '800',
  },
  bestValueBadge: {
    backgroundColor: '#60C46B', // Green from image
    paddingHorizontal: Size12,
    paddingVertical: Size4 * 1.2,
    borderRadius: Size4,
    marginTop: Size4,
  },
  bestValueText: {
    fontSize: fontSize12,
    color: COLORS.white,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
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
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
  },
  buttonContainer: {
    paddingVertical: Size12,
    flex: 1,
  },
  continueButtonText: {
    fontSize: fontSize18,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    fontStyle: 'italic',
    fontWeight: fontWeight700,
  },
  disclaimerText: {
    textAlign: 'center',
    color: COLORS.grey,
    fontSize: fontSize12,
    paddingVertical: Size12,
    paddingHorizontal: Size20,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  lifeTimeImage: {
    width: '100%',
    height: SIZES.height * 0.32,
    bottom: Size10,
    resizeMode: 'contain',
  },
  orText: {
    textAlign: 'center',
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    color: '#008EFE',
    fontStyle: 'italic',
    marginVertical: Size10,
    fontWeight: fontWeight700,
  },
  giftCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9FB',
    borderRadius: Size16,
    padding: Size12,
    gap: Size16,
    alignSelf: 'center',
    width: '95%',
    marginVertical: Size10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  giftImage: {
    width: Size40 * 1.5,
    height: Size40 * 1.5,
  },
  giftTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  giftTextTitle: {
    fontSize: fontSize16,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    color: '#1E1B4B',
    fontWeight: fontWeight700,
  },
  giftTextSubtitle: {
    fontSize: fontSize14,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
    color: '#4338CA',
    fontWeight: fontWeight700,
    marginTop: Size4,
  },
  actionContainer: {
    width: '100%',
    paddingTop: Size10,
  },
});
