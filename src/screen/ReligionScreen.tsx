import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import {
  Size25,
  Size8,
} from '../constants/Sizes';
import HeaderBack from '../components/HeaderBack';
import AppButton from '../components/AppButton';
import AppDropdown from '../components/AppDropdown';
import AppPickerModal from '../components/AppPickerModal';
import {
  completeUserProfileV2Updated,
  getCommunity,
  getMaritalStatus,
  getReligion,
} from '../store/reducers/authReducer';
import {
  updateUrl,
  getCommunityUrl,
  getReligionUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
  navigateToLastScreen,
  getMaritalStatusUrl,
} from '../constants/functions';
import { useDispatch, useSelector } from 'react-redux';
import AppToast from '../components/AppToast';
import { MOTHER_TONGUE, ROUTES } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../constants/globalStyles';

const ReligionScreen = () => {
  const [selectedReligion, setSelectedReligion] = useState('');
  const [selectedReligionId, setSelectedReligionId] = useState<number | null>(
    null,
  );
  const [selectedTribe, setSelectedTribe] = useState('');
  const [selectedTribeId, setSelectedTribeId] = useState<number | null>(null);
  const [selectedMotherTongue, setSelectedMotherTongue] = useState('');
  const [showReligionPicker, setShowReligionPicker] = useState(false);
  const [showTribePicker, setShowTribePicker] = useState(false);
  const [showMotherTonguePicker, setShowMotherTonguePicker] = useState(false);
  const [showMaritalStatusPicker, setShowMaritalStatusPicker] = useState(false);
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<any>(null);
  const { user, loader, religion, community, maritalStatuses } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    dispatch(getReligion(getReligionUrl));
    dispatch(getMaritalStatus(getMaritalStatusUrl));
  }, [dispatch]);

  useEffect(() => {
    if (selectedReligionId) {
      dispatch(
        getCommunity(`${getCommunityUrl}religionId=${selectedReligionId}`),
      );
    }
  }, [dispatch, selectedReligionId]);
  // Extract religion and community data from the API
  const religions = religion || [];
  const tribes = community || [];
  const handleReligionSelection = (religionItem: any) => {
    setSelectedReligion(religionItem.name);
    setSelectedReligionId(religionItem.id);
    setSelectedTribe('');
    setSelectedTribeId(null);
  };
  const maritalStatusesList = useMemo(
    () => maritalStatuses || [],
    [maritalStatuses],
  );
  const handleTribeSelection = (tribeItem: any) => {
    setSelectedTribe(tribeItem.name);
    setSelectedTribeId(tribeItem.id);
  };
  const handleMotherTongueSelection = (motherTongueItem: any) => {
    setSelectedMotherTongue(motherTongueItem.label);
  };
  // Handle marital status selection
  const handleMaritalStatusSelection = useCallback((status: any) => {
    setSelectedMaritalStatus(status);
  }, []);
  const handleContinue = async () => {
    if (!selectedReligion || !selectedTribe || !selectedMotherTongue) {
      AppToast('Please select all required fields');
      return;
    }

    try {
      const requestBody = {
        id: user.id,
        religionId: selectedReligionId,
        maritalStatusId: selectedMaritalStatus.id,
        communityId: selectedTribeId,
        motherTongue: selectedMotherTongue,
      };
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
      console.log(error, 'error');
    } finally {
      navigateToLastScreen(navigation, ROUTES.ADDRESS);
    }
  };

  const isFormValid =
    selectedReligion &&
    selectedTribe &&
    selectedMotherTongue &&
    selectedMaritalStatus;

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={globalStyles.content}>
        <HeaderBack
          onPress={() => navigateToLastScreen(navigation, ROUTES.BIRTH_DATE)}
        />
        <View style={{ gap: Size25*1.5 }}>
          <View style={{ gap: Size8 }}>
            {/* Religion Dropdown */}
            <AppDropdown
              label="Religion & Tribe"
              selectedValue={selectedReligion}
              placeholder="Select Religion"
              onPress={() => setShowReligionPicker(true)}
            />

            {/* Tribe Dropdown */}
            <AppDropdown
              label=""
              selectedValue={selectedTribe}
              placeholder="Select Tribe"
              onPress={() => setShowTribePicker(true)}
            />
          </View>
          <View style={{ gap: Size25 *1.5}}>
            <AppDropdown
              label="Mother Tongue"
              selectedValue={selectedMotherTongue}
              placeholder="Select Mother Tongue"
              onPress={() => setShowMotherTonguePicker(true)}
            />
            {/* Marital Status Dropdown */}
            <AppDropdown
              label="Marital Status"
              selectedValue={selectedMaritalStatus?.name || ''}
              placeholder="Select your marital status"
              onPress={() => setShowMaritalStatusPicker(true)}
            />
          </View>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Continue Button */}
        <AppButton
          title="Continue"
          onPress={handleContinue}
          isLoading={loader}
          isButtonDisabled={!isFormValid || loader}
          buttonStyle={[
            globalStyles.continueButton,
            isFormValid
              ? globalStyles.continueButtonActive
              : globalStyles.continueButtonInactive,
          ]}
          textStyle={[
            globalStyles.continueButtonText,
            isFormValid
              ? globalStyles.continueButtonTextActive
              : globalStyles.continueButtonTextInactive,
          ]}
        />
      </View>

      {/* Religion Picker Modal */}
      <AppPickerModal
        visible={showReligionPicker}
        title="Select Religion"
        items={religions.filter((religion: any) => religion.name !== 'any')}
        selectedValue={selectedReligion}
        onSelect={handleReligionSelection}
        onClose={() => setShowReligionPicker(false)}
        isObjects={true}
      />

      {/* Tribe Picker Modal */}
      <AppPickerModal
        visible={showTribePicker}
        title="Select Tribe"
        items={tribes}
        selectedValue={selectedTribe}
        onSelect={handleTribeSelection}
        onClose={() => setShowTribePicker(false)}
        isObjects={true}
      />

      {/* Mother Tongue Picker Modal */}
      <AppPickerModal
        visible={showMotherTonguePicker}
        title="Select Mother Tongue"
        items={MOTHER_TONGUE.sort((a, b) =>
          a.label.toLowerCase().localeCompare(b.label.toLowerCase()),
        )}
        selectedValue={selectedMotherTongue}
        onSelect={handleMotherTongueSelection}
        onClose={() => setShowMotherTonguePicker(false)}
        isObjects={true}
      />
      {/* Marital Status Picker Modal */}
      <AppPickerModal
        visible={showMaritalStatusPicker}
        title="Select Marital Status"
        items={maritalStatusesList.filter((item: any) => item.name !== 'any')}
        selectedValue={selectedMaritalStatus?.name || ''}
        onSelect={handleMaritalStatusSelection}
        onClose={() => setShowMaritalStatusPicker(false)}
        isObjects={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  spacer: {
    flex: 1,
  },

});

export default ReligionScreen;
