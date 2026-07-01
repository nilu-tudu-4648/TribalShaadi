import { Image, StyleSheet, View, Pressable, Vibration, Platform } from 'react-native';
import React, { useEffect } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
import { COLORS } from '../../constants/AppColors';
import { Size20, SIZES, Size16, fontSize14, fontSize20, fontSize30, fontSize18 } from '../../constants/Sizes';
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
} from 'react-native-reanimated';

const BUTTON_HEIGHT = 56;

const ShineButton = ({ onPress }: { onPress: () => void }) => {
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
        <AppText text="Get Lifetime Free" textStyle={styles.ctaButtonText} />
      </LinearGradient>
    </Pressable>
  );
};

const TwoConnectsBottomSheet = ({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}) => {
  const snapPoints = ['65%', '65%'];
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
        <AppText
          text="You've used your 2 free Connect Requests."
          textStyle={styles.title}
        />
        <AppText
          text="Find the right person without limits"
          textStyle={styles.subtitle}
        />

        <Image
          source={require('../../assets/images/lifetime.png')}
          style={styles.lifetimeImage}
          resizeMode="contain"
        />

        <View style={styles.benefitsList}>
          <AppText text="✓  Unlimited Connect Requests" textStyle={styles.benefit} />
          <AppText text="✓  See Who's Interested In You" textStyle={styles.benefit} />
          <AppText text="✓  Complete Contact Access" textStyle={styles.benefit} />
        </View>

        <ShineButton
          onPress={() => {
            (navigation as any).navigate(ROUTES.STACK, {
              screen: ROUTES.UPGRADE,
            });
            bottomSheetRef.current?.close();
          }}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default TwoConnectsBottomSheet;

const styles = StyleSheet.create({
  handleIndicator: { backgroundColor: COLORS.divider, width: 40, height: 4 },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: Size16,
    gap: Size16,
  },
  bottomSheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: Size20,
    borderTopRightRadius: Size20,
  },
  title: {
    fontSize: fontSize30,
    fontWeight: '700',
    color: COLORS.darkBlue,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BLACK,
    lineHeight: fontSize30 * 1.2,
  },
  subtitle: {
    fontSize: fontSize18,
    color: COLORS.darkBlue,
    textAlign: 'center',
    fontFamily: FONT_FAMILY.PRODUCT_SANS_REGULAR,
  },
  lifetimeImage: {
    width: SIZES.width * 0.70,
    height: SIZES.width * 0.50,
  },
  benefitsList: {
    alignItems: 'center',
    gap: 6,
  },
  benefit: {
    fontSize: fontSize14,
    color: COLORS.greyText2,
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
});
