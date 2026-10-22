import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  clamp,
} from 'react-native-reanimated';
import AppText from '../AppText';
import PremiumCrown from '../PremiumCrown';
import PremiumGateOverlay, { useIsPremium } from '../PremiumGateOverlay';
import { COLORS } from '../../constants/AppColors';
import {
  fontSize16,
  fontSize20,
  Size16,
  Size25,
  Size8,
} from '../../constants/Sizes';
import Fonts from '../../constants/Fonts';
import {
  formatHeightInFeettoInches,
  baseUrl,
  getMatchedUsersUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
  updateUrl,
} from '../../constants/functions';
import { completeUserProfileV2Updated } from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setMatchedUserApi } from '../../store/reducers/userReducer';
import { globalStyles } from '../../constants/globalStyles';

interface HeightRangeBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  heightOptions: any[];
}

const HeightRangeBottomSheet: React.FC<HeightRangeBottomSheetProps> = ({
  bottomSheetRef,
  heightOptions,
}) => {
  const formatHeightFromOptions = (heightInInches: number) => {
    const match = heightOptions.find(
      opt => parseInt(opt.name) === heightInInches,
    );
    if (match) {
      return formatHeightInFeettoInches(parseInt(match.name));
    }
    return formatHeightInFeettoInches(heightInInches);
  };

  const snapPoints = ['30%', '30%'];
  const [localHeightRange, setLocalHeightRange] = useState({ min: 53, max: 77 });

  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const MIN_HEIGHT_INCHES = 4 * 12; // 4ft 0in
  const MAX_HEIGHT_INCHES = 7 * 12; // 7ft 0in
  const MIN_RANGE = 5; // Minimum 5 inches gap
  const SLIDER_WIDTH = Dimensions.get('window').width - 64;
  const THUMB_SIZE = Size25;
  useEffect(() => {
    if (user.pFromHeight && user.pToHeight) {
      // setLocalHeightRange({ min: user.pFromHeight, max: user.pToHeight });
    }
  }, [user]);
  const minThumbPosition = useSharedValue(
    ((localHeightRange.min - MIN_HEIGHT_INCHES) /
      (MAX_HEIGHT_INCHES - MIN_HEIGHT_INCHES)) *
      SLIDER_WIDTH,
  );
  const maxThumbPosition = useSharedValue(
    ((localHeightRange.max - MIN_HEIGHT_INCHES) /
      (MAX_HEIGHT_INCHES - MIN_HEIGHT_INCHES)) *
      SLIDER_WIDTH,
  );

  const startXMin = useSharedValue(0);
  const startXMax = useSharedValue(0);

  const updateHeightRange = (newMin: number, newMax: number) => {
    // Ensure minimum 5-inch gap
    if (newMax - newMin < MIN_RANGE) {
      return; // Don't update if the range is less than 5 inches
    }
    
    const range = { min: newMin, max: newMax };
    setLocalHeightRange(range);
  };

  const isPremium = useIsPremium('primary');
  const minPanGesture = Gesture.Pan()
    .enabled(isPremium)
    .onStart(() => {
      startXMin.value = minThumbPosition.value;
    })
    .onUpdate(event => {
      const newPosition = clamp(
        startXMin.value + event.translationX,
        0,
        maxThumbPosition.value - THUMB_SIZE,
      );

      const newMinHeight = Math.round(
        MIN_HEIGHT_INCHES +
          (newPosition / SLIDER_WIDTH) *
            (MAX_HEIGHT_INCHES - MIN_HEIGHT_INCHES),
      );
      
      // Ensure minimum 5-inch gap
      if (localHeightRange.max - newMinHeight >= MIN_RANGE) {
        minThumbPosition.value = newPosition;
        runOnJS(updateHeightRange)(newMinHeight, localHeightRange.max);
      }
    });

  const maxPanGesture = Gesture.Pan()
    .enabled(isPremium)
    .onStart(() => {
      startXMax.value = maxThumbPosition.value;
    })
    .onUpdate(event => {
      const newPosition = clamp(
        startXMax.value + event.translationX,
        minThumbPosition.value + THUMB_SIZE,
        SLIDER_WIDTH,
      );

      const newMaxHeight = Math.round(
        MIN_HEIGHT_INCHES +
          (newPosition / SLIDER_WIDTH) *
            (MAX_HEIGHT_INCHES - MIN_HEIGHT_INCHES),
      );
      
      // Ensure minimum 5-inch gap
      if (newMaxHeight - localHeightRange.min >= MIN_RANGE) {
        maxThumbPosition.value = newPosition;
        runOnJS(updateHeightRange)(localHeightRange.min, newMaxHeight);
      }
    });

  const minThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: minThumbPosition.value }],
  }));

  const maxThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: maxThumbPosition.value }],
  }));

  const activeTrackStyle = useAnimatedStyle(() => ({
    left: minThumbPosition.value + THUMB_SIZE / 2,
    width: maxThumbPosition.value - minThumbPosition.value,
  }));

  const handleApply = async () => {
    try {
      const cmToInches = (cm: number) => Math.round(cm / 2.54);
      const inchesToCm = (inches: number) => Math.round(inches * 2.54);

      // Try to find matching options from heightOptions by converting cm to inches
      const fromOption = heightOptions.find(
        opt => cmToInches(Number(opt.name)) === localHeightRange.min,
      );
      const toOption = heightOptions.find(
        opt => cmToInches(Number(opt.name)) === localHeightRange.max,
      );

      if (!fromOption || !toOption) {
      }

      const requestBody = {
        id: user.id,
        pFromHeight:
          fromOption?.name ?? inchesToCm(localHeightRange.min).toString(),
        pToHeight:
          toOption?.name ?? inchesToCm(localHeightRange.max).toString(),
      };


      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
    } finally {
      dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
        bottomSheetRef.current?.close();
    }
  };

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      handleApply();
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={handleSheetChanges}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      handleIndicatorStyle={globalStyles.handleIndicator}
      backgroundStyle={globalStyles.bottomSheetBackground}
    >
      <BottomSheetView style={[globalStyles.contentContainer,{gap: Size25}]}>
        <View style={styles.headerContainer}>
          <PremiumCrown />
          <AppText text="Height" textStyle={styles.headerTitle} />
        </View>

        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <Animated.View style={[styles.activeTrack, activeTrackStyle]} />
            <GestureDetector gesture={minPanGesture}>
              <Animated.View style={[styles.minThumb, minThumbStyle]} />
            </GestureDetector>

            <GestureDetector gesture={maxPanGesture}>
              <Animated.View style={[styles.thumb, maxThumbStyle]} />
            </GestureDetector>
          </View>
        </View>

        <View style={styles.heightDisplayContainer}>
          <AppText
            text={`${formatHeightFromOptions(
              localHeightRange.min,
            )} - ${formatHeightFromOptions(localHeightRange.max)}`}
            textStyle={styles.heightDisplayText}
          />
        </View>
      </BottomSheetView>
      <PremiumGateOverlay bottomSheetRef={bottomSheetRef} group="primary" />
    </BottomSheet>
  );
};

