import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
import AppDropdown from '../AppDropdown';
import AppPickerModal from '../AppPickerModal';
import { COLORS } from '../../constants/AppColors';
import {
  fontSize14,
  fontSize16,
  fontSize18,
  fontSize22,
  Size12,
  Size16,
  Size20,
  Size25,
  Size50,
  Size8,
} from '../../constants/Sizes';
import Fonts from '../../constants/Fonts';
import AppButton from '../AppButton';
import GradientLoader from '../GradientLoader';

interface ReportBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  onReport: (reportReason: string) => void;
}

const reportOptions = [
  'Spam',
  'Inappropriate Content',
  'Fake Profile',
  'Harassment',
  'Other',
];

const ReportBottomSheet: React.FC<ReportBottomSheetProps> = ({
  bottomSheetRef,
  onReport,
}) => {
  const snapPoints = ['35%', '35%'];
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleReport = () => {
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      setReportSubmitted(true);
    }, 2000);
    if (selectedReason) {
      onReport(selectedReason);
      setSelectedReason(''); // Reset after reporting
    }
  };

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      bottomSheetRef.current?.close();
      setReportSubmitted(false);
      setSelectedReason(''); // Reset when closed
    }
  };

  return (
    <>
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
          {loader ? (
            <View style={styles.loaderContainer}>
              <GradientLoader size={Size50} />
            </View>
          ) : reportSubmitted ? (
            <View style={styles.reportSubmittedContainer}>
              <Image
                source={require('../../assets/images/shield2.png')}
                style={styles.reportSubmittedImage}
              />
              <AppText
                text="Submitted Successfully"
                textStyle={{
                  ...styles.reportSubmittedText,
                  fontSize: fontSize22,
                  color: COLORS.black,
                }}
              />
              <AppText
                text="Thank you for your report. Our team will review this profile and take appropriate action if needed. Your safety is our priority."
                textStyle={styles.reportSubmittedText}
              />
            </View>
          ) : (
            <>
              <View style={styles.headerContainer}>
                <AppText
                  text="YOU are safe with us! We will never inform this profile about your safety concern & this reporting shall always be anonymous"
                  textStyle={styles.headerSubtitle}
                />
              </View>
              <AppDropdown
                label="Reason"
                selectedValue={selectedReason}
                placeholder="Select a reason"
                onPress={() => setIsPickerVisible(true)}
                dropdownStyle={styles.dropdownStyle}
              />
              <AppButton
                title="Report"
                onPress={handleReport}
                textStyle={!selectedReason ? styles.reportButtonTextDisabled : styles.reportButtonText}
                buttonStyle={[
                  styles.reportButton,
                  !selectedReason && styles.reportButtonDisabled,
                ]}
                isButtonDisabled={!selectedReason}
              />
            </>
          )}
        </BottomSheetView>
      </BottomSheet>

      <AppPickerModal
        visible={isPickerVisible}
        title="Select Report Reason"
        items={reportOptions}
        selectedValue={selectedReason}
        onSelect={setSelectedReason}
        onClose={() => setIsPickerVisible(false)}
      />
    </>
  );
};

export default ReportBottomSheet;

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: Size20,
    borderTopRightRadius: Size20,
  },
  handleIndicator: { backgroundColor: COLORS.divider, width: 40, height: 4 },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Size16,
    paddingVertical: Size12,
    gap: Size20,
  },
  headerContainer: { alignItems: 'flex-start', gap: Size12 },
  headerTitle: {
    fontSize: fontSize18,
    fontFamily: Fonts.PRODUCT_SANS_BOLD,
    color: COLORS.textBlack,
  },
  headerSubtitle: {
    fontSize: fontSize14,
    fontFamily: Fonts.PRODUCT_SANS_REGULAR,
    color: COLORS.black,
  },
  reportButton: {
    backgroundColor: COLORS.violet,
    borderRadius: Size25,
  },
  reportButtonDisabled: {
    backgroundColor: COLORS.disabledBG,
  },
  reportButtonTextDisabled: {
    color: COLORS.disabledText,
  },
  reportButtonText: {
    color: COLORS.white,
  },
  dropdownStyle: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: Size8,
  },
  reportSubmittedContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    gap: Size12,
  },
  reportSubmittedText: {
    fontSize: fontSize16,
    color: COLORS.greytext,
    textAlign: 'center',
  },
  reportSubmittedImage: {
    width: Size50 * 2,
    height: Size50 * 1.5,
    resizeMode: 'contain',
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingTop: Size50*1.5,
  },
});
