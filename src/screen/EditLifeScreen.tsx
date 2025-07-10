import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AppSafeView from '../components/AppSafeView';
import AppHeader from '../components/AppHeader';
import AppDropdown from '../components/AppDropdown';
import AppButton from '../components/AppButton';
import AppPickerModal from '../components/AppPickerModal';
import AppScrollView from '../components/AppScrollView';
import { COLORS } from '../constants/AppColors';
import { Size16, Size20, Size25, compPadding } from '../constants/Sizes';
import {
  completeUserProfileV2Updated,
} from '../store/reducers/authReducer';
import {
  updateUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
} from '../constants/functions';
import AppToast from '../components/AppToast';

// Mock data for dropdowns - these should ideally come from your data constants
const STATES = [
  { id: '1', name: 'Jharkhand' },
  { id: '2', name: 'Bihar' },
  { id: '3', name: 'West Bengal' },
  { id: '4', name: 'Odisha' },
  { id: '5', name: 'Uttar Pradesh' },
];

const CITIES = [
  { id: '1', name: 'Jamshedpur', stateId: '1' },
  { id: '2', name: 'Ranchi', stateId: '1' },
  { id: '3', name: 'Dhanbad', stateId: '1' },
  { id: '4', name: 'Bokaro', stateId: '1' },
];

const HEIGHTS = [
  { id: '1', name: '5\'0"' },
  { id: '2', name: '5\'1"' },
  { id: '3', name: '5\'2"' },
  { id: '4', name: '5\'3"' },
  { id: '5', name: '5\'4"' },
  { id: '6', name: '5\'5"' },
  { id: '7', name: '5\'6"' },
  { id: '8', name: '5\'7"' },
  { id: '9', name: '5\'8"' },
  { id: '10', name: '5\'9"' },
  { id: '11', name: '5\'10"' },
  { id: '12', name: '5\'11"' },
  { id: '13', name: '6\'0"' },
  { id: '14', name: '6\'1"' },
  { id: '15', name: '6\'2"' },
];

const DIET_PREFERENCES = [
  { id: '1', name: 'Vegetarian' },
  { id: '2', name: 'Non-Vegetarian' },
  { id: '3', name: 'Vegan' },
  { id: '4', name: 'Jain' },
];

const YES_NO_OPTIONS = [
  { id: '1', name: 'Yes' },
  { id: '2', name: 'No' },
];

const SMOKING_OPTIONS = [
  { id: '1', name: 'Never' },
  { id: '2', name: 'Socially' },
  { id: '3', name: 'Regularly' },
  { id: '4', name: 'Planning to quit' },
  { id: '5', name: 'Quit' },
];

const TIMELINE_OPTIONS = [
  { id: '1', name: 'Within 6 months' },
  { id: '2', name: 'Within 1 year' },
  { id: '3', name: 'Within 2 years' },
  { id: '4', name: 'More than 2 years' },
  { id: '5', name: 'Not decided' },
];

const EditLifeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { user, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );

  // Form state
  const [formData, setFormData] = useState({
    stateId: '',
    stateName: '',
    cityId: '',
    cityName: '',
    heightId: '',
    heightName: '',
    dietId: '',
    dietName: '',
    drinkingId: '',
    drinkingName: '',
    smokingId: '',
    smokingName: '',
    timelineId: '',
    timelineName: '',
  });

  // Picker modal states
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showHeightPicker, setShowHeightPicker] = useState(false);
  const [showDietPicker, setShowDietPicker] = useState(false);
  const [showDrinkingPicker, setShowDrinkingPicker] = useState(false);
  const [showSmokingPicker, setShowSmokingPicker] = useState(false);
  const [showTimelinePicker, setShowTimelinePicker] = useState(false);

  // Filtered cities for city picker
  const [cityOptions, setCityOptions] = useState<any[]>([]);

  // Initialize form data from user profile
  useEffect(() => {
    if (user) {
      setFormData({
        stateId: user.stateId || '1',
        stateName: user.stateName || 'Jharkhand',
        cityId: user.cityId || '1',
        cityName: user.cityName || 'Jamshedpur',
        heightId: user.heightId || '8',
        heightName: user.heightName || '5\'7"',
        dietId: user.dietId || '1',
        dietName: user.dietName || 'Vegetarian',
        drinkingId: user.drinkingId || '2',
        drinkingName: user.drinkingName || 'No',
        smokingId: user.smokingId || '4',
        smokingName: user.smokingName || 'Planning to quit',
        timelineId: user.timelineId || '1',
        timelineName: user.timelineName || 'Within 6 months',
      });
    }
  }, [user]);

  // Handle state selection
  const handleStateSelection = useCallback((selectedState: any) => {
    setFormData(prev => ({
      ...prev,
      stateId: selectedState.id,
      stateName: selectedState.name,
      cityId: '', // Reset city when state changes
      cityName: '',
    }));
    
    // Filter cities based on selected state
    const filteredCities = CITIES.filter(
      (city: any) => city.stateId === selectedState.id
    );
    setCityOptions(filteredCities);
    setShowStatePicker(false);
  }, []);

  // Handle city selection
  const handleCitySelection = useCallback((selectedCity: any) => {
    setFormData(prev => ({
      ...prev,
      cityId: selectedCity.id,
      cityName: selectedCity.name,
    }));
    setShowCityPicker(false);
  }, []);

  // Handle height selection
  const handleHeightSelection = useCallback((selectedHeight: any) => {
    setFormData(prev => ({
      ...prev,
      heightId: selectedHeight.id,
      heightName: selectedHeight.name,
    }));
    setShowHeightPicker(false);
  }, []);

  // Handle diet selection
  const handleDietSelection = useCallback((selectedDiet: any) => {
    setFormData(prev => ({
      ...prev,
      dietId: selectedDiet.id,
      dietName: selectedDiet.name,
    }));
    setShowDietPicker(false);
  }, []);

  // Handle drinking selection
  const handleDrinkingSelection = useCallback((selectedDrinking: any) => {
    setFormData(prev => ({
      ...prev,
      drinkingId: selectedDrinking.id,
      drinkingName: selectedDrinking.name,
    }));
    setShowDrinkingPicker(false);
  }, []);

  // Handle smoking selection
  const handleSmokingSelection = useCallback((selectedSmoking: any) => {
    setFormData(prev => ({
      ...prev,
      smokingId: selectedSmoking.id,
      smokingName: selectedSmoking.name,
    }));
    setShowSmokingPicker(false);
  }, []);

  // Handle timeline selection
  const handleTimelineSelection = useCallback((selectedTimeline: any) => {
    setFormData(prev => ({
      ...prev,
      timelineId: selectedTimeline.id,
      timelineName: selectedTimeline.name,
    }));
    setShowTimelinePicker(false);
  }, []);

  // Handle form submission
  const handleSave = useCallback(async () => {
    // Validate required fields
    if (!formData.stateId) {
      AppToast('Please select your state');
      return;
    }
    
    if (!formData.cityId) {
      AppToast('Please select your city');
      return;
    }
    
    if (!formData.heightId) {
      AppToast('Please select your height');
      return;
    }
    
    if (!formData.dietId) {
      AppToast('Please select your diet preference');
      return;
    }

    try {
      const requestBody = {
        id: user.id,
        stateId: formData.stateId,
        cityId: formData.cityId,
        heightId: formData.heightId,
        dietId: formData.dietId,
        drinkingId: formData.drinkingId,
        smokingId: formData.smokingId,
        timelineId: formData.timelineId,
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

  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Lifestyle & Hometown" />
      
      <AppScrollView 
        style={styles.scrollView}
        otherProps={{ contentContainerStyle: styles.scrollContent }}
      >
        {/* State Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.stateName}
            placeholder="Select State"
            onPress={() => setShowStatePicker(true)}
          />
        </View>

        {/* City Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.cityName}
            placeholder="Select City"
            onPress={() => setShowCityPicker(true)}
            disabled={!formData.stateId}
          />
        </View>

        {/* Height Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.heightName}
            placeholder="Select Height"
            onPress={() => setShowHeightPicker(true)}
          />
        </View>

        {/* Diet Preference Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.dietName}
            placeholder="Select Diet Preference"
            onPress={() => setShowDietPicker(true)}
          />
        </View>

        {/* Drinking Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.drinkingName}
            placeholder="Do you drink?"
            onPress={() => setShowDrinkingPicker(true)}
          />
        </View>

        {/* Smoking Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.smokingName}
            placeholder="Smoking Habits"
            onPress={() => setShowSmokingPicker(true)}
          />
        </View>

        {/* Timeline Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.timelineName}
            placeholder="Marriage Timeline"
            onPress={() => setShowTimelinePicker(true)}
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
        visible={showStatePicker}
        items={STATES}
        selectedValue={formData.stateName}
        onSelect={handleStateSelection}
        onClose={() => setShowStatePicker(false)}
        title="Select State"
        isObjects={true}
      />

      <AppPickerModal
        visible={showCityPicker}
        items={cityOptions}
        selectedValue={formData.cityName}
        onSelect={handleCitySelection}
        onClose={() => setShowCityPicker(false)}
        title="Select City"
        isObjects={true}
      />

      <AppPickerModal
        visible={showHeightPicker}
        items={HEIGHTS}
        selectedValue={formData.heightName}
        onSelect={handleHeightSelection}
        onClose={() => setShowHeightPicker(false)}
        title="Select Height"
        isObjects={true}
      />

      <AppPickerModal
        visible={showDietPicker}
        items={DIET_PREFERENCES}
        selectedValue={formData.dietName}
        onSelect={handleDietSelection}
        onClose={() => setShowDietPicker(false)}
        title="Select Diet Preference"
        isObjects={true}
      />

      <AppPickerModal
        visible={showDrinkingPicker}
        items={YES_NO_OPTIONS}
        selectedValue={formData.drinkingName}
        onSelect={handleDrinkingSelection}
        onClose={() => setShowDrinkingPicker(false)}
        title="Do you drink?"
        isObjects={true}
      />

      <AppPickerModal
        visible={showSmokingPicker}
        items={SMOKING_OPTIONS}
        selectedValue={formData.smokingName}
        onSelect={handleSmokingSelection}
        onClose={() => setShowSmokingPicker(false)}
        title="Smoking Habits"
        isObjects={true}
      />

      <AppPickerModal
        visible={showTimelinePicker}
        items={TIMELINE_OPTIONS}
        selectedValue={formData.timelineName}
        onSelect={handleTimelineSelection}
        onClose={() => setShowTimelinePicker(false)}
        title="Marriage Timeline"
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

export default EditLifeScreen;