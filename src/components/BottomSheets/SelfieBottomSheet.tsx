import { Image, StyleSheet, View } from 'react-native';
import React from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
import { COLORS } from '../../constants/AppColors';
import {
  Size20,
  SIZES,
  Size16,
  fontSize20,
  fontSize32,
} from '../../constants/Sizes';
import { globalStyles } from '../../constants/globalStyles';
import AppButton from '../AppButton';
import { ROUTES } from '../../constants/data';
import { useNavigation } from '@react-navigation/native';

const SelfieBottomSheet = ({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}) => {
  const snapPoints = ['45%', '45%'];
  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      // handleApply();
    }
  };
  const navigation = useNavigation();
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
        <AppText
          text="Show them you’re the real deal with 
-- AI Selfie Verification"
          textStyle={[
            styles.headerTitle,
            { fontSize: fontSize32, fontWeight: '900',width: '100%' },
          ]}
        />
        <View style={styles.imageContainer}>
          <AppText
            text="This helps us keep the App authentic & safe — just like you want it to be."
            textStyle={styles.headerTitle}
          />
          <Image
            source={require('../../assets/images/tick.png')}
            style={styles.reportImage}
          />
        </View>
        <AppButton
          title="Get Verified"
          onPress={() => {
            (navigation as any).navigate(ROUTES.STACK, {
              screen: ROUTES.SELFIE_VERIFY,
            });
            bottomSheetRef.current?.close();
          }}
          buttonStyle={[globalStyles.continueButton,{backgroundColor: COLORS.violet,bottom:0}]}
          textStyle={[globalStyles.continueButtonText,{color: COLORS.white}]}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default SelfieBottomSheet;

const styles = StyleSheet.create({
  handleIndicator: { backgroundColor: COLORS.divider, width: 40, height: 4 },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: Size16,
    gap: Size20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize20,
    color: COLORS.black,
    textAlign: 'left',
    width: '90%',
  },
  bottomSheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: Size20,
    borderTopRightRadius: Size20,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reportImage: {
    width: SIZES.width * 0.1,
    height: SIZES.width * 0.1,
    resizeMode: 'contain',
  },
});
