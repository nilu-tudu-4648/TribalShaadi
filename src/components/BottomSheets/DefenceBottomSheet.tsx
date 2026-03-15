import { Image, StyleSheet } from 'react-native';
import React from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { COLORS } from '../../constants/AppColors';
import {
  SIZES,
  Size50
} from '../../constants/Sizes';

const DefenceBottomSheet = ({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}) => {
  const snapPoints = ['60%', '60%'];
  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      // handleApply();
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
      backgroundStyle={{  }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Image
          source={require('../../assets/images/Filter.png')}
          style={styles.reportImage}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default DefenceBottomSheet;

const styles = StyleSheet.create({
  handleIndicator: {
    backgroundColor: COLORS.white,
    width: 40,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: "100%",
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    borderTopLeftRadius: Size50 * 2,
    borderTopRightRadius: Size50 * 2,
  },
  reportImage: {
    width: SIZES.width,
    resizeMode: 'contain',
  },
});
