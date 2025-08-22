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
import {
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
  updateUrl,
  baseUrl,
  getMatchedUsersUrl,
} from '../../constants/functions';
import { completeUserProfileV2Updated } from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import AppChip2 from '../chips/AppChip2';
import { setMatchedUserApi } from '../../store/reducers/userReducer';

interface JobTypeBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  jobTypeOptions: any[];
}

// Backdrop component definition outside render
const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
  />
);

const JobTypeBottomSheet: React.FC<JobTypeBottomSheetProps> = ({
  bottomSheetRef,
  jobTypeOptions,
}) => {
  const snapPoints = ['50%'];
  const [localSelected, setLocalSelected] =
    useState<string[]>();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  useEffect(() => {
    if (user.pOccupationId) {
      // Find the "Any" option
      const anyOption = jobTypeOptions?.find(option => 
        option.name.toLowerCase() === 'any'
      );
      const anyOptionId = anyOption ? String(anyOption.id) : null;
      
      if (Array.isArray(user.pOccupationId)) {
        setLocalSelected(user.pOccupationId.map(String));
      } else if (typeof user.pOccupationId === 'string') {
        // Check if pOccupationId is "any" string
        if (user.pOccupationId === 'any' && anyOptionId) {
          setLocalSelected([anyOptionId]);
        } else {
          setLocalSelected(user.pOccupationId.split(',').map(String));
        }
      } else {
        setLocalSelected([]);
      }
    } else {
      setLocalSelected([]);
    }
  }, [user.pOccupationId, jobTypeOptions]);
  const handleToggle = (jobType: string) => {
    // Ensure localSelected is always an array
    const currentSelected = Array.isArray(localSelected) ? localSelected : [];
    
    // Find the "Any" option
    const anyOption = jobTypeOptions?.find(option => 
      option.name.toLowerCase() === 'any'
    );
    const anyOptionId = anyOption ? String(anyOption.id) : null;
    
    let updated: string[];
    
    if (currentSelected.includes(jobType)) {
      // If clicking on already selected item, remove it
      updated = currentSelected.filter(j => j !== jobType);
    } else {
      // If selecting "Any", clear all other selections and only keep "Any"
      if (anyOptionId && jobType === anyOptionId) {
        updated = [jobType];
      } else {
        // If selecting any other option while "Any" is selected, remove "Any"
        let newSelected = [...currentSelected];
        if (anyOptionId && currentSelected.includes(anyOptionId)) {
          newSelected = newSelected.filter(j => j !== anyOptionId);
        }
        updated = [...newSelected, jobType];
      }
    }
    setLocalSelected(updated);
  };

  const handleApply = async () => {
    try {
      // Find the "Any" option
      const anyOption = jobTypeOptions?.find(option => 
        option.name.toLowerCase() === 'any'
      );
      const anyOptionId = anyOption ? String(anyOption.id) : null;
      
      // Check if "Any" is selected and convert it to "any" string
      let pOccupationIdString;
      if (anyOptionId && localSelected?.includes(anyOptionId)) {
        pOccupationIdString = 'any';
      } else {
        pOccupationIdString = localSelected?.join(',');
      }

      const requestBody = {
        id: user.id,
        pOccupationId: pOccupationIdString,
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
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <AppText text="Job type" textStyle={styles.headerTitle} />
          <AppText
            text="You can select multiple options"
            textStyle={styles.headerSubtitle}
          />
        </View>

        <View style={styles.chipsContainer}>
          {jobTypeOptions.map((option: any) => (
            <AppChip2
              key={option.id}
              title={
                option.name.charAt(0).toUpperCase() +
                option.name.slice(1).toLowerCase()
              }
              isSelected={localSelected?.includes(String(option.id))}
              onPress={() => handleToggle(String(option.id))}
            />
          ))}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default React.memo(JobTypeBottomSheet);

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
