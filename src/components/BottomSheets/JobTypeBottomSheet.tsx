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
  getEmploymentTypeApi,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
  updateUrl,
} from '../../constants/functions';
import { completeUserProfileV2Updated } from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import AppChip2 from '../chips/AppChip2';

interface JobTypeBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}

const JobTypeBottomSheet: React.FC<JobTypeBottomSheetProps> = ({
  bottomSheetRef,
}) => {
  const snapPoints = ['50%'];
  const [localSelected, setLocalSelected] =
    useState<string[]>();
  const dispatch = useDispatch();
  const [jobTypeOptions, setJobTypeOptions] = useState<string[]>([]);
  const { user } = useSelector((state: any) => state.entities.authReducer);
  // Ensure initial job types are preserved and merged with API values
  useEffect(() => {
    getEmploymentTypeApi().then(res => {
      setJobTypeOptions(res);
    });
  }, []);
  useEffect(() => {
    if (user.pOccupationId) {
      if (Array.isArray(user.pOccupationId)) {
        setLocalSelected(user.pOccupationId);
      } else if (typeof user.pOccupationId === 'string') {
        setLocalSelected(user.pOccupationId.split(','));
      } else {
        setLocalSelected([]);
      }
    } else {
      setLocalSelected([]);
    }
  }, [user.pOccupationId]);
  console.log(localSelected, 'localSelected');
  const handleToggle = (jobType: string) => {
    // Ensure localSelected is always an array
    const currentSelected = Array.isArray(localSelected) ? localSelected : [];
    let updated: string[];
    if (jobType === 'Any') {
      updated = ['Any'];
    } else {
      updated = currentSelected.filter(j => j !== 'Any');
      if (updated.includes(jobType)) {
        updated = updated.filter(j => j !== jobType);
      } else {
        updated = [...updated, jobType];
      }
    }
    setLocalSelected(updated);
  };

  const handleApply = async () => {
    try {
      const requestBody = {
        id: user.id,
        pOccupationId: localSelected?.join(','),
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
          <AppText text="Job type" textStyle={styles.headerTitle} />
          <AppText
            text="You can select mutiple options"
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
              isSelected={localSelected?.includes(option.id)}
              onPress={() => handleToggle(option.id)}
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
