import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AppSafeView from '../components/AppSafeView';
import AppDropdown from '../components/AppDropdown';
import AppButton from '../components/AppButton';
import AppPickerModal from '../components/AppPickerModal';
import { COLORS } from '../constants/AppColors';
import { Size20, Size25, Size8 } from '../constants/Sizes';
import {
  completeUserProfileV2Updated,
  getDiet,
} from '../store/reducers/authReducer';
import {
  updateUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
  convertCmToReadableHeight,
  getDietUrl,
  getCitiesByStateIdV2,
} from '../constants/functions';
import AppToast from '../components/AppToast';
import { SlidersIcon } from '../components/svg/SvgIcons';
import ProfileHeader from '../components/Header/ProfileHeader';
import {
  DRINKING_OPTIONS,
  ROUTES,
  SETTLING_DOWN_OPTIONS,
  SMOKING_OPTIONS,
} from '../constants/data';

const EditLifeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { user, states, loader, height, diet } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  // Form state - now using objects for state and city
  const [formData, setFormData] = useState({
    selectedState: null as any,
    selectedCity: null as any,
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
    stateId: '',
    districtId: '',
  });

  // Picker modal states
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showHeightPicker, setShowHeightPicker] = useState(false);
  const [showDietPicker, setShowDietPicker] = useState(false);
  const [showDrinkingPicker, setShowDrinkingPicker] = useState(false);
  const [showSmokingPicker, setShowSmokingPicker] = useState(false);
  const [showTimelinePicker, setShowTimelinePicker] = useState(false);

  // Loading state for cities
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [localCities, setLocalCities] = useState([]);

  // Fetch states when component mounts
  useEffect(() => {
    dispatch(getDiet(getDietUrl));
  }, [dispatch]);

  // Load cities when state is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (formData.selectedState?.id) {
        setCitiesLoading(true);
        try {
          const cities = await getCitiesByStateIdV2(formData.selectedState.id);
          setLocalCities(cities);
        } catch (error) {
          console.error('Error fetching cities:', error);
          setLocalCities([]);
        } finally {
          setCitiesLoading(false);
        }
      }
    };
    fetchCities();
  }, [formData.selectedState?.id]);

  // Initialize form data from user profile
  useEffect(() => {
    const initializeFormData = async () => {
      if (user && states && states.length > 0) {
        console.log('Initializing form data. User stateId:', user.stateId);
        console.log('Available states:', states);

        // Find state object from the fetched data
        const userState = states.find(
          (state: any) => String(state.name) === String(user.stateName),
        );
        console.log('Found user state:', userState);
        
        if (userState) {
          setCitiesLoading(true);
          try {
            const cities = await getCitiesByStateIdV2(userState.id);
            console.log('cities', cities);
            setLocalCities(cities);
            
            // Find user's city from the fetched cities
            const userCity = cities.find(
              (city: any) => String(city.id) === String(user.cityId),
            );
            
            setFormData(prev => ({
              ...prev,
              selectedState: userState, // Set the state object, not just the name
              selectedCity: userCity || null,
              heightId: user.heightId || '8',
              heightName: user.height || '5\'7"',
              dietId: user.dietId || '1',
              dietName: user.diet || '',
              drinkingName: user.drinking || '',
              smokingName: user.smoking || '',
              timelineName: user.planingto_settle || '',
              stateId: userState.id,
              districtId: userCity?.id || '',
            }));
          } catch (error) {
            console.error('Error fetching cities during initialization:', error);
          } finally {
            setCitiesLoading(false);
          }
        }
      }
    };
    initializeFormData();
  }, [user, states]);



  // Handle state selection and reset city when state changes
  const handleStateSelection = useCallback((selectedState: any) => {
    console.log('Selected state:', selectedState);
    setFormData(prev => ({
      ...prev,
      selectedState: selectedState,
      stateId: selectedState.id,
      selectedCity: null, // Reset city when state changes
    }));
    setShowStatePicker(false);
  }, []);

  // Handle city selection
  const handleCitySelection = useCallback((selectedCity: any) => {
    setFormData(prev => ({
      ...prev,
      districtId: selectedCity.id,
      selectedCity: selectedCity,
    }));
    setShowCityPicker(false);
  }, []);

  // Handle diet selection
  const handleDietSelection = useCallback((selectedDiet: any) => {
    console.log('selectedDiet', selectedDiet);
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
    try {
      const requestBody = {
        id: user.id,
        permanentAddress: {
          stateId: formData.stateId,
          districtId: formData.districtId,
        },
        heightId: formData.heightId,
        dietId: formData.dietId,
        drinking: formData.drinkingName,
        smoking: formData.smokingName,
        planingto_settle: formData.timelineName,
      };
      console.log('requestBody', requestBody);
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
      <ProfileHeader
           onBackPress={() => {
            handleSave();
            (navigation as any).navigate(ROUTES.STACK, {
              screen: ROUTES.ACCOUNT,
            } as never);
          }}
        title="Lifestyle & Hometown"
        icon={<SlidersIcon />}
      />

      <View style={styles.scrollView}>
        {/* State Dropdown */}
        <AppDropdown
          label=""
          selectedValue={formData.selectedState?.name || user.stateName}
          placeholder="Select State"
          onPress={() => {
            console.log('State dropdown pressed, available states:', states);
            console.log('States is array:', Array.isArray(states));
            if (states && states.length > 0) {
              setShowStatePicker(true);
            } else {
              console.warn('No states available for selection');
            }
          }}
        />

        {/* City Dropdown */}
        <AppDropdown
          label=""
          selectedValue={formData.selectedCity?.name || user.districtName}
          placeholder={citiesLoading ? 'Loading cities...' : 'Select City'}
          onPress={() => !citiesLoading && localCities.length > 0 && setShowCityPicker(true)}
          disabled={citiesLoading || !formData.selectedState || localCities.length === 0}
        />

        {/* Height Dropdown */}
        <AppDropdown
          label=""
          selectedValue={convertCmToReadableHeight(formData.heightName)}
          placeholder="Select Height"
          onPress={() => setShowHeightPicker(true)}
        />

        {/* Diet Preference Dropdown */}
        <AppDropdown
          label=""
          selectedValue={formData.dietName}
          placeholder="Select Diet Preference"
          onPress={() => setShowDietPicker(true)}
        />

        {/* Drinking Dropdown */}
        <AppDropdown
          label=""
          selectedValue={formData.drinkingName}
          placeholder="Do you drink?"
          onPress={() => setShowDrinkingPicker(true)}
        />

        {/* Smoking Dropdown */}
        <AppDropdown
          label=""
          selectedValue={formData.smokingName}
          placeholder="Smoking Habits"
          onPress={() => setShowSmokingPicker(true)}
        />

        {/* Timeline Dropdown */}
        <AppDropdown
          label=""
          selectedValue={formData.timelineName}
          placeholder="Marriage Timeline"
          onPress={() => setShowTimelinePicker(true)}
        />
      </View>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Save Button */}
      <AppButton
        title="Save"
        onPress={handleSave}
        isLoading={loader}
        isButtonDisabled={loader}
        buttonStyle={[styles.saveButton]}
        textStyle={[styles.saveButtonText]}
      />

      {/* Picker Modals */}
      <AppPickerModal
        visible={showStatePicker}
        items={states || []}
        selectedValue={formData.selectedState?.name || ''}
        onSelect={handleStateSelection}
        onClose={() => {
          console.log('State picker closed');
          setShowStatePicker(false);
        }}
        title="Select State"
        isObjects={true}
      />

      <AppPickerModal
        visible={showCityPicker}
        items={localCities}
        selectedValue={formData.selectedCity?.name || ''}
        onSelect={handleCitySelection}
        onClose={() => setShowCityPicker(false)}
        title="Select City"
        isObjects={true}
      />

      <AppPickerModal
        visible={showHeightPicker}
        title="Select Height"
        items={
          height
            ? height.map((h: any) => ({
                ...h,
                displayName: convertCmToReadableHeight(h.name),
              }))
            : []
        }
        selectedValue={formData.heightName}
        onSelect={item => {
          setFormData(prev => ({
            ...prev,
            heightId: item.id,
            heightName: item.name,
          }));
        }}
        onClose={() => setShowHeightPicker(false)}
        isObjects={true}
        displayProperty="displayName"
      />
      <AppPickerModal
        visible={showDietPicker}
        items={diet || []}
        selectedValue={formData.dietName}
        onSelect={handleDietSelection}
        onClose={() => setShowDietPicker(false)}
        title="Select Diet Preference"
        isObjects={true}
      />

      <AppPickerModal
        visible={showDrinkingPicker}
        items={DRINKING_OPTIONS.map((item, index) => ({
          id: index,
          name: item,
        }))}
        selectedValue={formData.drinkingName}
        onSelect={handleDrinkingSelection}
        onClose={() => setShowDrinkingPicker(false)}
        title="Do you drink?"
        isObjects={true}
      />

      <AppPickerModal
        visible={showSmokingPicker}
        items={SMOKING_OPTIONS.map((item, index) => ({
          id: index,
          name: item,
        }))}
        selectedValue={formData.smokingName}
        onSelect={handleSmokingSelection}
        onClose={() => setShowSmokingPicker(false)}
        title="Smoking Habits"
        isObjects={true}
      />

      <AppPickerModal
        visible={showTimelinePicker}
        items={SETTLING_DOWN_OPTIONS.map((item, index) => ({
          id: index,
          name: item,
        }))}
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
    padding: Size8,
    gap: Size20,
    paddingVertical: Size25,
  },
  content: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: COLORS.violet,
  },
  saveButtonText: {
    color: COLORS.white,
  },
});

export default EditLifeScreen;
