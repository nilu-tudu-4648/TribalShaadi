import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
import AppChip from '../AppChip';
import { COLORS } from '../../constants/AppColors';
import {
  fontSize14,
  fontSize16,
  fontSize18,
  Size12,
  Size14,
  Size16,
  Size20,
  Size8,
} from '../../constants/Sizes';
import Fonts from '../../constants/Fonts';

interface SettleDownBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  selectedJobTypes: string[];
  onApply: (jobTypes: string[]) => void;
}

const jobTypeOptions = [
  'Government / Public Sector',
  'Business / Self Employed',
  'Private Company',
  'Civil Services',
  'Defence',
  'Any',
];

const SettleDownBottomSheet: React.FC<SettleDownBottomSheetProps> = ({
  bottomSheetRef,
  selectedJobTypes,
  onApply,
}) => {
  const snapPoints = ['50%'];
  const [localSelected, setLocalSelected] =
    useState<string[]>(selectedJobTypes);

  useEffect(() => {
    setLocalSelected(selectedJobTypes);
  }, [selectedJobTypes]);

  const handleToggle = (jobType: string) => {
    let updated: string[];
    if (jobType === 'Any') {
      updated = localSelected.includes('Any') ? [] : ['Any'];
    } else {
      const anyIndex = localSelected.indexOf('Any');
      if (anyIndex > -1) {
        updated = [jobType];
      } else {
        if (localSelected.includes(jobType)) {
          updated = localSelected.filter(j => j !== jobType);
        } else {
          updated = [...localSelected, jobType];
        }
      }
    }
    setLocalSelected(updated);
  };

  const handleApply = () => {
    onApply(localSelected);
    bottomSheetRef.current?.close();
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
          <AppText text="Planning to Settle Down" textStyle={styles.headerTitle} />
          <AppText
            text="You can select mutiple options"
            textStyle={styles.headerSubtitle}
          />
        </View>

        <View style={styles.chipsContainer}>
          {jobTypeOptions.map(option => (
            <AppChip
              key={option}
              title={option}
              isSelected={localSelected?.includes(option)}
              onPress={() => handleToggle(option)}
            />
          ))}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default SettleDownBottomSheet;

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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Size12,
  },
  applyButton: {
    backgroundColor: COLORS.black,
    paddingVertical: Size14,
    borderRadius: Size12,
    alignItems: 'center',
    paddingBottom: Size8,
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: fontSize16,
    fontFamily: Fonts.OPEN_SANS_SEMI_BOLD,
  },
});
