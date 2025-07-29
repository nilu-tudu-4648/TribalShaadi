import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
import { COLORS } from '../../constants/AppColors';
import {
  fontSize18,
  Size20,
  SIZES,
  Size25,
  Size50,
  Size16,
} from '../../constants/Sizes';

const AlertBottomSheet = ({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}) => {
  const snapPoints = ['50%', '50%'];
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
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/genuine.png')}
            style={styles.reportImage}
          />
        </View>
        <AppText
          text="Upload genuine, recent photos of yours. It should not display nudity, scenery, landscapes, celebrities, baby or animal pictures."
          textStyle={styles.headerTitle}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default AlertBottomSheet;

const styles = StyleSheet.create({
  handleIndicator: { backgroundColor: COLORS.divider, width: 40, height: 4 },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Size25,
    paddingVertical: Size16,
    gap: Size20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSize18,
    color: COLORS.textBlack,
    textAlign: 'center',
  },
  bottomSheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: Size20,
    borderTopRightRadius: Size20,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCBFFF',
    width: '60%',
    borderTopLeftRadius: Size50 * 2,
    borderTopRightRadius: Size50 * 2,
  },
  reportImage: {
    width: SIZES.width,
    height: 200,
    resizeMode: 'contain',
  },
});
