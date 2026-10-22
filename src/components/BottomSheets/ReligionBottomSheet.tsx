import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
import PremiumCrown from '../PremiumCrown';
import PremiumGateOverlay from '../PremiumGateOverlay';
import { COLORS } from '../../constants/AppColors';
import {
  fontSize14,
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
  baseUrl,
  getMatchedUsersUrl,
} from '../../constants/functions';
import {
  completeUserProfileV2Updated,
  getCommunity,
} from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import AppChip2 from '../chips/AppChip2';
import { setMatchedUserApi } from '../../store/reducers/userReducer';
import { globalStyles } from '../../constants/globalStyles';

// Backdrop component definition outside render
const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
  />
);

interface ReligionBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  religionOptions: any[];
  localSelectedReligion: string | null;
  setLocalSelectedReligion: (religion: string | null) => void;
  localSelectedReligionId: string | null;
  setLocalSelectedReligionId: (religionId: string | null) => void;
}

const ReligionBottomSheet: React.FC<ReligionBottomSheetProps> = ({
  bottomSheetRef,
  religionOptions,
  localSelectedReligion,
  setLocalSelectedReligion,
  localSelectedReligionId,
  setLocalSelectedReligionId,
}) => {
  const snapPoints = ['30%', '50%'];

  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  useEffect(() => {
    if (user.pReligionId && user.pReligionId !== 'any') {
      setLocalSelectedReligion(user.pReligionId);
    }
  }, [user, setLocalSelectedReligion]);
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
      // Debug: Log the religionOptions array
      
      // Find the "Any" option
      const anyOption = religionOptions?.find(option => 
        option.name.toLowerCase() === 'any'
      );
      
      const anyOptionId = anyOption ? String(anyOption.id) : null;
      // Check if "Any" is selected and convert it to "any" string
      let pReligionIdValue;
      if (anyOptionId && String(localSelectedReligionId) === anyOptionId) {
        pReligionIdValue = 'any';
      } else {
        pReligionIdValue = localSelectedReligionId;
      }

      const requestBody = {
        id: user.id,
        pReligionId: pReligionIdValue,
      };
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
    } catch (error) {
    } finally {
      dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
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
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={globalStyles.handleIndicator}
      backgroundStyle={globalStyles.bottomSheetBackground}
    >
      <BottomSheetView style={[globalStyles.contentContainer,{gap: Size25}]}>
        <View style={styles.headerContainer}>
          <PremiumCrown />
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
              title={option.name}
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
      <PremiumGateOverlay bottomSheetRef={bottomSheetRef} group="primary" />
    </BottomSheet>
  );
};

export default ReligionBottomSheet;

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'flex-start',
    gap: Size8,
  },
  headerTitle: {
    fontSize: fontSize20,
    fontFamily: Fonts.PRODUCT_SANS_BOLD,
    color: COLORS.black,
    fontWeight: 'bold',
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
    alignItems: 'center',
  },
});
