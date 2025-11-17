import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AppSafeView from '../components/AppSafeView';
import AppDropdown from '../components/AppDropdown';
import AppButton from '../components/AppButton';
import AppPickerModal from '../components/AppPickerModal';
import AppSectionedPickerModal from '../components/AppSectionedPickerModal';
import AppTextInput from '../components/AppTextInput';
import { COLORS } from '../constants/AppColors';
import { Size20, Size25, Size4, Size8, borderWidth } from '../constants/Sizes';
import {
  completeUserProfileV2Updated,
  getEducationTypes,
  getOccupation,
  getIncome,
  getEmploymentTypes,
  getOccupationsByEmploymentType,
} from '../store/reducers/authReducer';
import {
  updateUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
  getOccupationUrl,
  getIncomeUrl,
  getEmploymentTypeUrl,
  getOccupationByEmploymentTypeUrl,
  getOccupationCategoryByOccupationIdUrl,
  getEducationUrl,
} from '../constants/functions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/functions';
import AppToast from '../components/AppToast';
import ProfileHeader from '../components/Header/ProfileHeader';
import { EducationIcon } from '../components/svg/SvgIcons';
import { ROUTES } from '../constants/data';
import { globalStyles } from '../constants/globalStyles';

const EditEducationScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    user,
    loader,
    educationTypes,
    income,
    employmentTypes,
    occupationsByEmploymentType,
  } = useSelector((state: any) => state.entities.authReducer);
  // Data from API with fallback to empty arrays
  const salaryRangesList = income || [];

  // Form state
  const [formData, setFormData] = useState({
    educationTypeId: '',
    educationId: '',
    educationName: '',
    collegeName: '',
    employmentTypeId: '',
    companyTypeName: '',
    jobRoleName: '',
    companyName: '',
    salaryId: '',
    salaryName: '',
    annualIncome: '',
    annualIncomeId: '',
    occupationId: '',
    occupationName: '',
    occupationCategoryName: '',
    occupationCategoryId: '',
  });

  // Picker modal states
  const [showEducationPicker, setShowEducationPicker] = useState(false);
  const [showCompanyTypePicker, setShowCompanyTypePicker] = useState(false);
  const [showJobRolePicker, setShowJobRolePicker] = useState(false);
  const [sectionedOccupationOptions, setSectionedOccupationOptions] = useState<
    any[]
  >([]);
  const [educationSections, setEducationSections] = useState<any[]>([]);
  // const [showOccupationCategoryPicker, setShowOccupationCategoryPicker] = useState(false);
  const [showSalaryPicker, setShowSalaryPicker] = useState(false);

  // Fetch API data on component mount
  useEffect(() => {
    dispatch(getEducationTypes(getEducationUrl));
    dispatch(getEmploymentTypes(getEmploymentTypeUrl));
    dispatch(getOccupation(getOccupationUrl));
    dispatch(getIncome(getIncomeUrl));
  }, [dispatch]);

  // Build sectioned education list whenever educationTypes changes
  useEffect(() => {
    if (!Array.isArray(educationTypes)) {
      setEducationSections([]);
      return;
    }
    const sections = educationTypes.map((type: any) => ({
      id: type.id,
      title: type.name,
      data: Array.isArray(type.educations)
        ? type.educations.map((e: any) => ({
            id: e.id,
            name: e.name,
            educationTypeId: type.id,
          }))
        : [],
    }));
    setEducationSections(sections);
  }, [educationTypes]);

  // Build grouped list for job roles when picker opens
  useEffect(() => {
    const buildSections = async () => {
      if (!showJobRolePicker) return;
      if (!Array.isArray(occupationsByEmploymentType)) return;
      try {
        const token = await AsyncStorage.getItem('userToken');
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : undefined;
        const sections = await Promise.all(
          occupationsByEmploymentType.map(async (occ: any) => {
            try {
              const url = `${baseUrl}${getOccupationCategoryByOccupationIdUrl}${occ.id}`;
              const response = await axios.get(url, { headers });
              const list = response?.data?.recordList || [];
              return {
                id: occ.id,
                title: occ.name,
                data: list.map((c: any) => ({ id: c.id, name: c.name })),
              };
            } catch (e) {
              return { id: occ.id, title: occ.name, data: [] };
            }
          }),
        );
        setSectionedOccupationOptions(sections);
      } catch (e) {
        setSectionedOccupationOptions([]);
      }
    };

    buildSections();
  }, [showJobRolePicker, occupationsByEmploymentType]);
  console.log(user,'user')
  // Initialize form data from user profile
  useEffect(() => {
    if (user) {
      setFormData({
        occupationId: user.occupationId || '',
        educationTypeId: user.educationTypeId || '',
        educationId: user.educationId || '',
        occupationName: user.occupationName || '',
        educationName: user.education || '',
        collegeName: user.college_name || '',
        employmentTypeId: user.employmentTypeId || '1',
        companyTypeName: user.employmentType || '',
        jobRoleName: user.occupationCategoryName || '',
        companyName: user.companyName || '',
        salaryId: user.annualIncomeId || '',
        salaryName: user.annualIncome || '',
        annualIncome: user.annualIncome || '',
        annualIncomeId: user.annualIncomeId || '',
        occupationCategoryName: user.occupationCategoryName || '',
        occupationCategoryId: user.occupationCategoryId || '',
      });
      dispatch(
        getOccupationsByEmploymentType(
          getOccupationByEmploymentTypeUrl + user.employmentTypeId,
        ),
      );
    }
  }, [user, dispatch]);

  // Handle education selection from sectioned picker
  const handleEducationSelection = useCallback((item: any, section: any) => {
    setFormData(prev => ({
      ...prev,
      educationTypeId: (item && item.educationTypeId) || (section && section.id) || '',
      educationName: item?.name || '',
      educationId: item?.id || '',
    }));
    setShowEducationPicker(false);
  }, []);

  // Handle company type selection
  const handleCompanyTypeSelection = useCallback(
    (selectedCompanyType: any) => {
      setFormData(prev => ({
        ...prev,
        employmentTypeId: selectedCompanyType.id,
        companyTypeName: selectedCompanyType.name,
        jobRoleName: '',
        occupationCategoryName:""
      }));
      dispatch(
        getOccupationsByEmploymentType(
          getOccupationByEmploymentTypeUrl + selectedCompanyType.id,
        ),
      );

      setShowCompanyTypePicker(false);
      setSectionedOccupationOptions([]);
    },
    [dispatch],
  );

  // Handle job role selection
  const handleJobRoleSelection = useCallback((category: any, section: any) => {
    setFormData(prev => ({
      ...prev,
      jobRoleName: section?.title || '',
      occupationId: section?.id || '',
      occupationCategoryName: category?.name || '',
      occupationCategoryId: category?.id || '',
    }));
    setShowJobRolePicker(false);
  }, []);
  console.log(formData, 'formData.jobRoleName');
  // Handle salary selection
  const handleSalarySelection = useCallback((selectedSalary: any) => {
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
      const isWorking = formData.companyTypeName !== 'Not Working';
      const requestBody = {
        id: user.id,
        college_name: formData.collegeName,
        educationTypeId:formData.educationTypeId,
        educationId: formData.educationId,
        employmentTypeId: formData.employmentTypeId,
        occupationId: formData.occupationId,
        occupationCategoryId: !isWorking ? null : formData.occupationCategoryId,
        companyName: !isWorking ? null : formData.companyName,
        annualIncomeId: !isWorking ? null : formData.annualIncomeId,
      };
      console.log(requestBody, 'requestBody');
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
      <View style={styles.scrollView}>
        {/* Education Level Dropdown */}
        <View>
          <AppDropdown
            label=""
            selectedValue={formData.educationName}
            placeholder="Select Education Level"
            onPress={() => setShowEducationPicker(true)}
            dropdownStyle={globalStyles.inputField}
            isDropdownIcon={true}
          />
        </View>

        {/* College/Institution Name */}
        <View>
          <AppTextInput
          label={false}
            placeholder="College/Institution Name"
            value={formData.collegeName}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, collegeName: text }))
            }
            keyboardType="default"
            textInputStyle={globalStyles.inputField}
          />
        </View>

        {/* Company Type Dropdown */}
        <View>
          <AppDropdown
            label=""
            selectedValue={formData.companyTypeName}
            placeholder="You are working with"
            onPress={() => setShowCompanyTypePicker(true)}
            dropdownStyle={globalStyles.inputField}
            isDropdownIcon={true}
          />
        </View>

        <View>
          <AppDropdown
            label=""
            selectedValue={
              formData.occupationCategoryName || formData.jobRoleName
            }
            placeholder="Select Job Role"
            onPress={() => setShowJobRolePicker(true)}
            dropdownStyle={globalStyles.inputField}
            isDropdownIcon={true}
          />
        </View>
        {/* Job Role Dropdown */}
        {formData.companyTypeName !== 'Not Working' && (
          <>
            {/* Company Name */}
            <View>
              <AppTextInput
              label={false}
                placeholder="Company Name"
                value={formData.companyName}
                onChangeText={text =>
                  setFormData(prev => ({ ...prev, companyName: text }))
                }
                keyboardType="default"
                textInputStyle={globalStyles.inputField}
              />
            </View>

            {/* Salary Range Dropdown */}
            <View>
              <AppDropdown
                label=""
                selectedValue={formData.salaryName}
                placeholder="Select Salary Range"
                onPress={() => setShowSalaryPicker(true)}
                dropdownStyle={globalStyles.inputField}
                isDropdownIcon={true}
              />
            </View>
          </>
        )}
      </View>
      </ScrollView>
      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <AppButton
          title="Save"
          onPress={handleSave}
          isLoading={loader}
          buttonStyle={[globalStyles.continueButton,globalStyles.continueButtonActive]}
          textStyle={[globalStyles.continueButtonText,globalStyles.continueButtonTextActive]}
        />
      </View>

      {/* Picker Modals */}
      <AppSectionedPickerModal
        visible={showEducationPicker}
        title="Highest Qualification"
        sections={educationSections}
        selectedItemId={undefined}
        onSelect={handleEducationSelection}
        onClose={() => setShowEducationPicker(false)}
      />

      <AppPickerModal
        visible={showCompanyTypePicker}
        items={employmentTypes.filter((item: any) => item.name !== 'any')}
        selectedValue={formData.companyTypeName}
        onSelect={handleCompanyTypeSelection}
        onClose={() => setShowCompanyTypePicker(false)}
        title="You are working with"
        isObjects={true}
      />
      <AppPickerModal
        visible={
          showJobRolePicker && formData.companyTypeName === 'Not Working'
        }
        title="Select Occupation"
        items={occupationsByEmploymentType.filter(
          (item: any) => item.name !== 'any',
        )}
        selectedValue={formData.jobRoleName || ''}
        onSelect={value => {
          setShowJobRolePicker(false);
          setFormData(prev => ({
            ...prev,
            occupationId: value.id,
            jobRoleName: value.name,
          }));
        }}
        onClose={() => setShowJobRolePicker(false)}
        isObjects={true}
      />

      <AppSectionedPickerModal
        visible={
          showJobRolePicker && formData.companyTypeName !== 'Not Working'
        }
        sections={sectionedOccupationOptions}
        selectedItemId={undefined}
        onSelect={handleJobRoleSelection}
        onClose={() => setShowJobRolePicker(false)}
       title="Select Occupation"
      />

      <AppPickerModal
        visible={showSalaryPicker}
        items={salaryRangesList}
        selectedValue={formData.salaryName}
        onSelect={handleSalarySelection}
        onClose={() => setShowSalaryPicker(false)}
        title="Select Income Range"
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
});

export default EditEducationScreen;
