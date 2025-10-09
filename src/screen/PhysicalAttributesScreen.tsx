import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import {
  fontSize16,
  fontSize18,
  lignHeight24,
  Size12,
  Size8,
  lignHeight72,
  lignHeight20,
} from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import HeaderBack from '../components/HeaderBack';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import AppChip from '../components/AppChip';
import AppPickerModal from '../components/AppPickerModal';
import AppDropdown from '../components/AppDropdown';
import { useDispatch, useSelector } from 'react-redux';
import {
  completeUserProfileV2Updated,
  getDiet,
  getHeight,
} from '../store/reducers/authReducer';
import {
  convertCmToReadableHeight,
  getDietUrl,
  getHeightUrl,
  navigateToLastScreen,
  setReducerLoadingfalse,
  updateUrl,
} from '../constants/functions';
import { getUserDetailsApi } from '../constants/functions';
import { getUserDetailsUrl } from '../constants/functions';
import AppToast from '../components/AppToast';
import { DRINKING_OPTIONS, ROUTES, SMOKING_OPTIONS } from '../constants/data';
import { useNavigation } from '@react-navigation/native';

const PhysicalAttributesScreen = () => {
  const [selectedHeight, setSelectedHeight] = useState('');
  const [selectedHeightObject, setSelectedHeightObject] = useState<any>(null);
  const [selectedDiet, setSelectedDiet] = useState<any>(null);
  const [selectedDrinking, setSelectedDrinking] = useState('');
  const [selectedSmoking, setSelectedSmoking] = useState('');

  const [showHeightPicker, setShowHeightPicker] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user, loader, height, diet } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  // Diet options will come from the API

  useEffect(() => {
    dispatch(getHeight(getHeightUrl));
    dispatch(getDiet(getDietUrl));
  }, [dispatch]);

  const handleDietSelection = (dietOption: any) => {
    setSelectedDiet(dietOption);
  };
  const handleContinue = async () => {
    if (
      !selectedHeightObject ||
      !selectedDiet ||
      !selectedDrinking ||
      !selectedSmoking
    ) {
      AppToast('Please select all required fields');
      return;
    }

    try {
      const requestBody = {
        id: user.id,
        heightId: selectedHeightObject.id,
        dietId: selectedDiet.id,
        drinking: selectedDrinking,
        smoking: selectedSmoking,
      };
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
      console.error('Error submitting physical attributes:', error);
    } finally {
      navigateToLastScreen(navigation, ROUTES.ABOUT);
    }
  };

  const renderOptionButtons = (
    title: string,
    options: string[] | any[],
    selectedValue: string | any,
    onSelect: (value: string | any) => void,
    isObjectArray: boolean = false,
  ) => (
    <View style={styles.optionSection}>
      <AppText text={title} textStyle={styles.sectionTitle} />
      <View style={styles.optionButtonsContainer}>
        {options.map((option, index) => {
          const displayText = isObjectArray ? option.name : option;
          const key = isObjectArray ? option.id : index;
          const isSelected = isObjectArray
            ? selectedValue && selectedValue.id === option.id
            : selectedValue === option;
          return (
            <AppChip
              key={key}
              title={displayText}
              onPress={() => {
                console.log(
                  'Selected option:',
                  option,
                  'isObjectArray:',
                  isObjectArray,
                );
                onSelect(isObjectArray ? option : option);
              }}
              isSelected={isSelected}
            />
          );
        })}
      </View>
    </View>
  );

  const isFormValid =
    selectedHeightObject && selectedDiet && selectedDrinking && selectedSmoking;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <HeaderBack
          onPress={() => navigateToLastScreen(navigation, ROUTES.QUALIFICATION)}
        />

        {/* Title */}
        <AppText text="Height" textStyle={styles.title} />

        {/* Height Dropdown */}
        <AppDropdown
          label=""
          selectedValue={selectedHeight}
          placeholder="Select height"
          onPress={() => setShowHeightPicker(true)}
        />

        {/* Diet Section */}
        {renderOptionButtons(
          'Diet',
          diet || [],
          selectedDiet,
          handleDietSelection,
          true,
        )}

        {/* Drinking Section */}
        {renderOptionButtons(
          'Drinking',
          DRINKING_OPTIONS,
          selectedDrinking,
          setSelectedDrinking,
        )}

        {/* Smoking Section */}
        {renderOptionButtons(
          'Smoking',
          SMOKING_OPTIONS,
          selectedSmoking,
          setSelectedSmoking,
        )}

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Continue Button */}
        <AppButton
          title="Continue"
          onPress={handleContinue}
          isButtonDisabled={!isFormValid || loader}
          isLoading={loader}
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

      {/* Height Picker Modal */}
      <AppPickerModal
        visible={showHeightPicker}
        title="Select Height"
        items={
          height
            ? (() => {
                // Create a map to track unique display names and keep only the first occurrence
                const uniqueHeights = new Map();
                const processedHeights = height.map((h: any) => ({
                  ...h,
                  displayName: convertCmToReadableHeight(h.name),
                }));

                // Filter out duplicates based on displayName, keeping the first occurrence
                const deduplicatedHeights = processedHeights.filter(
                  (h: any) => {
                    if (!uniqueHeights.has(h.displayName)) {
                      uniqueHeights.set(h.displayName, true);
                      return true;
                    }
                    return false;
                  },
                );

                return deduplicatedHeights;
              })()
            : []
        }
        selectedValue={selectedHeight}
        onSelect={item => {
          const readableHeight = convertCmToReadableHeight(item.name);
          setSelectedHeight(readableHeight);
          setSelectedHeightObject(item);
        }}
        onClose={() => setShowHeightPicker(false)}
        isObjects={true}
        displayProperty="displayName"
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
    fontSize: fontSize16,
    fontWeight: '600',
    color: COLORS.violet,
  },
  sectionTitle: {
    fontSize: fontSize18,
    fontWeight: '600',
    color: COLORS.black,
  },
  optionSection: {
    gap: Size12,
  },
  optionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Size12,
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
    backgroundColor: COLORS.black,
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

export default PhysicalAttributesScreen;