export default HeightRangeBottomSheet;

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'flex-start',
    gap: Size8,
  },
  headerTitle: {
    fontSize: fontSize20,
    fontFamily: Fonts.OPEN_SANS_SEMI_BOLD,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  sliderContainer: {
    paddingHorizontal: Size16,
  },
  sliderTrack: {
    height: Size8,
    backgroundColor: COLORS.divider,
    borderRadius: 2,
    position: 'relative',
  },
  activeTrack: {
    height: Size8,
    backgroundColor: COLORS.violet,
    borderRadius: 2,
    position: 'absolute',
    top: 0,
  },

  thumb: {
    width: Size25, // Use consistent size
    height: Size25,
    borderRadius: Size25 / 2, // This makes it perfectly round
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    position: 'absolute',
    top: -8,
    elevation: 2,
  },
  minThumb: {
    width: Size25, // Use consistent size
    height: Size25,
    borderRadius: Size25 / 2, // This makes it perfectly round
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    position: 'absolute',
    top: -8,
    elevation: 2,
  },
  heightDisplayContainer: {
    alignItems: 'center',
  },
  heightDisplayText: {
    fontSize: fontSize16,
    fontFamily: Fonts.OPEN_SANS_BOLD,
    color: COLORS.textBlack,
    fontWeight: 'bold',
  },
});
