import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import {
  fontSize16,
  fontSize24,
  lignHeight24,
  Size12,
  Size16,
  Size40,
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
  getMaritalStatus,
  getStates,
} from '../store/reducers/authReducer';
import {
  getStatesUrl,
  getCitiesUrl,
  getMaritalStatusUrl,
  updateUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
} from '../constants/functions';
import { getCities } from '../store/reducers/authReducer';
import AppText from '../components/AppText';
import AppToast from '../components/AppToast';

const AddressScreen = () => {
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<any>(null);
  const [selectedSettlingDown, setSelectedSettlingDown] = useState('');
  const [selectedKids, setSelectedKids] = useState('');
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showMaritalStatusPicker, setShowMaritalStatusPicker] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const { user, states, cities, maritalStatuses, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStates(getStatesUrl));
    dispatch(getMaritalStatus(getMaritalStatusUrl));
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
  const maritalStatusesList = useMemo(
    () => maritalStatuses || [],
    [maritalStatuses],
  );

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
      !selectedMaritalStatus ||
      !selectedSettlingDown
    ) {
      AppToast('Please select all required fields');
      return false;
    }

    try {
      const requestBody = {
        id: user.id,
        maritalStatusId: selectedMaritalStatus.id,
        permanentAddress: {
          stateId: selectedState.id,
          districtId: selectedCity.id,
        },
        planingto_settle: selectedSettlingDown,
        kids: selectedKids,
      };
      console.log(requestBody, 'requestBody');
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
      console.error('Error submitting address:', error);
    }
  }, [
    selectedState,
    selectedCity,
    selectedMaritalStatus,
    selectedSettlingDown,
    selectedKids,
    user,
    dispatch,
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

  // Handle marital status selection
  const handleMaritalStatusSelection = useCallback((status: any) => {
    setSelectedMaritalStatus(status);
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
      selectedMaritalStatus &&
      selectedSettlingDown &&
      selectedKids

    );
  }, [
    selectedState,
    selectedCity,
    selectedMaritalStatus,
    selectedSettlingDown,
    selectedKids,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
         <HeaderBack />
          {/* State Dropdown */}
          <AppDropdown
            label=""
            selectedValue={selectedState?.name || ''}
            placeholder="Home State/UT"
            onPress={() => setShowStatePicker(true)}
          />

          {/* City Dropdown */}
          <AppDropdown
            label=""
            selectedValue={selectedCity?.name || ''}
            placeholder={citiesLoading ? 'Loading cities...' : 'Home City'}
            onPress={() => !citiesLoading && setShowCityPicker(true)}
            disabled={citiesLoading || !selectedState}
          />
          <View style={{ height: Size16 }} />
          {/* Marital Status Dropdown */}
          <AppDropdown
            label="Marital Status"
            selectedValue={selectedMaritalStatus?.name || ''}
            placeholder="Select your marital status"
            onPress={() => setShowMaritalStatusPicker(true)}
          />
          <View style={{ height: Size16/2 }} />
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
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: screenHeight(2),
  },
  content: {
    paddingHorizontal: lignHeight24,
    paddingVertical: screenHeight(2),
    gap: lignHeight24,
    paddingTop: screenHeight(4),
  },
  backButton: {
    width: Size40,
    height: Size40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: fontSize24,
    color: COLORS.textBlack,
    fontWeight: '400',
  },
  title: {
    fontSize: fontSize24,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
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
  continueButton: {
    borderRadius: Size8,
    alignItems: 'center',
    justifyContent: 'center',
    height: screenHeight(6), // Responsive button height
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
});

export default AddressScreen;
