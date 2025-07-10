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
import AppTextInput from '../components/AppTextInput';
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

// Education levels
const EDUCATION_LEVELS = [
  { id: '1', name: 'B.E / B.TECH' },
  { id: '2', name: 'M.E / M.TECH' },
  { id: '3', name: 'B.SC' },
  { id: '4', name: 'M.SC' },
  { id: '5', name: 'BCA' },
  { id: '6', name: 'MCA' },
  { id: '7', name: 'MBA' },
  { id: '8', name: 'B.COM' },
  { id: '9', name: 'M.COM' },
  { id: '10', name: 'BA' },
  { id: '11', name: 'MA' },
  { id: '12', name: 'PhD' },
  { id: '13', name: 'Diploma' },
  { id: '14', name: '12th Pass' },
  { id: '15', name: 'Graduate' },
];

// Company types
const COMPANY_TYPES = [
  { id: '1', name: 'Private Company' },
  { id: '2', name: 'Government' },
  { id: '3', name: 'MNC' },
  { id: '4', name: 'Startup' },
  { id: '5', name: 'Self Employed' },
  { id: '6', name: 'Business' },
  { id: '7', name: 'Not Working' },
];

// Job roles
const JOB_ROLES = [
  { id: '1', name: 'Admin Professional' },
  { id: '2', name: 'Software Engineer' },
  { id: '3', name: 'Manager' },
  { id: '4', name: 'Team Lead' },
  { id: '5', name: 'Consultant' },
  { id: '6', name: 'Analyst' },
  { id: '7', name: 'Designer' },
  { id: '8', name: 'Developer' },
  { id: '9', name: 'Teacher' },
  { id: '10', name: 'Doctor' },
  { id: '11', name: 'Other' },
];

// Salary ranges
const SALARY_RANGES = [
  { id: '1', name: 'Below 2 Lakh' },
  { id: '2', name: 'INR 2 Lakh to 5 Lakh' },
  { id: '3', name: 'INR 5 Lakh to 7 Lakh' },
  { id: '4', name: 'INR 7 Lakh to 10 Lakh' },
  { id: '5', name: 'INR 10 Lakh to 15 Lakh' },
  { id: '6', name: 'INR 15 Lakh to 20 Lakh' },
  { id: '7', name: 'INR 20 Lakh to 30 Lakh' },
  { id: '8', name: 'Above 30 Lakh' },
];

const EditEducationScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { user, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );

  // Form state
  const [formData, setFormData] = useState({
    educationId: '',
    educationName: '',
    collegeName: '',
    companyTypeId: '',
    companyTypeName: '',
    jobRoleId: '',
    jobRoleName: '',
    companyName: '',
    salaryId: '',
    salaryName: '',
  });

  // Picker modal states
  const [showEducationPicker, setShowEducationPicker] = useState(false);
  const [showCompanyTypePicker, setShowCompanyTypePicker] = useState(false);
  const [showJobRolePicker, setShowJobRolePicker] = useState(false);
  const [showSalaryPicker, setShowSalaryPicker] = useState(false);

  // Initialize form data from user profile
  useEffect(() => {
    if (user) {
      setFormData({
        educationId: user.educationId || '1',
        educationName: user.educationName || 'B.E / B.TECH',
        collegeName: user.collegeName || 'NIT, Jamshedpur',
        companyTypeId: user.companyTypeId || '1',
        companyTypeName: user.companyTypeName || 'Private Company',
        jobRoleId: user.jobRoleId || '1',
        jobRoleName: user.jobRoleName || 'Admin Professional',
        companyName: user.companyName || 'Tribalshaadi',
        salaryId: user.salaryId || '4',
        salaryName: user.salaryName || 'INR 7 Lakh to 10 Lakh',
      });
    }
  }, [user]);

  // Handle education selection
  const handleEducationSelection = useCallback((selectedEducation: any) => {
    setFormData(prev => ({
      ...prev,
      educationId: selectedEducation.id,
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
    setFormData(prev => ({
      ...prev,
      salaryId: selectedSalary.id,
      salaryName: selectedSalary.name,
    }));
    setShowSalaryPicker(false);
  }, []);

  // Handle form submission
  const handleSave = useCallback(async () => {
    // Validate required fields
    if (!formData.educationId) {
      AppToast('Please select your education level');
      return;
    }
    
    if (!formData.collegeName.trim()) {
      AppToast('Please enter your college/institution name');
      return;
    }
    
    if (!formData.companyTypeId) {
      AppToast('Please select your company type');
      return;
    }
    
    if (!formData.jobRoleId) {
      AppToast('Please select your job role');
      return;
    }

    try {
      const requestBody = {
        id: user.id,
        educationId: formData.educationId,
        collegeName: formData.collegeName,
        companyTypeId: formData.companyTypeId,
        jobRoleId: formData.jobRoleId,
        companyName: formData.companyName,
        salaryId: formData.salaryId,
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
      <AppHeader title="Education & Career" />
      
      <AppScrollView 
        style={styles.scrollView}
        otherProps={{ contentContainerStyle: styles.scrollContent }}
      >
        {/* Education Level Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.educationName}
            placeholder="Select Education Level"
            onPress={() => setShowEducationPicker(true)}
          />
        </View>

        {/* College/Institution Name */}
        <View style={styles.fieldContainer}>
          <AppTextInput
            placeholder="College/Institution Name"
            value={formData.collegeName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, collegeName: text }))}
            keyboardType="default"
            textInputStyle={styles.textInput}
          />
        </View>

        {/* Company Type Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.companyTypeName}
            placeholder="Select Company Type"
            onPress={() => setShowCompanyTypePicker(true)}
          />
        </View>

        {/* Job Role Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.jobRoleName}
            placeholder="Select Job Role"
            onPress={() => setShowJobRolePicker(true)}
          />
        </View>

        {/* Company Name */}
        <View style={styles.fieldContainer}>
          <AppTextInput
            placeholder="Company Name"
            value={formData.companyName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, companyName: text }))}
            keyboardType="default"
            textInputStyle={styles.textInput}
          />
        </View>

        {/* Salary Range Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.salaryName}
            placeholder="Select Salary Range"
            onPress={() => setShowSalaryPicker(true)}
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
        visible={showEducationPicker}
        items={EDUCATION_LEVELS}
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
        items={JOB_ROLES}
        selectedValue={formData.jobRoleName}
        onSelect={handleJobRoleSelection}
        onClose={() => setShowJobRolePicker(false)}
        title="Select Job Role"
        isObjects={true}
      />

      <AppPickerModal
        visible={showSalaryPicker}
        items={SALARY_RANGES}
        selectedValue={formData.salaryName}
        onSelect={handleSalarySelection}
        onClose={() => setShowSalaryPicker(false)}
        title="Select Salary Range"
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
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.borderGrey,
    borderRadius: Size16,
    paddingHorizontal: Size16,
    paddingVertical: Size16,
    backgroundColor: COLORS.white,
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

export default EditEducationScreen;