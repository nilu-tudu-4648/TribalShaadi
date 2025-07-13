import React, { useState } from 'react';
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
  Size16,
  Size20,
  Size25,
  Size8,
  Size12,
  fontSize20,
} from '../../constants/Sizes';
import Fonts from '../../constants/Fonts';

interface ReligionBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  selectedReligion: string;
  onSelectionChange: (religion: string) => void;
  onApply: (religion: string) => void;
}

const ReligionBottomSheet: React.FC<ReligionBottomSheetProps> = ({
  bottomSheetRef,
  selectedReligion,
  onSelectionChange,
  onApply,
}) => {
  const snapPoints = ['30%', '50%'];
  const [localSelectedReligion, setLocalSelectedReligion] = useState<string>(selectedReligion);

  const religionOptions = [
    'Christian AG Church',
    'Christian CNI',
    'Christian CSI',
    'Christian GEL',
    'Christian NWGEL',
    'Christian Others',
    'Christian Pentecostal Church',
    'Sarna',
    'Gond',
    'Pradhan',
    'Tribal Belief',
  ];

  const handleStatusSelect = (religion: string) => {
    setLocalSelectedReligion(religion);
    onSelectionChange(religion);
  };

  const handleApply = () => {
    onApply(localSelectedReligion);
  };

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      handleApply();
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // -1 means hidden
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
          <AppText text="Religion" textStyle={styles.headerTitle} />
          <AppText 
            text="Select one which applies" 
            textStyle={styles.headerSubtitle} 
          />
        </View>

        <View style={styles.optionsContainer}>
          {religionOptions.map((option) => (
            <AppChip
              key={option}
              title={option}
              isSelected={localSelectedReligion === option}
              onPress={() => handleStatusSelect(option)}
              style={styles.optionChip}
            />
          ))}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default ReligionBottomSheet;

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: Size20,
    borderTopRightRadius: Size20,
  },
  handleIndicator: {
    backgroundColor: COLORS.divider,
    width: 40,
    height: 4,
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
  headerSubtitle: {
    fontSize: fontSize14,
    fontFamily: Fonts.OPEN_SANS_REGULAR,
    color: COLORS.textInactive,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Size12,
  },
  optionChip: {
    alignItems: 'center',
  },
}); 