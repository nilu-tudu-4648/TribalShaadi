import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AppSafeView from '../components/AppSafeView';
import AppTextInput from '../components/AppTextInput';
import AppDropdown from '../components/AppDropdown';
import AppButton from '../components/AppButton';
import AppPickerModal from '../components/AppPickerModal';
import { COLORS } from '../constants/AppColors';
import { Size20, Size25, Size8, fontSize24 } from '../constants/Sizes';
import { MOTHER_TONGUE, ROUTES } from '../constants/data';
import {
  getCommunity,
  completeUserProfileV2Updated,
} from '../store/reducers/authReducer';
import {
  getCommunityUrl,
  updateUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
} from '../constants/functions';
import AppToast from '../components/AppToast';
import { UserProfileIcon } from '../components/svg/SvgIcons';
import ProfileHeader from '../components/Header/ProfileHeader';
import { globalStyles } from '../constants/globalStyles';

const EditPersonalScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Religion and tribe selection states
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

  const { user, loader, community, maritalStatuses, religion } = useSelector(
    (state: any) => state.entities.authReducer,
  );

  // Load communities when religion is selected
  useEffect(() => {
    if (selectedReligionId) {
      dispatch(
        getCommunity(`${getCommunityUrl}religionId=${selectedReligionId}`),
      );
    }
  }, [dispatch, selectedReligionId]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    phoneNumber: '',
    communityId: '',
    communityName: '',
    subCommunityId: '',
    subCommunityName: '',
    motherTongue: '',
    maritalStatusId: '',
    maritalStatusName: '',
    religionId: '',
    religionName: '',
  });

  // Picker modal states
  const [showCommunityPicker, setShowCommunityPicker] = useState(false);
  const [showSubCommunityPicker, setShowSubCommunityPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showMaritalStatusPicker, setShowMaritalStatusPicker] = useState(false);

  // Filtered communities for sub-community picker
  const [subCommunityOptions, setSubCommunityOptions] = useState([]);

  // Initialize form data from user profile
  useEffect(() => {
    if (user) {
      const birthDate = user.birthDate
        ? new Date(user.birthDate).toLocaleDateString()
        : '';

      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        gender: user.gender || '',
        birthDate: birthDate,
        phoneNumber: user.contactNo || '',
        communityId: user.communityId || '',
        communityName: user.community || '',
        subCommunityId: user.subCommunityId || '',
        subCommunityName: user.subCommunity || '',
        motherTongue: user.motherTongue || '',
        maritalStatusId: user.maritalStatusId || '',
        maritalStatusName: user.maritalStatus || '',
        religionId: user.religionId || '',
        religionName: user.religion || '',
      });

      // Set religion states if user has religion data
      if (user.religion) {
        setSelectedReligion(user.religion);
        setSelectedReligionId(user.religionId);
      }

      // Set tribe states if user has community data
      if (user.community) {
        setSelectedTribe(user.community);
        setSelectedTribeId(user.communityId);
      }

      // Set mother tongue if user has it
      if (user.motherTongue) {
        setSelectedMotherTongue(user.motherTongue);
      }
    }
  }, [user]);

  // Handle religion selection
  const handleReligionSelection = useCallback((religionItem: any) => {
    setSelectedReligion(religionItem.name);
    setSelectedReligionId(religionItem.id);
    setSelectedTribe('');
    setSelectedTribeId(null);
    setFormData(prev => ({
      ...prev,
      religionId: religionItem.id,
      religionName: religionItem.name,
      communityId: '',
      communityName: '',
      subCommunityId: '',
      subCommunityName: '',
    }));
    setShowReligionPicker(false);
  }, []);

  // Handle tribe selection
  const handleTribeSelection = useCallback(
    (tribeItem: any) => {
      setSelectedTribe(tribeItem.name);
      setSelectedTribeId(tribeItem.id);
      setFormData(prev => ({
        ...prev,
        communityId: tribeItem.id,
        communityName: tribeItem.name,
        subCommunityId: '',
        subCommunityName: '',
      }));

      // Filter sub-communities based on selected tribe
      const filteredSubCommunities = community.filter(
        (item: any) => item.parentId === tribeItem.id,
      );
      setSubCommunityOptions(filteredSubCommunities);
      setShowTribePicker(false);
    },
    [community],
  );

  // Handle mother tongue selection
  const handleMotherTongueSelection = useCallback((motherTongueItem: any) => {
    setSelectedMotherTongue(motherTongueItem.label || motherTongueItem.name);
    setFormData(prev => ({
      ...prev,
      motherTongue: motherTongueItem.label || motherTongueItem.name,
    }));
    setShowMotherTonguePicker(false);
  }, []);

  // Handle community selection
  const handleCommunitySelection = useCallback(
    (selectedCommunity: any) => {
      setFormData(prev => ({
        ...prev,
        communityId: selectedCommunity.id,
        communityName: selectedCommunity.name,
        subCommunityId: '', // Reset sub-community when main community changes
        subCommunityName: '',
      }));

      // Filter sub-communities based on selected community
      const filteredSubCommunities = community.filter(
        (item: any) => item.parentId === selectedCommunity.id,
      );
      setSubCommunityOptions(filteredSubCommunities);
      setShowCommunityPicker(false);
    },
    [community],
  );

  // Handle sub-community selection
  const handleSubCommunitySelection = useCallback(
    (selectedSubCommunity: any) => {
      setFormData(prev => ({
        ...prev,
        subCommunityId: selectedSubCommunity.id,
        subCommunityName: selectedSubCommunity.name,
      }));
      setShowSubCommunityPicker(false);
    },
    [],
  );

  // Handle language selection
  const handleLanguageSelection = useCallback((selectedLanguage: any) => {
    setFormData(prev => ({
      ...prev,
      motherTongue: selectedLanguage.name,
    }));
    setShowLanguagePicker(false);
  }, []);

  // Handle marital status selection
  const handleMaritalStatusSelection = useCallback((selectedStatus: any) => {
    setFormData(prev => ({
      ...prev,
      maritalStatusId: selectedStatus.id,
      maritalStatusName: selectedStatus.name,
    }));
    setShowMaritalStatusPicker(false);
  }, []);

  // Handle form submission
  const handleSave = useCallback(async () => {
    // Validate required fields
    try {
      const requestBody = {
        id: user.id,
        religionId: selectedReligionId,
        communityId: selectedTribeId,
        // gender: "Female",
        ...(formData.subCommunityId && {
          subCommunityId: formData.subCommunityId,
        }),
        motherTongue: selectedMotherTongue,
        maritalStatusId: formData.maritalStatusId,
      };
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });

      AppToast('Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      AppToast('Error updating profile. Please try again.');
    }
  }, [
    formData,
    selectedMotherTongue,
    selectedReligionId,
    selectedTribeId,
    user,
    dispatch,
    navigation,
  ]);

  const fullName = `${formData.firstName} ${formData.lastName}`.trim();
  return (
    <AppSafeView style={styles.container}>
      <ProfileHeader
        onBackPress={() => {
          handleSave();
          (navigation as any).navigate(ROUTES.STACK, {
            screen: ROUTES.ACCOUNT,
          } as never);
        }}
        title="Personal Details"
        icon={<UserProfileIcon />}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.scrollView}>
        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <AppTextInput
            placeholder="Enter your full name"
            label={false}
            value={fullName}
            onChangeText={() => {}}
            keyboardType="default"
            textInputStyle={globalStyles.inputField}
            editable={false}
          />
        </View>

        {/* Gender Field (Read-only) */}
        <View style={styles.fieldContainer}>
          <AppTextInput
            label={false}
            placeholder="Gender"
            value={formData.gender}
            onChangeText={() => {}}
            keyboardType="default"
            textInputStyle={globalStyles.inputField}
            editable={false}
          />
        </View>

        {/* Birth Date Field (Read-only) */}
        <View style={styles.fieldContainer}>
          <AppTextInput
            label={false}
            placeholder="Birth Date"
            value={formData.birthDate}
            onChangeText={() => {}}
            keyboardType="default"
            textInputStyle={globalStyles.inputField}
            editable={false}
          />
        </View>

        {/* Phone Number Field (Read-only) */}
        <View style={styles.fieldContainer}>
          <AppTextInput
            label={false}
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChangeText={() => {}}
            keyboardType="numeric"
            textInputStyle={globalStyles.inputField}
            editable={false}
          />
        </View>

        {/* Religion Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={selectedReligion}
            placeholder="Select Religion"
            onPress={() => setShowReligionPicker(true)}
            disabled={true}
            dropdownStyle={globalStyles.inputField}
            isDropdownIcon={true}
          />
        </View>

        {/* Tribe Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={selectedTribe}
            placeholder="Select Tribe"
            onPress={() => setShowTribePicker(true)}
            disabled={true}
            dropdownStyle={globalStyles.inputField}
            isDropdownIcon={true}
          />
        </View>

        {/* Mother Tongue Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={selectedMotherTongue}
            placeholder="Select Mother Tongue"
            onPress={() => setShowMotherTonguePicker(true)}
            dropdownStyle={globalStyles.inputField}
            isDropdownIcon={true}
          />
        </View>

        {/* Marital Status Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            disabled={true}
            selectedValue={formData.maritalStatusName}
            placeholder="Select Marital Status"
            onPress={() => setShowMaritalStatusPicker(true)}
            dropdownStyle={globalStyles.inputField}
            isDropdownIcon={true}
          />
        </View>
      </View>
      </ScrollView>
      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Save"
          onPress={handleSave}
          isLoading={loader}
          buttonStyle={[globalStyles.continueButton,globalStyles.continueButtonActive]}
          textStyle={[globalStyles.continueButtonText,globalStyles.continueButtonTextActive]}
        />
      </View>

      {/* Picker Modals */}
      <AppPickerModal
        visible={showReligionPicker}
        items={religion || []}
        selectedValue={selectedReligion}
        onSelect={handleReligionSelection}
        onClose={() => setShowReligionPicker(false)}
        title="Select Religion"
        isObjects={true}
      />

      <AppPickerModal
        visible={showTribePicker}
        items={community || []}
        selectedValue={selectedTribe}
        onSelect={handleTribeSelection}
        onClose={() => setShowTribePicker(false)}
        title="Select Tribe"
        isObjects={true}
      />

      <AppPickerModal
        visible={showCommunityPicker}
        items={community}
        selectedValue={formData.communityName}
        onSelect={handleCommunitySelection}
        onClose={() => setShowCommunityPicker(false)}
        title="Select Community"
        isObjects={true}
      />

      <AppPickerModal
        visible={showSubCommunityPicker}
        items={subCommunityOptions}
        selectedValue={formData.subCommunityName}
        onSelect={handleSubCommunitySelection}
        onClose={() => setShowSubCommunityPicker(false)}
        title="Select Sub-Community"
        isObjects={true}
      />

      <AppPickerModal
        visible={showMotherTonguePicker}
        items={MOTHER_TONGUE.sort((a, b) =>
          a.label.toLowerCase().localeCompare(b.label.toLowerCase()),
        )}
        selectedValue={selectedMotherTongue}
        onSelect={handleMotherTongueSelection}
        onClose={() => setShowMotherTonguePicker(false)}
        title="Select Mother Tongue"
        isObjects={true}
      />

      <AppPickerModal
        visible={showLanguagePicker}
        items={MOTHER_TONGUE.sort((a, b) =>
          a.label.toLowerCase().localeCompare(b.label.toLowerCase()),
        )}
        selectedValue={formData.motherTongue}
        onSelect={handleLanguageSelection}
        onClose={() => setShowLanguagePicker(false)}
        title="Select Language"
        isObjects={true}
      />

      <AppPickerModal
        visible={showMaritalStatusPicker}
        items={maritalStatuses}
        selectedValue={formData.maritalStatusName}
        onSelect={handleMaritalStatusSelection}
        onClose={() => setShowMaritalStatusPicker(false)}
        title="Select Marital Status"
        isObjects={true}
      />
    </AppSafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
    padding: Size8,
    gap: Size20,
    paddingVertical: Size25,
  },
  title: {
    fontSize: fontSize24,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  scrollContent: {
    padding: Size8,
    paddingBottom: Size25,
    gap: Size20,
  },
  fieldContainer: {},

  buttonContainer: {
    padding: Size8,
  },
});

export default EditPersonalScreen;
