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
import { getUserDetailsApi, getUserDetailsUrl, setReducerLoadingfalse, updateUrl } from '../../constants/functions';
import { completeUserProfileV2Updated } from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';

interface HeightRangeBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  selectedHeightRange: { min: number; max: number }; // in total inches
  onSelectionChange: (range: { min: number; max: number }) => void;
  onApply: (range: { min: number; max: number }) => void;
  heightOptions: any[];
}

const formatHeight = (totalInches: number) => {
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}ft ${inches}in`;
};

const HeightRangeBottomSheet: React.FC<HeightRangeBottomSheetProps> = ({
  bottomSheetRef,
  selectedHeightRange,
  onSelectionChange,
  onApply,
  heightOptions
}) => {
  const snapPoints = ['30%', '30%'];
  const [localHeightRange, setLocalHeightRange] = useState(selectedHeightRange);
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const MIN_HEIGHT_INCHES = 4 * 12; // 4ft 0in
  const MAX_HEIGHT_INCHES = 7 * 12; // 7ft 0in
  const SLIDER_WIDTH = Dimensions.get('window').width - 64;
  const THUMB_SIZE = Size25;

  const minThumbPosition = useSharedValue(
    ((localHeightRange.min - MIN_HEIGHT_INCHES) / (MAX_HEIGHT_INCHES - MIN_HEIGHT_INCHES)) * SLIDER_WIDTH
  );
  const maxThumbPosition = useSharedValue(
    ((localHeightRange.max - MIN_HEIGHT_INCHES) / (MAX_HEIGHT_INCHES - MIN_HEIGHT_INCHES)) * SLIDER_WIDTH
  );

  const startXMin = useSharedValue(0);
  const startXMax = useSharedValue(0);

  const updateHeightRange = (newMin: number, newMax: number) => {
    const range = { min: newMin, max: newMax };
    setLocalHeightRange(range);
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
      
      const newMinHeight = Math.round(
        MIN_HEIGHT_INCHES + (newPosition / SLIDER_WIDTH) * (MAX_HEIGHT_INCHES - MIN_HEIGHT_INCHES)
      );
      runOnJS(updateHeightRange)(newMinHeight, localHeightRange.max);
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
      
      const newMaxHeight = Math.round(
        MIN_HEIGHT_INCHES + (newPosition / SLIDER_WIDTH) * (MAX_HEIGHT_INCHES - MIN_HEIGHT_INCHES)
      );
      runOnJS(updateHeightRange)(localHeightRange.min, newMaxHeight);
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
      const requestBody = {
        id: user.id,
        pFromHeight: localHeightRange.min,
        pToHeight: localHeightRange.max,
      };
      console.log('requestBody', requestBody);
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      bottomSheetRef.current?.close();
      onApply(localHeightRange);
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
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.headerContainer}>
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
            text={`${formatHeight(localHeightRange.min)} - ${formatHeight(localHeightRange.max)}`}
            textStyle={styles.heightDisplayText}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default HeightRangeBottomSheet;

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