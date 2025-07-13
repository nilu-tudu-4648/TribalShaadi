import React, { useState } from 'react';
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
import { COLORS } from '../../constants/AppColors';
import {
  fontSize16,
  fontSize20,
  Size12,
  Size16,
  Size20,
  Size25,
  Size8,
} from '../../constants/Sizes';
import Fonts from '../../constants/Fonts';

interface AgeRangeBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  selectedAgeRange: { min: number; max: number };
  onSelectionChange: (range: { min: number; max: number }) => void;
  onApply: (range: { min: number; max: number }) => void;
}

const AgeRangeBottomSheet: React.FC<AgeRangeBottomSheetProps> = ({
  bottomSheetRef,
  selectedAgeRange,
  onSelectionChange,
  onApply,
}) => {
  const snapPoints = ['30%', '30%'];
  const [localAgeRange, setLocalAgeRange] = useState(selectedAgeRange);

  const MIN_AGE = 18;
  const MAX_AGE = 65;
  const SLIDER_WIDTH = Dimensions.get('window').width - 64; // Account for padding
  const THUMB_SIZE = 24;

  const minThumbPosition = useSharedValue(
    ((localAgeRange.min - MIN_AGE) / (MAX_AGE - MIN_AGE)) * SLIDER_WIDTH,
  );
  const maxThumbPosition = useSharedValue(
    ((localAgeRange.max - MIN_AGE) / (MAX_AGE - MIN_AGE)) * SLIDER_WIDTH,
  );

  const startXMin = useSharedValue(0);
  const startXMax = useSharedValue(0);

  const updateAgeRange = (newMin: number, newMax: number) => {
    const range = { min: newMin, max: newMax };
    setLocalAgeRange(range);
    onSelectionChange(range);
  };

  const minPanGesture = Gesture.Pan()
    .onStart(() => {
      startXMin.value = minThumbPosition.value;
    })
    .onUpdate(event => {
      const newPosition = clamp(
        startXMin.value + event.translationX,
        0,
        maxThumbPosition.value - THUMB_SIZE,
      );
      minThumbPosition.value = newPosition;
      const newMinAge = Math.round(
        MIN_AGE + (newPosition / SLIDER_WIDTH) * (MAX_AGE - MIN_AGE),
      );
      runOnJS(updateAgeRange)(newMinAge, localAgeRange.max);
    });

  const maxPanGesture = Gesture.Pan()
    .onStart(() => {
      startXMax.value = maxThumbPosition.value;
    })
    .onUpdate(event => {
      const newPosition = clamp(
        startXMax.value + event.translationX,
        minThumbPosition.value + THUMB_SIZE,
        SLIDER_WIDTH,
      );
      maxThumbPosition.value = newPosition;
      const newMaxAge = Math.round(
        MIN_AGE + (newPosition / SLIDER_WIDTH) * (MAX_AGE - MIN_AGE),
      );
      runOnJS(updateAgeRange)(localAgeRange.min, newMaxAge);
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

  const handleApply = () => {
    onApply(localAgeRange);
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
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <AppText text="Age" textStyle={styles.headerTitle} />
        </View>

        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <Animated.View style={[styles.activeTrack, activeTrackStyle]} />

            <GestureDetector gesture={minPanGesture}>
              <Animated.View style={[styles.thumb, minThumbStyle]} />
            </GestureDetector>

            <GestureDetector gesture={maxPanGesture}>
              <Animated.View style={[styles.thumb, maxThumbStyle]} />
            </GestureDetector>
          </View>
        </View>

        <View style={styles.ageDisplayContainer}>
          <AppText
            text={`${localAgeRange.min} - ${localAgeRange.max} years`}
            textStyle={styles.ageDisplayText}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default AgeRangeBottomSheet;

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: Size20,
    borderTopRightRadius: Size20,
  },
  handleIndicator: {
    backgroundColor: COLORS.divider,
    width: 40,
    height: 8,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Size16,
    paddingVertical: Size12,
    justifyContent: 'space-between',
    gap: Size25,
  },
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
    width: Size25,
    height: Size25,
    borderRadius: Size12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.white,
    position: 'absolute',
    top: -10,
    elevation: 2,
  },
  ageDisplayContainer: {
    alignItems: 'center',
  },
  ageDisplayText: {
    fontSize: fontSize16,
    fontFamily: Fonts.OPEN_SANS_BOLD,
    color: COLORS.textBlack,
    fontWeight: 'bold',
  },
});
