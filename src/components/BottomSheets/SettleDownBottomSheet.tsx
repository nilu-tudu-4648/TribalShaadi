import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
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
import { SETTLING_DOWN_OPTIONS } from '../../constants/data';
import { getUserDetailsApi, getUserDetailsUrl, setReducerLoadingfalse, updateUrl } from '../../constants/functions';
import { completeUserProfileV2Updated } from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import AppChip2 from '../chips/AppChip2';

interface SettleDownBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  selectedsettleTypes: string[];
}

const SettleDownBottomSheet: React.FC<SettleDownBottomSheetProps> = ({
  bottomSheetRef,
  selectedsettleTypes,
}) => {
  const snapPoints = ['50%'];
  const [localSelected, setLocalSelected] =
    useState<string[]>(selectedsettleTypes);
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  useEffect(() => {
    setLocalSelected(selectedsettleTypes);
  }, [selectedsettleTypes]);

  const handleToggle = (settleType: string) => {
    let updated: string[];
    if (settleType === 'Any') {
      updated = localSelected.includes('Any') ? [] : ['Any'];
    } else {
      const anyIndex = localSelected.indexOf('Any');
      if (anyIndex > -1) {
        updated = [settleType];
      } else {
        if (localSelected.includes(settleType)) {
          updated = localSelected.filter(j => j !== settleType);
        } else {
          updated = [...localSelected, settleType];
        }
      }
    }
    setLocalSelected(updated);
  };

  const handleApply = async () => {
    try {
      const requestBody = {
        id: user.id,
        pSettlingDown: localSelected,
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
          <AppText text="Planning to Settle Down" textStyle={styles.headerTitle} />
          <AppText
            text="You can select mutiple options"
            textStyle={styles.headerSubtitle}
          />
        </View>

        <View style={styles.chipsContainer}>
          {SETTLING_DOWN_OPTIONS.map(option => (
            <AppChip2
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
