import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import {
  fontSize16,
  lignHeight24,
  Size12,
  Size16,
  Size8,
  screenHeight,
} from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import HeaderBack from '../components/HeaderBack';
import AppButton from '../components/AppButton';
import AppDropdown from '../components/AppDropdown';
import AppPickerModal from '../components/AppPickerModal';
import AppChip from '../components/AppChip';
import { useDispatch, useSelector } from 'react-redux';
import {
  completeUserProfileV2Updated,
  getStates,
} from '../store/reducers/authReducer';
import {
  getStatesUrl,
  getCitiesUrl,
  updateUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
  navigateToLastScreen,
} from '../constants/functions';
import { getCities } from '../store/reducers/authReducer';
import AppText from '../components/AppText';
import AppToast from '../components/AppToast';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../constants/data';
import { globalStyles } from '../constants/globalStyles';
import { usePostHog } from 'posthog-react-native';
const AddressScreen = () => {
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedSettlingDown, setSelectedSettlingDown] = useState('');
  const [selectedKids, setSelectedKids] = useState('');
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const { user, states, cities, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const posthog = usePostHog();
  useEffect(() => {
    dispatch(getStates(getStatesUrl));
  }, [dispatch]);

  // Load cities when state is selected
  useEffect(() => {
    if (selectedState?.id) {
      setCitiesLoading(true);
      dispatch(getCities(`${getCitiesUrl}?stateId=${selectedState.id}`));
    }
  }, [selectedState?.id, dispatch]);

  // Stop loading when cities are received
  useEffect(() => {
    if (cities && cities.length >= 0) {
      setCitiesLoading(false);
    }
  }, [cities]);

  // Memoize the lists to avoid unnecessary re-renders
  const statesList = useMemo(() => states || [], [states]);


  // Get filtered cities - filter by selected state
  const filteredCities = useMemo(() => {
    if (!selectedState?.id || !cities) return [];
    return cities.filter((city: any) => city.stateId === selectedState.id);
  }, [selectedState?.id, cities]);

  // Memoize settling down options
  const settlingDownOptions = useMemo(
    () => [
      'Within 6 months',
      'Within a year',
      'Within 2 year',
      'Within 3 year',
      'Undecided',
    ],
    [],
  );
  // Kids
  const kidsOptions = useMemo(
    () => [
      'Want Someday',
      'Don’t Want',
      'Undecided',
    ],
    [],
  );

  const handleContinue = useCallback(async () => {
    if (
      !selectedState ||
      !selectedCity ||
      !selectedSettlingDown
    ) {
      AppToast('Please select all required fields');
      return false;
    }
    posthog.capture('hometown_selected')
    try {
      const requestBody = {
        id: user.id,
        permanentAddress: {
          stateId: selectedState.id,
          districtId: selectedCity.id,
        },
        planingto_settle: selectedSettlingDown,
        kids: selectedKids,
      };
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
    } finally {
      navigateToLastScreen(navigation, ROUTES.QUALIFICATION);
    }
  }, [
    selectedState,
    selectedCity,
    selectedSettlingDown,
    selectedKids,
    user,
    dispatch,
    navigation,
  ]);

  // Handle state selection and reset city when state changes
  const handleStateSelection = useCallback((state: any) => {
    setSelectedState(state);
    setSelectedCity(null); // Reset city when state changes
  }, []);

  // Handle city selection
  const handleCitySelection = useCallback((city: any) => {
    setSelectedCity(city);
  }, []);



  // Handle settling down selection
  const handleSettlingDownSelection = useCallback((option: string) => {
    setSelectedSettlingDown(option);
  }, []);

  // Handle kids selection
  const handleKidsSelection = useCallback((option: string) => {
    setSelectedKids(option);
  }, []);

  // Memoize form validation
  const isFormValid = useMemo(() => {
    return (
      selectedState &&
      selectedCity &&
      selectedSettlingDown &&
      selectedKids

    );
  }, [
    selectedState,
    selectedCity,
    selectedSettlingDown,
    selectedKids,
  ]);

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView 
        style={globalStyles.scrollView}
        contentContainerStyle={globalStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={globalStyles.content}>
         <HeaderBack 
            onPress={() => navigateToLastScreen(navigation, ROUTES.RELIGION)} 
            progress={0.4}
          />
          {/* State Dropdown */}
          <View style={{ gap: Size8 }}>
          <AppDropdown
            label="Home Town"
            selectedValue={selectedState?.name || ''}
            placeholder="Select State"
            onPress={() => setShowStatePicker(true)}
          />

          {/* City Dropdown */}
          <AppDropdown
            label=""
            selectedValue={selectedCity?.name || ''}
            placeholder={citiesLoading ? 'Loading cities...' : 'Select City'}
            onPress={() => !citiesLoading && setShowCityPicker(true)}
            disabled={citiesLoading || !selectedState}
          />
          </View>
          <View style={{ height: Size16 }} />
          {/* Planning to settle down Chips */}
          <View style={styles.chipSection}>
            <AppText
              text="Planning to settle down"
              textStyle={styles.chipSectionTitle}
            />
            <View style={styles.chipContainer}>
              {settlingDownOptions.map((option, index) => (
                <AppChip
                  key={index}
                  title={option}
                  onPress={() => handleSettlingDownSelection(option)}
                  isSelected={selectedSettlingDown === option}
                />
              ))}
            </View>
          </View>
          <View style={{ height: Size8/2 }} />
          <View style={styles.chipSection}>
            <AppText
              text="Kids"
              textStyle={styles.chipSectionTitle}
            />
            <View style={styles.chipContainer}>
              {kidsOptions.map((option, index) => (
                <AppChip
                  key={index}
                  title={option}
                  onPress={() => handleKidsSelection(option)}
                  isSelected={selectedKids === option}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Continue Button - Fixed at bottom */}
      <View style={styles.buttonContainer}>
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

      {/* State Picker Modal */}
      <AppPickerModal
        visible={showStatePicker}
        title="Select State/UT"
        items={statesList}
        selectedValue={selectedState?.name || ''}
        onSelect={handleStateSelection}
        onClose={() => setShowStatePicker(false)}
        isObjects={true}
      />

      {/* City Picker Modal */}
      <AppPickerModal
        visible={showCityPicker}
        title="Select City"
        items={filteredCities}
        selectedValue={selectedCity?.name || ''}
        onSelect={handleCitySelection}
        onClose={() => setShowCityPicker(false)}
        isObjects={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  chipSection: {
    gap: Size16,
  },
  chipSectionTitle: {
    fontSize: fontSize16,
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Size12,
  },
  buttonContainer: {
    paddingHorizontal: lignHeight24,
    paddingVertical: screenHeight(2), // Responsive padding
    paddingBottom: screenHeight(3), // Extra bottom padding for safe area
    backgroundColor: COLORS.white,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.borderLight,
  },
});

export default AddressScreen;
