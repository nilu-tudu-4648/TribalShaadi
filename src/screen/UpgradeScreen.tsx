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
  fontSize20,
  Size14,
  Size10,
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import AppLinearButton from '../components/AppLinearButton';
import AppSafeView from '../components/AppSafeView';
import { ROUTES } from '../constants/data';
import { InfinityIcon } from '../components/svg/SvgIcons2';
import {
  formatDateShort,
  generateRazorPayOrderIdUrl,
  getPackageByUserIdUrl,
  getPackageListUrl,
  getPaymentGatewaysUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  insertPaymentUrl,
  savePremiumAccountUrl,
  setReducerLoadingfalse,
} from '../constants/functions';
import {
  getPackageListApi,
  getPaymentGatewaysApi,
  generateRazorPayOrderIdApi,
  insertPaymentApi,
  savePremiumAccountApi,
  getPackageByUserIdApi,
} from '../store/reducers/paymentReducer';
import { useDispatch, useSelector } from 'react-redux';
import AppLoader from '../components/AppLoader';
import AppToast from '../components/AppToast';
import RazorpayCheckout from 'react-native-razorpay';
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
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);
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

  const calculateEndDate = useCallback((months: number) => {
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setMonth(currentDate.getMonth() + months);
    return endDate.toISOString();
  }, []);

  const handlePlanSelect = (planId: number) => {
    setSelectedPlan(planId);
  };
  const paymentSuccessfull = useCallback(
    async (data: any, selectedPackage: any) => {
      try {
        dispatch(
          insertPaymentApi(insertPaymentUrl, {
            paymentReference: data.razorpay_payment_id,
            amount: selectedPackage.package[0].baseAmount,
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
            packageId: selectedPackage.id,
            packageDurationId: selectedPackage.package[0].packageDurationId,
            startDate: new Date().toISOString(),
            endate: calculateEndDate(selectedPackage.package[0].value),
            netAmount: selectedPackage.package[0].baseAmount,
            purchaseDate: new Date().toISOString(),
          }),
        );
        setReducerLoadingfalse(dispatch, () => {
          getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
        });
      }
    },
    [dispatch, calculateEndDate, user.id],
  );
  const openRazorpayCheckout = () => {
    if (!paymentGateways) {
      AppToast('Payment configuration not ready. Please try again.');
      return;
    }

    const selectedPackage = packageList.find((p: any) => p.id === selectedPlan);
    console.log('selectedPackage found:', selectedPackage);

    if (!selectedPackage) {
      console.log('No selected package found for planId:', selectedPlan);
      return;
    }

    console.log('Setting checkout in progress to true');
    setCheckoutInProgress(true);

    const paymentData = {
      amount: selectedPackage.package[0].baseAmount,
      currency: 'INR',
    };

    dispatch(
      generateRazorPayOrderIdApi(generateRazorPayOrderIdUrl, paymentData),
    );
  };

  useEffect(() => {
    if (checkoutInProgress && razorPayOrderId) {
      const selectedPackage = packageList.find(
        (p: any) => p.id === selectedPlan,
      );

      if (!selectedPackage) {
        setCheckoutInProgress(false);
        return;
      }

      const options = {
        key: paymentGateways.jsonData.apiKey,
        amount: selectedPackage.package[0].baseAmount * 100,
        currency: 'INR',
        name: 'TribalShaadi',
        description: `${selectedPackage.package[0].value} Months Premium Subscription`,
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
    dispatch(getPackageListApi(getPackageListUrl));
    dispatch(getPaymentGatewaysApi(getPaymentGatewaysUrl));
    dispatch(getPackageByUserIdApi(getPackageByUserIdUrl, { userId: user.id }));
  }, [dispatch, user.id]);

  return (
    <AppSafeView style={styles.container}>
      {loader && <AppLoader />}
      {packageByUserId.length === 0 ? (
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
                          option.package[0].baseAmount /
                            option.package[0].value,
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
              onPress={openRazorpayCheckout}
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
            <AppText text="Premium Member" textStyle={styles.offerTitleWhite} />
            <AppText
              text={`₹${packageByUserId[0].netAmount}`}
              textStyle={styles.offerPriceWhite}
            />
            <View style={styles.offerBadge}>
              <AppText
                text={`Ends on ${formatDateShort(packageByUserId[0].endDate)}`}
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
  offerTitleWhite: {
    fontSize: fontSize20,
    fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: COLORS.white,
  },
  offerPriceWhite: {
    fontSize: fontSize20,
    fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
    textAlign: 'center',
    color: COLORS.white,
  },
  offerBadge: {
    backgroundColor: COLORS.offerBg,
    padding: Size4,
    borderRadius: Size12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Size14,
  },
});
