import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
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
import AppSectionedPickerModal from '../components/AppSectionedPickerModal';
import {
  completeUserProfileV2Updated,
  getEducationTypes,
  getEmploymentTypes,
  getIncome,
  getOccupation,
  getOccupationsByEmploymentType,
} from '../store/reducers/authReducer';
import {
  getEducationUrl,
  getEmploymentTypeUrl,
  getIncomeUrl,
  getOccupationByEmploymentTypeUrl,
  getOccupationCategoryByOccupationIdUrl,
  getOccupationUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  navigateToLastScreen,
  setReducerLoadingfalse,
  updateUrl,
} from '../constants/functions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../constants/functions';
import { useDispatch, useSelector } from 'react-redux';
import AppToast from '../components/AppToast';
import AppSafeView from '../components/AppSafeView';
import { ROUTES } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../constants/globalStyles';

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
    useState<string>('');
  const [showQualificationPicker, setShowQualificationPicker] = useState(false);
  const [showWorkExperiencePicker, setShowWorkExperiencePicker] =
    useState(false);
  const [showIncomePicker, setShowIncomePicker] = useState(false);
  const [sectionedOccupationOptions, setSectionedOccupationOptions] = useState<
    any[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [educationSections, setEducationSections] = useState<any[]>([]);
  const {
    user,
    income,
    loader,
    educationTypes,
    employmentTypes,
    occupationsByEmploymentType,
  } = useSelector((state: any) => state.entities.authReducer);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const incomeList = income || [];
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
  // Build grouped list: Occupation as heading -> Occupation Categories as items
  useEffect(() => {
    const buildSections = async () => {
      if (!showOccupationCategoryPicker) return;
      if (!Array.isArray(occupationsByEmploymentType)) return;
      try {
        const token = await AsyncStorage.getItem('userToken');
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : undefined;

        const fetchPromises = occupationsByEmploymentType.map(
          async (occ: any) => {
            try {
              const url = `${baseUrl}${getOccupationCategoryByOccupationIdUrl}${occ.id}`;
              const response = await axios.get(url, { headers });
              const list = response?.data?.recordList || [];
              return {
                id: occ.id,
                title: occ.name,
                data: list.map((c: any) => ({
                  id: c.id,
                  name: c.name,
                  occupation: occ,
                })),
              };
            } catch (e) {
              return { id: occ.id, title: occ.name, data: [] };
            }
          },
        );

        const sections = await Promise.all(fetchPromises);
        setSectionedOccupationOptions(sections);
      } catch (e) {
        setSectionedOccupationOptions([]);
      }
    };

    buildSections();
  }, [showOccupationCategoryPicker, occupationsByEmploymentType]);

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
        educationTypeId: selectedQualification.educationTypeId,
        educationId: selectedQualification.id,
        college_name: collegeName,
        employmentTypeId: selectedWorkExperience.id,
        occupationId: selectedOccupation.id,
        occupationCategoryId: !isWorking ? null : selectedOccupationCategory.id,
        companyName: !isWorking ? null : organizationName,
        annualIncomeId: !isWorking ? null : selectedIncome.id,
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
      navigateToLastScreen(navigation, ROUTES.PHYSICAL_ATTRIBUTES);
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
    <AppSafeView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <HeaderBack
            onPress={() => navigateToLastScreen(navigation, ROUTES.ADDRESS)}
          />
          {/* Highest Qualification Dropdown */}
          <View style={{ gap: Size8 }}>
            <AppDropdown
              label="Your highest qualification"
              selectedValue={selectedQualification?.name || ''}
              placeholder="Highest qualification"
              onPress={() => setShowQualificationPicker(true)}
            />

            {/* College/University/School Text Input */}
            <AppTextInput
              label={false}
              placeholder="College/University/School"
              value={collegeName}
              onChangeText={setCollegeName}
              keyboardType="default"
            />
          </View>
          {/* Work Experience Dropdown */}
          <View style={{ gap: Size8 }}>
            <AppDropdown
              label="Work Status"
              selectedValue={selectedWorkExperience?.name || ''}
              placeholder="You are working with?"
              onPress={() => setShowWorkExperiencePicker(true)}
            />
            <AppDropdown
              label=""
              selectedValue={
                selectedOccupationCategory?.name ||
                selectedOccupation?.name ||
                ''
              }
              placeholder="Occupation"
              onPress={() => {
                if (selectedWorkExperience?.name !== 'Not Working') {
                  setShowOccupationCategoryPicker('Occupation');
                } else {
                  setShowOccupationCategoryPicker('notWorking');
                }
              }}
            />
          </View>
          {selectedWorkExperience?.name !== 'Not Working' && (
            <View style={{ gap: Size8 }}>
              {/* Organization Name Text Input */}
              <AppTextInput
                placeholder="Organization Name"
                value={organizationName}
                onChangeText={setOrganizationName}
                keyboardType="default"
              />
              {/* Income Dropdown */}
              <AppDropdown
                label="Annual Income"
                selectedValue={selectedIncome?.value || ''}
                placeholder="Annual Income"
                onPress={() => setShowIncomePicker(true)}
              />
            </View>
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

      {/* Qualification Picker Modal - Sectioned by Education Type */}
      <AppSectionedPickerModal
        visible={showQualificationPicker}
        title="Highest Qualification"
        sections={educationSections}
        selectedItemId={selectedQualification?.id}
        onSelect={(item, section) => {
          // Persist both selected education (degree) and its type
          setSelectedQualification({
            id: item.id,
            name: item.name,
            educationTypeId: (item as any).educationTypeId ?? section.id,
          });
        }}
        onClose={() => setShowQualificationPicker(false)}
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
          setSelectedOccupation(null);
          setSelectedOccupationCategory(null);
        }}
        onClose={() => setShowWorkExperiencePicker(false)}
        isObjects={true}
      />
      <AppPickerModal
        visible={showOccupationCategoryPicker === 'notWorking'}
        title="Select Occupation"
        items={occupationsByEmploymentType.filter(
          (item: any) => item.name !== 'any',
        )}
        selectedValue={selectedOccupation?.name || ''}
        onSelect={value => {
          setSelectedOccupation({ id: value.id, name: value.name });
        }}
        onClose={() => setShowOccupationCategoryPicker('')}
        isObjects={true}
      />

      {/* Grouped Occupation + Category Picker */}
      <AppSectionedPickerModal
        visible={showOccupationCategoryPicker === 'Occupation'}
        title="Select Occupation"
        sections={sectionedOccupationOptions}
        selectedItemId={selectedOccupationCategory?.id}
        onSelect={(item, section) => {
          setSelectedOccupation({ id: section.id, name: section.title });
          setSelectedOccupationCategory({ id: item.id, name: item.name });
        }}
        onClose={() => setShowOccupationCategoryPicker('')}
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
    </AppSafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 0,
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
  buttonContainer: {
    paddingHorizontal: lignHeight24,
    paddingVertical: screenHeight(2), // Responsive padding
    paddingBottom: screenHeight(3), // Extra bottom padding for safe area
    backgroundColor: COLORS.white,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.borderLight,
  },
});

export default QualificationScreen;
