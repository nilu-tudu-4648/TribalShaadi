import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AppSafeView from '../components/AppSafeView';
import AppHeader from '../components/AppHeader';
import AppTextInput from '../components/AppTextInput';
import AppDropdown from '../components/AppDropdown';
import AppButton from '../components/AppButton';
import AppPickerModal from '../components/AppPickerModal';
import AppScrollView from '../components/AppScrollView';
import { COLORS } from '../constants/AppColors';
import { Size16, Size20, Size25, compPadding } from '../constants/Sizes';
import { MOTHER_TONGUE } from '../constants/data';
import {
  getCommunity,
  getMaritalStatus,
  getReligion,
  completeUserProfileV2Updated,
} from '../store/reducers/authReducer';
import {
  getCommunityUrl,
  getMaritalStatusUrl,
  getReligionUrl,
  updateUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
} from '../constants/functions';
import AppToast from '../components/AppToast';

const EditPersonalScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { user, loader, community, maritalStatuses } = useSelector(
    (state: any) => state.entities.authReducer,
  );

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
    //   const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      const birthDate = user.birthDate ? new Date(user.birthDate).toLocaleDateString() : '';
      
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
      });
    }
  }, [user]);

  // Fetch initial data
  useEffect(() => {
    dispatch(getCommunity(getCommunityUrl));
    dispatch(getMaritalStatus(getMaritalStatusUrl));
    dispatch(getReligion(getReligionUrl));
  }, [dispatch]);

  // Handle name input change
  const handleNameChange = useCallback((text: string) => {
    // Remove any numbers and special characters, keep only letters and spaces
    const filteredText = text.replace(/[^a-zA-Z\s]/g, '');
    const nameParts = filteredText.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    setFormData(prev => ({
      ...prev,
      firstName,
      lastName,
    }));
  }, []);

  // Handle community selection
  const handleCommunitySelection = useCallback((selectedCommunity: any) => {
    setFormData(prev => ({
      ...prev,
      communityId: selectedCommunity.id,
      communityName: selectedCommunity.name,
      subCommunityId: '', // Reset sub-community when main community changes
      subCommunityName: '',
    }));
    
    // Filter sub-communities based on selected community
    const filteredSubCommunities = community.filter(
      (item: any) => item.parentId === selectedCommunity.id
    );
    setSubCommunityOptions(filteredSubCommunities);
    setShowCommunityPicker(false);
  }, [community]);

  // Handle sub-community selection
  const handleSubCommunitySelection = useCallback((selectedSubCommunity: any) => {
    setFormData(prev => ({
      ...prev,
      subCommunityId: selectedSubCommunity.id,
      subCommunityName: selectedSubCommunity.name,
    }));
    setShowSubCommunityPicker(false);
  }, []);

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
    if (!formData.firstName.trim()) {
      AppToast('Please enter your name');
      return;
    }
    
    if (!formData.communityId) {
      AppToast('Please select your community');
      return;
    }
    
    if (!formData.motherTongue) {
      AppToast('Please select your mother tongue');
      return;
    }
    
    if (!formData.maritalStatusId) {
      AppToast('Please select your marital status');
      return;
    }

    try {
      const requestBody = {
        id: user.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        communityId: formData.communityId,
        ...(formData.subCommunityId && { subCommunityId: formData.subCommunityId }),
        motherTongue: formData.motherTongue,
        maritalStatusId: formData.maritalStatusId,
      };

      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
      
      AppToast('Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      AppToast('Error updating profile. Please try again.');
    }
  }, [formData, user, dispatch, navigation]);

  const fullName = `${formData.firstName} ${formData.lastName}`.trim();

  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Personal Details" />
      
      <AppScrollView 
        style={styles.scrollView}
        otherProps={{ contentContainerStyle: styles.scrollContent }}
      >
        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <AppTextInput
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={handleNameChange}
            keyboardType="default"
            style={styles.inputField}
          />
        </View>

        {/* Gender Field (Read-only) */}
        <View style={styles.fieldContainer}>
          <AppTextInput
            placeholder="Gender"
            value={formData.gender}
            onChangeText={() => {}}
            keyboardType="default"
            style={styles.inputField}
            editable={false}
          />
        </View>

        {/* Birth Date Field (Read-only) */}
        <View style={styles.fieldContainer}>
          <AppTextInput
            placeholder="Birth Date"
            value={formData.birthDate}
            onChangeText={() => {}}
            keyboardType="default"
            style={styles.inputField}
            editable={false}
          />
        </View>

        {/* Phone Number Field (Read-only) */}
        <View style={styles.fieldContainer}>
          <AppTextInput
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChangeText={() => {}}
            keyboardType="numeric"
            style={styles.inputField}
            editable={false}
          />
        </View>

        {/* Community Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.communityName}
            placeholder="Select Community"
            onPress={() => setShowCommunityPicker(true)}
          />
        </View>

        {/* Sub-Community Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.subCommunityName}
            placeholder="Select Sub-Community"
            onPress={() => setShowSubCommunityPicker(true)}
            disabled={!formData.communityId}
          />
        </View>

        {/* Mother Tongue Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.motherTongue}
            placeholder="Select Language"
            onPress={() => setShowLanguagePicker(true)}
          />
        </View>

        {/* Marital Status Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.maritalStatusName}
            placeholder="Select Marital Status"
            onPress={() => setShowMaritalStatusPicker(true)}
          />
        </View>
      </AppScrollView>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Save"
          onPress={handleSave}
          isLoading={loader}
          buttonStyle={styles.saveButton}
          textStyle={styles.saveButtonText}
        />
      </View>

      {/* Picker Modals */}
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
        visible={showLanguagePicker}
        items={MOTHER_TONGUE}
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
  },
  scrollContent: {
    padding: compPadding,
    paddingBottom: Size25,
  },
  fieldContainer: {
    marginBottom: Size20,
  },
  inputField: {
    marginBottom: 0,
  },
  buttonContainer: {
    padding: compPadding,
    paddingTop: Size16,
  },
  saveButton: {
    backgroundColor: COLORS.violet,
    borderRadius: Size16,
    paddingVertical: Size16,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default EditPersonalScreen;