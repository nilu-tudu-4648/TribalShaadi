import React, { useEffect } from 'react';
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
  baseUrl,
  getMatchedUsersUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
  updateUrl,
} from '../../constants/functions';
import { completeUserProfileV2Updated } from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import AppChip2 from '../chips/AppChip2';
import { setMatchedUserApi } from '../../store/reducers/userReducer';

interface MaritalStatusBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  maritalOptions: Array<{ id: string | number; name: string }> | undefined;
  localSelectedStatuses: string[] | undefined;
  setLocalSelectedStatuses: (statuses: string[]) => void;
}

// Backdrop component definition outside render
const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
);

const MaritalStatusBottomSheet: React.FC<MaritalStatusBottomSheetProps> = ({
  bottomSheetRef,
  maritalOptions,
  localSelectedStatuses,
  setLocalSelectedStatuses,
}) => {
  const snapPoints = ['30%', '30%'];
  // console.log('localSelectedStatuses', localSelectedStatuses);
  // console.log('maritalOptions', maritalOptions);
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const handleStatusToggle = (status: string | number) => {
    const statusId = String(status);
    const currentStatuses = Array.isArray(localSelectedStatuses)
      ? localSelectedStatuses.map(s => String(s))
      : [];

    // Find the "Any" option
    const anyOption = maritalOptions?.find(
      option => option.name.toLowerCase() === 'any',
    );
    const anyOptionId = anyOption ? String(anyOption.id) : null;

    let updatedStatuses;

    if (currentStatuses.includes(statusId)) {
      // If clicking on already selected item, remove it
      updatedStatuses = currentStatuses.filter(s => s !== statusId);

      // If no options are selected after removal, automatically select "Any"
      if (updatedStatuses.length === 0 && anyOptionId) {
        updatedStatuses = [anyOptionId];
      }
    } else {
      // If selecting "Any", clear all other selections and only keep "Any"
      if (anyOptionId && statusId === anyOptionId) {
        updatedStatuses = [statusId];
      } else {
        // If selecting any other option while "Any" is selected, remove "Any"
        let newStatuses = [...currentStatuses];
        if (anyOptionId && currentStatuses.includes(anyOptionId)) {
          newStatuses = newStatuses.filter(s => s !== anyOptionId);
        }
        updatedStatuses = [...newStatuses, statusId];
      }
    }
    setLocalSelectedStatuses(updatedStatuses);
  };
  useEffect(() => {
    if (user?.pMaritalStatusId) {
      // Find the "Any" option
      const anyOption = maritalOptions?.find(
        option => option.name.toLowerCase() === 'any',
      );
      const anyOptionId = anyOption ? String(anyOption.id) : null;

      let maritalStatuses: string[] = [];
      if (Array.isArray(user.pMaritalStatusId)) {
        maritalStatuses = user.pMaritalStatusId.map((id: any) => String(id));
      } else if (typeof user.pMaritalStatusId === 'string') {
        // Check if pMaritalStatusId is "any" string
        if (user.pMaritalStatusId === 'any' && anyOptionId) {
          maritalStatuses = [anyOptionId];
        } else {
          // Handles formats like "7,6,5" or with spaces
          maritalStatuses = user.pMaritalStatusId
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
            .map((s: string) => String(s));
        }
      } else if (typeof user.pMaritalStatusId === 'number') {
        maritalStatuses = [user.pMaritalStatusId.toString()];
      }
      setLocalSelectedStatuses(maritalStatuses);
    }
  }, [user, setLocalSelectedStatuses, maritalOptions]);
  const handleApply = async () => {
    try {
      // Clean and filter the marital status IDs
      const safeStatuses = Array.isArray(localSelectedStatuses)
        ? localSelectedStatuses
        : [];
      const cleanedStatuses = safeStatuses.filter(
        status => status && status.toString().trim() !== '',
      ); // Remove empty/null values

      // Find the "Any" option
      const anyOption = maritalOptions?.find(
        option => option.name.toLowerCase() === 'any',
      );
      const anyOptionId = anyOption ? String(anyOption.id) : null;

      // Check if "Any" is selected and convert it to "any" string
      let pMaritalStatusId;
      if (anyOptionId && cleanedStatuses.includes(anyOptionId)) {
        pMaritalStatusId = 'any';
      } else {
        pMaritalStatusId = cleanedStatuses.join(',');
      }

      const requestBody = {
        id: user.id,
        pMaritalStatusId: pMaritalStatusId,
      };
      console.log('requestBody', requestBody);
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
      bottomSheetRef.current?.close();
      console.log('loading ended');
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
      backdropComponent={renderBackdrop}
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
              <AppChip2
                key={option.id}
                title={option.name}
                isSelected={
                  Array.isArray(localSelectedStatuses) &&
                  localSelectedStatuses.includes(String(option.id))
                }
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

export default React.memo(MaritalStatusBottomSheet);

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
    fontFamily: Fonts.PRODUCT_SANS_BOLD,
    color: COLORS.black,
  },
  headerSubtitle: {
    fontSize: fontSize14,
    fontFamily: Fonts.PRODUCT_SANS_REGULAR,
    color: COLORS.textInactive,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Size12,
  },
  optionChip: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Size16,
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
    fontFamily: Fonts.PRODUCT_SANS_BOLD,
  },
});
