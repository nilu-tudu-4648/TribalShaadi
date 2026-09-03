import { Image, StyleSheet, View, Pressable, Vibration, Platform, ImageBackground } from 'react-native';
import React, { useEffect } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
import { COLORS } from '../../constants/AppColors';
import { Size20, SIZES, Size16, fontSize14, fontSize20, fontSize30, fontSize18, Size10, fontSize12, Size12, fontSize16, Size14 } from '../../constants/Sizes';
import { ROUTES } from '../../constants/data';
import { useNavigation } from '@react-navigation/native';
import FONT_FAMILY from '../../constants/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { convertCmToReadableHeight } from '../../constants/functions';
import { HomeIcon2 } from '../svg/SvgIcons';

const BUTTON_HEIGHT = 56;
const AUTO_SWIPE_INTERVAL = 2200;
const SWIPE_CARD_WIDTH = SIZES.width * 0.55;
const SWIPE_CARD_HEIGHT = SIZES.height * 0.24;

const SwipeableUserCard = ({ users }: { users?: any[] }) => {
  const [index, setIndex] = React.useState(0);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const validUsers = React.useMemo(
    () =>
      (Array.isArray(users) ? users : []).filter(
        (u: any) => u?.imageUrl || u?.firstName,
      ),
    [users],
  );

  const nextCard = () => {
    setIndex(prev => (validUsers.length ? (prev + 1) % validUsers.length : 0));
    translateX.value = SWIPE_CARD_WIDTH;
    rotate.value = 10;
    translateX.value = withTiming(0, {
      duration: 450,
      easing: Easing.out(Easing.cubic),
    });
    rotate.value = withTiming(0, { duration: 450 });
    opacity.value = withTiming(1, { duration: 350 });
  };

  useEffect(() => {
    if (validUsers.length < 2) return;
    const timer = setInterval(() => {
      translateX.value = withTiming(-SWIPE_CARD_WIDTH, {
        duration: 400,
        easing: Easing.in(Easing.cubic),
      });
      rotate.value = withTiming(-10, { duration: 400 });
      opacity.value = withTiming(0, { duration: 400 }, finished => {
        if (finished) {
          runOnJS(nextCard)();
        }
      });
    }, AUTO_SWIPE_INTERVAL);
    return () => clearInterval(timer);
  }, [validUsers.length]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const currentUser = validUsers[index] || {};
  const locationText = [currentUser?.districtName, currentUser?.stateName]
    .filter(Boolean)
    .join(' • ');
  const nameHeightText = [
    currentUser?.firstName,
    currentUser?.height ? convertCmToReadableHeight(currentUser.height) : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.swipeCardWrapper}>
      <Animated.View style={[styles.swipeCard, cardStyle]}>
        <ImageBackground
          source={
            currentUser?.imageUrl
              ? { uri: `${currentUser.imageUrl}` }
              : require('../../assets/images/genuine.png')
          }
          style={styles.swipeCardImage}
          imageStyle={styles.swipeCardImageRadius}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.75)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.swipeCardGradient}
          />
          {!!nameHeightText && (
            <View style={styles.swipeCardInfo}>
              <AppText text={nameHeightText} textStyle={styles.swipeCardName} />
              {!!locationText && (
                <View style={styles.swipeCardLocationRow}>
                  <HomeIcon2 size={12} color={COLORS.white} />
                  <AppText
                    text={locationText}
                    textStyle={styles.swipeCardLocation}
                  />
                </View>
              )}
            </View>
          )}
        </ImageBackground>
      </Animated.View>
    </View>
  );
};

const ShineButton = ({ onPress, popupContent }: { onPress: () => void, popupContent: any }) => {
  const shimmerX = useSharedValue(-SIZES.width);

  useEffect(() => {
    shimmerX.value = withRepeat(
      withTiming(SIZES.width * 1.5, {
        duration: 1800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false,
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS === 'android') Vibration.vibrate(50);
        onPress();
      }}
      style={styles.buttonWrapper}
    >
      {/* 3D bottom shadow bar */}
      <View style={styles.buttonShadow} />

      {/* Main gradient surface */}
      <LinearGradient
        colors={['#C084FC', '#9333EA']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.buttonGradient}
      >
        {/* Shine stripe */}
        <Animated.View style={[styles.shimmer, shimmerStyle]} pointerEvents="none">
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.25)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shimmerGradient}
          />
        </Animated.View>
        <AppText text={popupContent?.button_text} textStyle={styles.ctaButtonText} />
      </LinearGradient>
    </Pressable>
  );
};

