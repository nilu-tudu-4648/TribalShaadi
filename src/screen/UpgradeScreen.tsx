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
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import AppLinearButton from '../components/AppLinearButton';
import AppSafeView from '../components/AppSafeView';
import { PRICING_OPTIONS, ROUTES } from '../constants/data';
import { InfinityIcon } from '../components/svg/SvgIcons2';
import { getPackageListUrl, getTimeDurationUrl } from '../constants/functions';
import { getPackageListApi, getTimeDurationApi } from '../store/reducers/paymentReducer';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import AppLoader from '../components/AppLoader';
const UpgradeScreen = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState('3months');
  const updated = true;
  const dispatch = useDispatch();
  const { packageList, loader, timeDuration } = useSelector(
    (state: any) => state.entities.paymentReducer,
  );
  console.log(packageList, 'packageList');
  console.log(timeDuration, 'timeDuration');
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
  useEffect(() => {
    dispatch(getPackageListApi(getPackageListUrl));
    dispatch(getTimeDurationApi(getTimeDurationUrl));
  }, [dispatch]);

  return (
    <AppSafeView style={styles.container}>
      {loader && <AppLoader />}
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
                {PRICING_OPTIONS.map(option => (
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
