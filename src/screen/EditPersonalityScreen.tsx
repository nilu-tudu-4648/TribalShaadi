import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AppSafeView from '../components/AppSafeView';
import AppDropdown from '../components/AppDropdown';
import AppButton from '../components/AppButton';
import AppPickerModal from '../components/AppPickerModal';
import { COLORS } from '../constants/AppColors';
import {
  fontSize14,
  fontSize16,
  Size12,
  Size16,
  Size20,
  Size25,
  Size4,
  Size8,
  SIZES,
  borderWidth,
} from '../constants/Sizes';
import { completeUserProfileV2Updated } from '../store/reducers/authReducer';
import {
  updateUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
} from '../constants/functions';
import AppToast from '../components/AppToast';
import ProfileHeader from '../components/Header/ProfileHeader';
import { PersonalityIcon } from '../components/svg/SvgIcons';
import { INTERESTS, ROUTES, VALUES_OPTIONS } from '../constants/data';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';

const EditPersonalityScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<string[]>([]);
  const maxSelect = 5;

  const { user, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );

  // Form state
  const [formData, setFormData] = useState({
    bio: '',
    personalityTraitName: '',
    interests: '',
  });

  // Picker modal states
  const [showPersonalityPicker, setShowPersonalityPicker] = useState(false);

  const MAX_BIO_LENGTH = 35;
  const toggleInterest = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else if (selected.length < maxSelect) {
      setSelected([...selected, item]);
    } else {
      // AppToast('You can select up to 5 interests only.');
    }
  };
// Update the useEffect that initializes the form data
useEffect(() => {
  if (user) {
    setFormData({
      bio: user.aboutMe || '',
      personalityTraitName: user.about_lifepartener || '',
      interests: user.intrests || '',
    });

    // Handle existing interests
    if (user.intrests && user.intrests.length > 0) {
      // Split the comma-separated string into individual interests
      const userInterests = user.intrests
        .split(',')
        .map((item: string) => item.trim());

      // Find matching interests from the INTERESTS array (case-insensitive)
      const matchedInterests = INTERESTS.filter(interest => 
        userInterests.some((userInterest: string) => 
          interest.toLowerCase().includes(userInterest.toLowerCase()) ||
          userInterest.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(userInterest.toLowerCase())
        )
      );

      setSelected(matchedInterests);
    }
  }
}, [user]);

// Update the handleSave function to maintain the same format
const handleSave = useCallback(async () => {
  const selectedInterests = selected.map(item => item.split(' ').slice(1).join(' ')).join(',');
  try {
    const requestBody = {
      id: user.id,
      aboutMe: formData.bio,
      about_lifepartener: formData.personalityTraitName,
      intrests: selectedInterests, 
    };
    dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
    setReducerLoadingfalse(dispatch, () => {
      getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
    });

    AppToast('Personality & Preferences updated successfully');
    navigation.goBack();
  } catch (error) {
    console.error('Error updating profile:', error);
    AppToast('Error updating profile. Please try again.');
  }
}, [formData, user, dispatch, navigation, selected]);
  // Handle bio text change
  const handleBioChange = useCallback((text: string) => {
    const words = text
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);
    if (words.length <= MAX_BIO_LENGTH) {
      setFormData(prev => ({ ...prev, bio: text }));
    }
  }, []);

  // Count words in bio
  const getWordCount = useCallback(() => {
    const words = formData.bio
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0);
    return words.length;
  }, [formData.bio]);

  // Handle personality trait selection
  const handlePersonalitySelection = useCallback((selectedTrait: any) => {
    setFormData(prev => ({
      ...prev,
      personalityTraitName: selectedTrait.name,
    }));
    setShowPersonalityPicker(false);
  }, []);

  return (
    <AppSafeView style={styles.container}>
      <ProfileHeader
        title="Personality & Preferences"
        onBackPress={() => {
          handleSave();
          (navigation as any).navigate(ROUTES.STACK, {
            screen: ROUTES.ACCOUNT,
          } as never);
        }}
        icon={<PersonalityIcon size={Size25} />}
      />
      <ScrollView 
        style={styles.mainScrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bio Text Area */}
        <View style={styles.bioContainer}>
          <AppTextInput
            placeholder="Write about yourself in 35 words"
            placeholderTextColor={COLORS.grey}
            value={formData.bio}
            onChangeText={handleBioChange}
            keyboardType="default"
            textInputStyle={styles.textInput}
            multiline={true}
            textAlignVertical="top"
          />
          <AppText text={`${getWordCount()}/${MAX_BIO_LENGTH} Words`} textStyle={styles.wordCount} />
        </View>

        {/* Personality Trait Dropdown */}
        <View>
          <AppDropdown
            label=""
            selectedValue={formData.personalityTraitName}
            placeholder="Select Personality Trait"
            onPress={() => setShowPersonalityPicker(true)}
          />
        </View>

        {/* Interests */}
        <View style={styles.interestsContainer}>
          {INTERESTS.map(item => {
            const isSelected = selected.includes(item);
            return (
              <TouchableOpacity
                key={item}
                onPress={() => toggleInterest(item)}
                style={[
                  styles.interestChip,
                  isSelected
                    ? styles.interestChipSelected
                    : styles.interestChipUnselected,
                ]}
              >
                <AppText
                  text={item}
                  textStyle={[
                    styles.interestText,
                    isSelected
                      ? styles.interestTextSelected
                      : styles.interestTextUnselected,
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

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
        visible={showPersonalityPicker}
        items={VALUES_OPTIONS.map((item, index) => ({
          id: index,
          name: item,
        }))}
        selectedValue={formData.personalityTraitName}
        onSelect={handlePersonalitySelection}
        onClose={() => setShowPersonalityPicker(false)}
        title="What values are most important to you in a life partner?"
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
  mainScrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: Size8,
    gap: Size20,
    paddingVertical: Size25,
  },
  bioContainer: {
    gap: Size16,
  },
  textInput: {
    fontSize: fontSize16,
    color: COLORS.textBlack,
    minHeight: SIZES.height * 0.2,
    maxHeight: SIZES.height * 0.4,
    paddingVertical: Size12,
    paddingHorizontal: Size12,
    textAlign: 'left',
    borderWidth: borderWidth,
    borderColor: COLORS.borderGrey,
    borderRadius: Size4,
  },
  wordCount: {
    textAlign: 'right',
    fontSize: fontSize14,
    color: COLORS.grey,
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
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Size12,
  },
  interestChip: {
    paddingHorizontal: Size16,
    paddingVertical: Size8,
    borderRadius: Size20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  interestChipSelected: {
    backgroundColor: COLORS.textBlack,
  },
  interestChipUnselected: {
    backgroundColor: COLORS.lightGreyBackground,
  },
  interestText: {
    fontSize: fontSize14,
  },
  interestTextSelected: {
    color: COLORS.white,
  },
  interestTextUnselected: {
    color: COLORS.textBlack,
  },
});

export default EditPersonalityScreen;
