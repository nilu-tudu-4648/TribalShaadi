import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
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
import {
  getCommunityUrl,
  updateUrl,
  getUserDetailsApi,
  setReducerLoadingfalse,
  getUserDetailsUrl,
} from '../../constants/functions';
import {
  completeUserProfileV2Updated,
  getCommunity,
} from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import AppChip2 from '../chips/AppChip2';

interface ReligionBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  religionOptions: any[];
}

const ReligionBottomSheet: React.FC<ReligionBottomSheetProps> = ({
  bottomSheetRef,
  religionOptions,
}) => {
  const snapPoints = ['30%', '50%'];
  const [localSelectedReligion, setLocalSelectedReligion] =
    useState<string>();
  const [localSelectedReligionId, setLocalSelectedReligionId] = useState<
    string | null
  >(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  useEffect(() => {
    setLocalSelectedReligion(user.pReligionId);
  }, [user]);
  const handleStatusSelect = (religion: string) => {
    setLocalSelectedReligion(religion);
  };
  // Load communities when religion is selected
  useEffect(() => {
    if (localSelectedReligionId) {
      dispatch(
        getCommunity(`${getCommunityUrl}religionId=${localSelectedReligionId}`),
      );
    }
  }, [dispatch, localSelectedReligionId]);

  const handleApply = async () => {
    try {
      const requestBody = {
        id: user.id,
        pReligionId: localSelectedReligionId,
      };
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
          {religionOptions.map(option => (
            <AppChip2
              key={option.id}
              title={option.name.charAt(0).toUpperCase() + option.name.slice(1).toLowerCase()}
              isSelected={localSelectedReligion == option.id}
              onPress={() => {
                setLocalSelectedReligionId(option.id);
                handleStatusSelect(option.id);
              }}
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
