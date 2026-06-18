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
  Size25,
  fontSize36,
  Size10,
  fontSize20,
  fontWeight500,
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
  const posthog = usePostHog();
  const features = [
    {
      icon: <HeartIcon2 color={COLORS.white} />,
      title: 'See All Received Interests',
    },
    {
      icon: <BellIcon color={COLORS.white} />,
      title: 'Unlock all Connections',
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
              netAmount: packageList[2]?.price,
              endDate: packageList[2]?.title,
            }}
            features={features}
            endDateText={`Lifetime Access`}
          />
        ) : packageByUserId.length === 0 ? (
          <>
            <ImageBackground
              source={require('../assets/images/update.jpg')}
              style={styles.backgroundImage}
            >
              <Pressable
                onPress={() => navigation.goBack()}
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
              <View style={styles.interestContainer}>
                <Image
                  source={require('../assets/images/upgradeblur.png')}
                  style={styles.interestImage}
                />
                <AppText
                  text="See who’s interested in you"
                  textStyle={styles.title}
                />
                <AppText
                  text="Turn interests into conversations—faster"
                  textStyle={styles.subtitle}
                />
              </View>

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
                  {packageList.filter((option:any)=>option.isActive===1).map((option: any) => (
                    <TouchableOpacity
                      key={option.packageId}
                      style={[
                        styles.pricingOption,
                        selectedPlan === option.packageId &&
                        styles.selectedPricingOption,
                      ]}
                      onPress={() => handlePlanSelect(option.packageId)}
                    >
                      <View style={styles.pricingLeft}>
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
                        <View style={styles.pricingTextContainer}>
                          <AppText
                            text={`${option.title}`}
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
                          text={`₹${option.price}`}
                          textStyle={styles.pricingPrice}
                        />
                        <AppText
                          text={`${option.tag || ''}`}
                          textStyle={styles.pricingSubtext}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              <Image source={require('../assets/images/lifetime.png')} style={styles.lifeTimeImage} />
              </ScrollView>
              <AppLinearButton
                title={`Get ${packageList.find((p: any) => p.packageId === selectedPlan)
                    ?.title
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
          </>
        ) : (
          <PremiumCard
            packageData={{
              netAmount: packageByUserId[0].netAmount,
              endDate: packageByUserId[0].title,
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
    height: SIZES.height * 0.8,
    paddingTop: Size40,
    justifyContent: 'space-between',
    resizeMode: 'contain',
    opacity: 0.8,
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
    width: '30%',
    height: Size40 * 1.2,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
  },
  featuresContainer: {
    paddingVertical: Size40,
    gap: Size8,
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
    fontSize: fontSize14,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
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
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
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
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
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
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
  },
  buttonContainer: {
    paddingVertical: Size12,
    flex: 1,
  },
  continueButtonText: {
    fontSize: fontSize18,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
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
    height: Size40 * 3,
    top: Size40,
    resizeMode: 'contain',
  },
});
