import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import {
  fontSize16,
  fontSize18,
  fontSize24,
  lignHeight24,
  Size8,
  lignHeight72,
  lignHeight20,
  Size16,
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
  getIncome,
  getOccupation,
} from '../store/reducers/authReducer';
import {
  getEducationTypeUrl,
  getIncomeUrl,
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

  const [showQualificationPicker, setShowQualificationPicker] = useState(false);
  const [showWorkExperiencePicker, setShowWorkExperiencePicker] =
    useState(false);
  const [showOccupationPicker, setShowOccupationPicker] = useState(false);
  const [showIncomePicker, setShowIncomePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, educationTypes, occupations, income, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const dispatch = useDispatch();
  const educationTypesList = educationTypes || [];
  const workExperiences = [
    { id: 1, name: 'Yes' },
    { id: 0, name: 'No' },
  ];
  const incomeList = income || [];
  useEffect(() => {
    dispatch(getEducationTypes(getEducationTypeUrl));
    dispatch(getOccupation(getOccupationUrl));
    dispatch(getIncome(getIncomeUrl));
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
      const requestBody = {
        id: user.id,
        educationTypeId: selectedQualification.id,
        college_name: collegeName,
        areYouWorking: selectedWorkExperience.id,
        occupationId: selectedOccupation.id,
        ...(selectedWorkExperience?.id === 1 && {
          companyName: organizationName,
          annualIncomeId: selectedIncome.id,
        }),
      };
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
    (selectedWorkExperience?.id === 1
      ? selectedIncome && organizationName // Only check income and organization name if working
      : true); // If not working, these fields are not required

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
          placeholder="Are you working?"
          onPress={() => setShowWorkExperiencePicker(true)}
        />

        {/* Occupation Dropdown */}
        <AppDropdown
          label=""
          selectedValue={selectedOccupation?.name || ''}
          placeholder="Occupation"
          onPress={() => setShowOccupationPicker(true)}
        />

        {/* Organization Name Text Input */}
        {selectedWorkExperience?.id === 1 && (
          <View style={styles.textInputContainer}>
            <AppTextInput
              placeholder="Organization name"
              value={organizationName}
              onChangeText={setOrganizationName}
              keyboardType="default"
              placeholderTextColor={COLORS.placeholderText}
              style={styles.textInputStyle}
            />
          </View>
        )}

        {/* Income Dropdown */}
        {selectedWorkExperience?.id === 1 && (
          <AppDropdown
            label=""
            selectedValue={selectedIncome?.value || ''}
            placeholder="Income"
            onPress={() => setShowIncomePicker(true)}
          />
        )}
        {/* Spacer */}
        <View style={styles.spacer} />
        <View style={styles.spacer} />
        <View style={styles.spacer} />
        {/* Continue Button */}
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
      </ScrollView>

      {/* Qualification Picker Modal */}
      <AppPickerModal
        visible={showQualificationPicker}
        title="Highest Qualification"
        items={educationTypesList}
        selectedValue={selectedQualification?.name || ''}
        onSelect={value => {
          // Store the full object
          setSelectedQualification(value);
        }}
        onClose={() => setShowQualificationPicker(false)}
        isObjects={true}
      />

      {/* Work Experience Picker Modal */}
      <AppPickerModal
        visible={showWorkExperiencePicker}
        title="Select Work Experience"
        items={workExperiences}
        selectedValue={selectedWorkExperience?.name || ''}
        onSelect={value => {
          // Store the full object
          setSelectedWorkExperience(value);
        }}
        onClose={() => setShowWorkExperiencePicker(false)}
        isObjects={true}
      />

      {/* Occupation Picker Modal */}
      <AppPickerModal
        visible={showOccupationPicker}
        title="Select Occupation"
        items={occupations}
        selectedValue={selectedOccupation?.name || ''}
        onSelect={value => {
          // Store the full object
          setSelectedOccupation(value);
        }}
        onClose={() => setShowOccupationPicker(false)}
        isObjects={true}
      />

      {/* Income Picker Modal */}
      <AppPickerModal
        visible={showIncomePicker}
        title="Select Income Range"
        items={incomeList}
        selectedValue={selectedIncome?.value || ''}
        onSelect={value => {
          // Store the full object
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
  content: {
    flex: 1,
    paddingHorizontal: lignHeight24,
    paddingVertical: lignHeight24,
    paddingTop: lignHeight72,
    gap: lignHeight20,
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

export default QualificationScreen;
