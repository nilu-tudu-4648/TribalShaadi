import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AppSafeView from '../components/AppSafeView';
import AppDropdown from '../components/AppDropdown';
import AppButton from '../components/AppButton';
import AppPickerModal from '../components/AppPickerModal';
import AppTextInput from '../components/AppTextInput';
import { COLORS } from '../constants/AppColors';
import { Size20, Size25, Size4, Size8, borderWidth } from '../constants/Sizes';
import {
  completeUserProfileV2Updated,
  getEducationTypes,
  getOccupation,
  getIncome,
} from '../store/reducers/authReducer';
import {
  updateUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
  getEducationTypeUrl,
  getOccupationUrl,
  getIncomeUrl,
} from '../constants/functions';
import AppToast from '../components/AppToast';
import ProfileHeader from '../components/Header/ProfileHeader';
import { EducationIcon } from '../components/svg/SvgIcons';
import { ROUTES } from '../constants/data';

// Company types - keeping as hardcoded since no specific API exists
const COMPANY_TYPES = [
  { id: '1', name: 'Private Company' },
  { id: '2', name: 'Government' },
  { id: '3', name: 'MNC' },
  { id: '4', name: 'Startup' },
  { id: '5', name: 'Self Employed' },
  { id: '6', name: 'Business' },
  { id: '7', name: 'Not Working' },
];

const EditEducationScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { user, loader, educationTypes, occupations, income } = useSelector(
    (state: any) => state.entities.authReducer,
  );

  console.log('user', user);
  // Data from API with fallback to empty arrays
  const educationTypesList = educationTypes || [];
  const jobRolesList = occupations || [];
  const salaryRangesList = income || [];

  // Form state
  const [formData, setFormData] = useState({
    educationTypeId: '',
    educationName: '',
    collegeName: '',
    companyTypeId: '',
    companyTypeName: '',
    jobRoleId: '',
    jobRoleName: '',
    companyName: '',
    salaryId: '',
    salaryName: '',
    annualIncome: '',
    annualIncomeId: '',
    occupationId: '',
    occupationName: '',
  });

  // Picker modal states
  const [showEducationPicker, setShowEducationPicker] = useState(false);
  const [showCompanyTypePicker, setShowCompanyTypePicker] = useState(false);
  const [showJobRolePicker, setShowJobRolePicker] = useState(false);
  const [showSalaryPicker, setShowSalaryPicker] = useState(false);

  // Fetch API data on component mount
  useEffect(() => {
    dispatch(getEducationTypes(getEducationTypeUrl));
    dispatch(getOccupation(getOccupationUrl));
    dispatch(getIncome(getIncomeUrl));
  }, [dispatch]);

  // Initialize form data from user profile
  useEffect(() => {
    if (user) {
      setFormData({
        occupationId: user.occupationId || '',
        educationTypeId: user.educationTypeId || '',
        occupationName: user.occupationName || '',
        educationName: user.educationType || '',
        collegeName: user.college_name || '',
        companyTypeId: user.companyTypeId || '1',
        companyTypeName: user.companyTypeName || 'Private Company',
        jobRoleId: user.jobRoleId || '1',
        jobRoleName: user.jobRoleName || 'Admin Professional',
        companyName: user.companyName || 'Tribalshaadi',
        salaryId: user.annualIncomeId || '',
        salaryName: user.annualIncome || '',
        annualIncome: user.annualIncome || '',
        annualIncomeId: user.annualIncomeId || '',
      });
    }
  }, [user]);

  // Handle education selection
  const handleEducationSelection = useCallback((selectedEducation: any) => {
    console.log('selectedEducation', selectedEducation);
    setFormData(prev => ({
      ...prev,
      educationTypeId: selectedEducation.id,
      educationName: selectedEducation.name,
    }));
    setShowEducationPicker(false);
  }, []);

  // Handle company type selection
  const handleCompanyTypeSelection = useCallback((selectedCompanyType: any) => {
    setFormData(prev => ({
      ...prev,
      companyTypeId: selectedCompanyType.id,
      companyTypeName: selectedCompanyType.name,
    }));
    setShowCompanyTypePicker(false);
  }, []);

  // Handle job role selection
  const handleJobRoleSelection = useCallback((selectedJobRole: any) => {
    setFormData(prev => ({
      ...prev,
      jobRoleId: selectedJobRole.id,
      jobRoleName: selectedJobRole.name,
    }));
    setShowJobRolePicker(false);
  }, []);

  // Handle salary selection
  const handleSalarySelection = useCallback((selectedSalary: any) => {
    console.log('selectedSalary', selectedSalary);
    setFormData(prev => ({
      ...prev,
      annualIncomeId: selectedSalary.id,
      salaryName: selectedSalary.value,
    }));
    setShowSalaryPicker(false);
  }, []);

  // Handle form submission
  const handleSave = useCallback(async () => {
    try {
      const requestBody = {
        id: user.id,
        educationTypeId: formData.educationTypeId,
        occupationId: formData.occupationId,
        college_name: formData.collegeName,
        companyTypeId: formData.companyTypeId,
        jobRoleId: formData.jobRoleId,
        companyName: formData.companyName,
        annualIncomeId: formData.annualIncomeId,
      };

      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });

      AppToast('Education & Career updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      AppToast('Error updating profile. Please try again.');
    }
  }, [formData, user, dispatch, navigation]);

  return (
    <AppSafeView style={styles.container}>
      <ProfileHeader
        title="Education & Career"
        onBackPress={() => {
          handleSave();
          (navigation as any).navigate(ROUTES.STACK, {
            screen: ROUTES.ACCOUNT,
          } as never);
        }}
        icon={<EducationIcon size={Size25} />}
      />
      <View style={styles.scrollView}>
        {/* Education Level Dropdown */}
        <View>
          <AppDropdown
            label=""
            selectedValue={formData.educationName}
            placeholder="Select Education Level"
            onPress={() => setShowEducationPicker(true)}
          />
        </View>

        {/* College/Institution Name */}
        <View>
          <AppTextInput
            placeholder="College/Institution Name"
            value={formData.collegeName}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, collegeName: text }))
            }
            keyboardType="default"
            textInputStyle={styles.textInput}
          />
        </View>

        {/* Company Type Dropdown */}
        <View>
          <AppDropdown
            label=""
            selectedValue={formData.companyTypeName}
            placeholder="Select Company Type"
            onPress={() => setShowCompanyTypePicker(true)}
            disabled={true}
          />
        </View>

        {/* Job Role Dropdown */}
        <View>
          <AppDropdown
            label=""
            selectedValue={formData.jobRoleName}
            placeholder="Select Job Role"
            onPress={() => setShowJobRolePicker(true)}
            disabled={true}
          />
        </View>

        {/* Company Name */}
        <View>
          <AppTextInput
            placeholder="Company Name"
            value={formData.companyName}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, companyName: text }))
            }
            keyboardType="default"
            textInputStyle={styles.textInput}
          />
        </View>

        {/* Salary Range Dropdown */}
        <View>
          <AppDropdown
            label=""
            selectedValue={formData.salaryName}
            placeholder="Select Salary Range"
            onPress={() => setShowSalaryPicker(true)}
          />
        </View>
      </View>

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
        visible={showEducationPicker}
        items={educationTypesList}
        selectedValue={formData.educationName}
        onSelect={handleEducationSelection}
        onClose={() => setShowEducationPicker(false)}
        title="Select Education Level"
        isObjects={true}
      />

      <AppPickerModal
        visible={showCompanyTypePicker}
        items={COMPANY_TYPES}
        selectedValue={formData.companyTypeName}
        onSelect={handleCompanyTypeSelection}
        onClose={() => setShowCompanyTypePicker(false)}
        title="Select Company Type"
        isObjects={true}
      />

      <AppPickerModal
        visible={showJobRolePicker}
        items={jobRolesList}
        selectedValue={formData.jobRoleName}
        onSelect={handleJobRoleSelection}
        onClose={() => setShowJobRolePicker(false)}
        title="Select Job Role"
        isObjects={true}
      />

      <AppPickerModal
        visible={showSalaryPicker}
        items={salaryRangesList}
        selectedValue={formData.salaryName}
        onSelect={handleSalarySelection}
        onClose={() => setShowSalaryPicker(false)}
        title="Select Salary Range"
        isObjects={true}
        displayProperty="value"
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
  textInput: {
    borderBottomWidth: borderWidth,
    backgroundColor: COLORS.white,
  },
  buttonContainer: {
    padding: Size4,
  },
  saveButton: {
    backgroundColor: COLORS.violet,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default EditEducationScreen;
