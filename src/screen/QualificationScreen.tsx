import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import {
  fontSize16,
  fontSize18,
  fontSize24,
  lignHeight24,
  Size8,
  lignHeight20,
  Size16,
  screenHeight,
} from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import HeaderBack from '../components/HeaderBack';
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput';
import AppDropdown from '../components/AppDropdown';
import AppPickerModal from '../components/AppPickerModal';
import {
  completeUserProfileV2Updated,
  getEducationTypes,
  getEmploymentTypes,
  getIncome,
  getOccupation,
  getOccupationCategoriesByOccupationId,
  getOccupationsByEmploymentType,
} from '../store/reducers/authReducer';
import {
  getEducationTypeUrl,
  getEmploymentTypeUrl,
  getIncomeUrl,
  getOccupationByEmploymentTypeUrl,
  getOccupationCategoryByOccupationIdUrl,
  getOccupationUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
  updateUrl,
} from '../constants/functions';
import { useDispatch, useSelector } from 'react-redux';
import AppText from '../components/AppText';
import AppToast from '../components/AppToast';

const QualificationScreen = () => {
  const [selectedQualification, setSelectedQualification] = useState<any>(null);
  const [collegeName, setCollegeName] = useState('');
  const [selectedWorkExperience, setSelectedWorkExperience] =
    useState<any>(null);
  const [selectedOccupation, setSelectedOccupation] = useState<any>(null);
  const [organizationName, setOrganizationName] = useState('');
  const [selectedIncome, setSelectedIncome] = useState<any>(null);
  const [selectedOccupationCategory, setSelectedOccupationCategory] =
    useState<any>(null);
  const [showOccupationCategoryPicker, setShowOccupationCategoryPicker] =
    useState(false);
  const [showQualificationPicker, setShowQualificationPicker] = useState(false);
  const [showWorkExperiencePicker, setShowWorkExperiencePicker] =
    useState(false);
  const [showOccupationPicker, setShowOccupationPicker] = useState(false);
  const [showIncomePicker, setShowIncomePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    user,
    educationTypes,
    income,
    loader,
    employmentTypes,
    occupationsByEmploymentType,
    occupationCategories,
  } = useSelector((state: any) => state.entities.authReducer);
  const dispatch = useDispatch();
  const educationTypesList = educationTypes || [];
  const incomeList = income || [];
  useEffect(() => {
    dispatch(getEducationTypes(getEducationTypeUrl));
    dispatch(getEmploymentTypes(getEmploymentTypeUrl));
    dispatch(getOccupation(getOccupationUrl));
  }, [dispatch]);

  const handleContinue = async () => {
    if (
      !selectedQualification ||
      !selectedWorkExperience ||
      !selectedOccupation
    ) {
      AppToast('Please select all required fields');
      return false;
    }

    setLoading(true);

    try {
      const isWorking = selectedWorkExperience?.name !== 'Not Working';
      const requestBody = {
        id: user.id,
        educationTypeId: selectedQualification.id,
        college_name: collegeName,
        employmentTypeId: selectedWorkExperience.id,
        ...(isWorking && { 
          occupationId: selectedOccupation.id,
          occupationCategoryId: selectedOccupationCategory.id,
          companyName: organizationName,
          annualIncomeId: selectedIncome.id, 
        }),
      };
      console.log(requestBody, 'requestBody');
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
      console.error('Error submitting qualification:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    selectedQualification &&
    selectedWorkExperience &&
    selectedOccupation &&
    (selectedWorkExperience?.name !== 'Not Working'
      ? selectedIncome // Only check income and organization name if working
      : true); // If not working, these fields are not required

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
          {/* Title */}
          <AppText text="Your highest qualification" textStyle={styles.title} />

          {/* Highest Qualification Dropdown */}
          <AppDropdown
            label=""
            selectedValue={selectedQualification?.name || ''}
            placeholder="Select highest degree"
            onPress={() => setShowQualificationPicker(true)}
          />

          {/* College/University/School Text Input */}
          <View style={styles.textInputContainer}>
            <AppTextInput
              placeholder="College/University/School"
              value={collegeName}
              onChangeText={setCollegeName}
              keyboardType="default"
              placeholderTextColor={COLORS.placeholderText}
              style={styles.textInputStyle}
            />
          </View>

          {/* Work Experience Section */}
          <AppText text="Work Experience" textStyle={styles.sectionTitle} />

          {/* Work Experience Dropdown */}
          <AppDropdown
            label=""
            selectedValue={selectedWorkExperience?.name || ''}
            placeholder="You are working with?"
            onPress={() => setShowWorkExperiencePicker(true)}
          />
          {selectedWorkExperience?.name !== 'Not Working' && (
            <>
              {/* Occupation Dropdown */}
              <AppDropdown
                label=""
                selectedValue={selectedOccupation?.name || ''}
                placeholder="Occupation"
                onPress={() => setShowOccupationPicker(true)}
              />
              {/* Occupation Dropdown */}
              <AppDropdown
                label=""
                selectedValue={selectedOccupationCategory?.name || ''}
                placeholder="Occupation Category"
                onPress={() => setShowOccupationCategoryPicker(true)}
              />

             
             {/* Organization Name Text Input */}
             <AppTextInput
               placeholder="Organization Name"
               value={organizationName}
               onChangeText={setOrganizationName}
               keyboardType="default"
               placeholderTextColor={COLORS.placeholderText}
               style={styles.textInputStyle}
             />
              {/* Income Dropdown */}

              <AppDropdown
                label=""
                selectedValue={selectedIncome?.value || ''}
                placeholder="Income"
                onPress={() => setShowIncomePicker(true)}
              />
            </>
          )}
        </View>
      </ScrollView>

      {/* Continue Button - Fixed at bottom */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Continue"
          onPress={handleContinue}
          isButtonDisabled={!isFormValid || loading}
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

      {/* Qualification Picker Modal */}
      <AppPickerModal
        visible={showQualificationPicker}
        title="Highest Qualification"
        items={educationTypesList}
        selectedValue={selectedQualification?.name || ''}
        onSelect={value => {
          setSelectedQualification(value);
        }}
        onClose={() => setShowQualificationPicker(false)}
        isObjects={true}
      />

      {/* Work Experience Picker Modal */}
      <AppPickerModal
        visible={showWorkExperiencePicker}
        title="You are working with"
        items={employmentTypes.filter((item: any) => item.name !== 'any')}
        selectedValue={selectedWorkExperience?.name || ''}
        onSelect={value => {
          setSelectedWorkExperience(value);
          dispatch(
            getOccupationsByEmploymentType(
              getOccupationByEmploymentTypeUrl + value.id,
            ),
          );
        }}
        onClose={() => setShowWorkExperiencePicker(false)}
        isObjects={true}
      />

      {/* Occupation Picker Modal */}
      <AppPickerModal
        visible={showOccupationPicker}
        title="Select Occupation"
        items={occupationsByEmploymentType}
        selectedValue={selectedOccupation?.name || ''}
        onSelect={value => {
          setSelectedOccupation(value);
          dispatch(
            getOccupationCategoriesByOccupationId(
              getOccupationCategoryByOccupationIdUrl + value.id,
            ),
          );
        }}
        onClose={() => setShowOccupationPicker(false)}
        isObjects={true}
      />
      {/* Occupation Picker Modal */}
      <AppPickerModal
        visible={showOccupationCategoryPicker}
        title="Select Occupation Category"
        items={occupationCategories}
        selectedValue={selectedOccupationCategory?.name || ''}
        onSelect={value => {
          dispatch(getIncome(getIncomeUrl));
          setSelectedOccupationCategory(value);
        }}
        onClose={() => setShowOccupationCategoryPicker(false)}
        isObjects={true}
      />

      {/* Income Picker Modal */}
      <AppPickerModal
        visible={showIncomePicker}
        title="Select Income Range"
        items={incomeList}
        selectedValue={selectedIncome?.value || ''}
        onSelect={value => {
          setSelectedIncome(value);
        }}
        onClose={() => setShowIncomePicker(false)}
        isObjects={true}
        displayProperty="value"
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
    paddingBottom: screenHeight(2), // Small bottom padding for scrollview
  },
  content: {
    paddingHorizontal: lignHeight24,
    paddingVertical: screenHeight(2), // Responsive vertical padding
    gap: lignHeight20,
    paddingTop: screenHeight(1.5), // Responsive top padding
  },
  title: {
    fontSize: fontSize24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  sectionTitle: {
    fontSize: fontSize18,
    fontWeight: '600',
    color: COLORS.black,
    paddingTop: Size16,
  },
  textInputContainer: {
    // Container for text inputs
  },
  textInputStyle: {
    // Text input styling
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

export default QualificationScreen;
