import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import {
  fontSize16,
  lignHeight24,
  Size12,
  Size4,
  Size8,
  borderWidth,
  lignHeight72,
  lignHeight20,
  fontSize24,
} from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import HeaderBack from '../components/HeaderBack';
import AppButton from '../components/AppButton';
import AppDropdown from '../components/AppDropdown';
import AppPickerModal from '../components/AppPickerModal';
import {
  completeUserProfileV2Updated,
  getCommunity,
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
} from '../constants/functions';
import { useDispatch, useSelector } from 'react-redux';
import AppToast from '../components/AppToast';
import AppText from '../components/AppText';
import { MOTHER_TONGUE, ROUTES } from '../constants/data';
import { useNavigation } from '@react-navigation/native';

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
  const { user, loader, religion, community } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useEffect(() => {
    dispatch(getReligion(getReligionUrl));
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

  const handleTribeSelection = (tribeItem: any) => {
    setSelectedTribe(tribeItem.name);
    setSelectedTribeId(tribeItem.id);
  };
  const handleMotherTongueSelection = (motherTongueItem: any) => {
    setSelectedMotherTongue(motherTongueItem.label);
  };
  const handleContinue = async () => {
    if (!selectedReligion || !selectedTribe || !selectedMotherTongue) {
      AppToast('Please select all required fields');
      return;
    }

    try {
      const requestBody = {
        id: user.id,
        religionId: selectedReligionId,
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

  const isFormValid = selectedReligion && selectedTribe && selectedMotherTongue;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <HeaderBack
          onPress={() => navigateToLastScreen(navigation, ROUTES.BIRTH_DATE)}
        />

        {/* Title */}
        <AppText text="Religion" textStyle={styles.title} />

        {/* Religion Dropdown */}
        <AppDropdown
          label="Religion"
          selectedValue={selectedReligion}
          placeholder="Select Religion"
          onPress={() => setShowReligionPicker(true)}
        />

        {/* Tribe Dropdown */}
        <AppDropdown
          label="Tribe"
          selectedValue={selectedTribe}
          placeholder="Select Tribe"
          onPress={() => setShowTribePicker(true)}
        />
        <AppDropdown
          label="Mother Tongue"
          selectedValue={selectedMotherTongue}
          placeholder="Select Mother Tongue"
          onPress={() => setShowMotherTonguePicker(true)}
        />

        {/* Mother Tongue Input */}
        {/* <View style={styles.inputContainer}>
          <AppText text="Mother tongue" textStyle={styles.inputLabel} />
          <AppTextInput
            placeholder="Enter Mother Tongue"
            value={selectedMotherTongue}
            onChangeText={setSelectedMotherTongue}
            keyboardType="default"
            style={styles.textInputContainer}
            textInputStyle={styles.textInputStyle}
          />
        </View> */}

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Continue Button */}
        <AppButton
          title="Continue"
          onPress={handleContinue}
          isLoading={loader}
          isButtonDisabled={!isFormValid || loader}
          buttonStyle={[
            styles.continueButton,
            isFormValid
              ? styles.continueButtonActive
              : styles.continueButtonInactive,
          ]}
          textStyle={[
            styles.continueButtonText,
            isFormValid
              ? styles.continueButtonTextActive
              : styles.continueButtonTextInactive,
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
        items={MOTHER_TONGUE.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))}
        selectedValue={selectedMotherTongue}
        onSelect={handleMotherTongueSelection}
        onClose={() => setShowMotherTonguePicker(false)}
        isObjects={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: lignHeight24,
    paddingVertical: lignHeight24,
    gap: lignHeight20,
    paddingTop: lignHeight72,
  },
  title: {
    fontSize: fontSize24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  spacer: {
    flex: 1,
  },
  continueButton: {
    borderRadius: Size8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonActive: {
    backgroundColor: COLORS.textBlack,
  },
  continueButtonInactive: {
    backgroundColor: COLORS.borderLight,
  },
  continueButtonText: {
    fontSize: fontSize16,
    fontWeight: '600',
  },
  continueButtonTextActive: {
    color: COLORS.white,
  },
  continueButtonTextInactive: {
    color: COLORS.placeholderInactive,
  },

  inputContainer: {
    gap: Size8,
  },
  inputLabel: {
    fontSize: fontSize16,
    color: COLORS.black,
    fontWeight: '500',
  },
  textInputContainer: {
    gap: 0,
  },
  textInputStyle: {
    fontSize: fontSize16,
    color: COLORS.black,
    paddingVertical: Size12,
    paddingHorizontal: Size4,
    borderBottomWidth: borderWidth,
    borderBottomColor: COLORS.borderBottom,
  },
});

export default ReligionScreen;
