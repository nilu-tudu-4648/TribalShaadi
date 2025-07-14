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
  fontSize16,
  fontSize20,
  Size12,
  Size14,
  Size16,
  Size20,
  Size25,
  Size8,
} from '../../constants/Sizes';
import Fonts from '../../constants/Fonts';
import {
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
  updateUrl,
} from '../../constants/functions';
import { completeUserProfileV2Updated } from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';

interface MaritalStatusBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  selectedStatuses: string[];
  onSelectionChange: (statuses: string[]) => void;
  onApply: (statuses: string[]) => void;
  maritalOptions: string[] | undefined;
}

const MaritalStatusBottomSheet: React.FC<MaritalStatusBottomSheetProps> = ({
  bottomSheetRef,
  selectedStatuses,
  onSelectionChange,
  onApply,
  maritalOptions,
}) => {
  const snapPoints = ['30%', '30%'];
  const [localSelectedStatuses, setLocalSelectedStatuses] =
    useState<string[]>(selectedStatuses);
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const handleStatusToggle = (status: string) => {
    let updatedStatuses;
    if (localSelectedStatuses.includes(status)) {
      updatedStatuses = localSelectedStatuses.filter(s => s !== status);
    } else {
      updatedStatuses = [...localSelectedStatuses, status];
    }
    setLocalSelectedStatuses(updatedStatuses);
    onSelectionChange(updatedStatuses);
  };

  const handleApply = async () => {
    try {
      const requestBody = {
        id: user.id,
        pMaritalStatusId: localSelectedStatuses,
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

      onApply(localSelectedStatuses);
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
        <View style={styles.mainContent}>
          <View style={styles.headerContainer}>
            <AppText text="Marital Status" textStyle={styles.headerTitle} />
            <AppText
              text="You can select multiple options"
              textStyle={styles.headerSubtitle}
            />
          </View>

          <View style={styles.optionsContainer}>
            {maritalOptions?.map((option: any) => (
              <AppChip
                key={option.id}
                title={option.name}
                isSelected={localSelectedStatuses.includes(option.id)}
                onPress={() => handleStatusToggle(option.id)}
                style={styles.optionChip}
              />
            ))}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default MaritalStatusBottomSheet;

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
  },
  mainContent: {
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
    justifyContent: 'space-between',
    rowGap: Size12,
  },
  optionChip: {
    minWidth: '30%',
    alignItems: 'center',
    paddingHorizontal: Size12,
  },
  applyButton: {
    backgroundColor: COLORS.black,
    paddingVertical: Size14,
    borderRadius: Size12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: fontSize16,
    fontFamily: Fonts.OPEN_SANS_SEMI_BOLD,
  },
});
