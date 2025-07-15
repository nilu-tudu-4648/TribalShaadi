import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
  fontSize18,
  Size12,
  Size16,
  Size20,
} from '../../constants/Sizes';
import Fonts from '../../constants/Fonts';
import AppButton from '../AppButton';

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
  const snapPoints = ['50%', '50%'];
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const handleReport = () => {
    if (selectedReason) {
      onReport(selectedReason);
      bottomSheetRef.current?.close();
      setSelectedReason(''); // Reset after reporting
    }
  };

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
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
          <View style={styles.headerContainer}>
            {/* <AppText text="Report Profile" textStyle={styles.headerTitle} /> */}
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
          />

          <AppButton
            title="Report"
            onPress={handleReport}
            textStyle={styles.reportButtonText}
            buttonStyle={[
              styles.reportButton,
              !selectedReason && styles.reportButtonDisabled
            ]}
            isButtonDisabled={!selectedReason}
          />
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
    fontFamily: Fonts.OPEN_SANS_BOLD,
    color: COLORS.textBlack,
  },
  headerSubtitle: {
    fontSize: fontSize14,
    fontFamily: Fonts.OPEN_SANS_REGULAR,
    color: COLORS.textInactive,
  },
  reportButton: {
    backgroundColor: COLORS.violet,
    borderRadius: Size12,
  },
  reportButtonDisabled: {
    backgroundColor: COLORS.textInactive,
  },
  reportButtonText: {
    color: COLORS.white,
  },
});