const TwoConnectsBottomSheet = ({
  bottomSheetRef,
  popupContent,
  matchedUser,
}: {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  popupContent: any;
  matchedUser?: any;
}) => {
  const snapPoints = ['100%', '100%'];
  const navigation = useNavigation();
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetView style={styles.contentContainer}>
        <ImageBackground source={require('../../assets/images/upgradeFreeBG.png')} style={styles.twoConnectsImage} >
          <View style={styles.profileImageWrapper}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/images/genuine.png')}
                style={styles.genuineImage}
                resizeMode="cover"
              />
            </View>
            <Image
              source={require('../../assets/images/premiumbadge.png')}
              style={styles.premiumBadgeImage}
              resizeMode="contain"
            />
          </View>
          <AppText
            text={popupContent?.title}
            textStyle={styles.title}
          />
          {/* <AppText
          text={popupContent?.subtitle}
          textStyle={styles.subtitle}
        /> */}
          <SwipeableUserCard users={matchedUser} />

          <View style={styles.badgeCard}>
            <Image
              source={require('../../assets/images/aigroup.png')}
              style={styles.aiGroupImage}
              resizeMode="cover"
            />
            <View style={styles.badgeTextContainer}>
              <AppText text={popupContent?.badge_text} textStyle={styles.badgeText} />
              <AppText text={popupContent?.badge_subtitle_template} textStyle={styles.badgeSubtitle} />
            </View>
          </View>


          <View style={styles.benefitsList}>
            <AppText text={"✓ " + popupContent?.feature_1} textStyle={styles.benefit} />
            <AppText text={"✓ " + popupContent?.feature_2} textStyle={styles.benefit} />
            <AppText text={"✓ " + popupContent?.feature_3} textStyle={styles.benefit} />
          </View>

          <ShineButton
            popupContent={popupContent}
            onPress={() => {
              (navigation as any).navigate(ROUTES.STACK, {
                screen: ROUTES.UPGRADE,
              });
              bottomSheetRef.current?.close();
            }}
          />
        </ImageBackground>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default TwoConnectsBottomSheet;

const styles = StyleSheet.create({
  handleIndicator: { backgroundColor: 'transparent', },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SIZES.padding * 2,
  },
  bottomSheetBackground: {
    backgroundColor: COLORS.white,
  },
  profileImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZES.height * .15,
    width: SIZES.height * .15,
    borderRadius: SIZES.height * .15/2,
    borderWidth: 4,
    borderColor: COLORS.white,
    overflow: 'hidden',
  },
  genuineImage: {
    width: "100%",
    height: "100%",
  },
  premiumBadgeImage: {
    width: SIZES.width * 0.4,
    height: SIZES.width * 0.12,
    position: 'absolute',
    bottom: -20,
  },
  title: {
    fontSize: fontSize30,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BLACK,
    lineHeight: fontSize30 * 1.2,
  },
  twoConnectsImage: {
    top: -Size16*2,
    gap: Size14,
    width: SIZES.width,
    height: SIZES.height,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Size16,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: fontSize18,
    color: COLORS.darkBlue,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
  },
  lifetimeImage: {
    width: SIZES.width * 0.50,
    height: SIZES.width * 0.30,
  },
  badgeCard: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: Size20,
    borderWidth: 3,
    borderColor: '#EFEBF4',
    padding: Size12,
    gap: Size16,
  },
  aiGroupImage: {
    width: 120,
    height: 48,
    borderRadius: 24,
  },
  badgeTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  benefitsList: {
    alignItems: 'center',
    gap: 6,
  },
  benefit: {
    fontSize: fontSize14,
    color: "#7377F7",
    textAlign: 'center',
    lineHeight: fontSize14 * 1.6,
  },
  // Shine button
  buttonWrapper: {
    width: '100%',
    height: BUTTON_HEIGHT + 6,
    marginTop: 4,
  },
  buttonShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BUTTON_HEIGHT,
    backgroundColor: '#5B21B6',
    borderRadius: 14,
  },
  buttonGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BUTTON_HEIGHT,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
  },
  shimmerGradient: {
    flex: 1,
    width: 80,
  },
  ctaButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: fontSize20,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
  },
  swipeCardWrapper: {
    height: SWIPE_CARD_HEIGHT,
    width: SWIPE_CARD_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeCard: {
    width: SWIPE_CARD_WIDTH,
    height: SWIPE_CARD_HEIGHT,
    borderRadius: Size16,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  swipeCardImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  swipeCardImageRadius: {
    resizeMode: 'cover',
    borderRadius: Size14,
  },
  swipeCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '40%',
    bottom: 0,
  },
  swipeCardInfo: {
    padding: Size12,
    gap: 4,
  },
  swipeCardName: {
    fontSize: fontSize16,
    color: COLORS.white,
    fontWeight: '700',
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
  },
  swipeCardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  swipeCardLocation: {
    fontSize: fontSize12,
    color: COLORS.white,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
  },
  badgeText: {
    fontSize: fontSize16,
    color: COLORS.white,
    fontWeight: '700',
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
  },
  badgeSubtitle: {
    fontSize: fontSize14,
    color: COLORS.white,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
  },
});
