import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AppSafeView from '../components/AppSafeView';
import AppHeader from '../components/AppHeader';
import AppDropdown from '../components/AppDropdown';
import AppButton from '../components/AppButton';
import AppPickerModal from '../components/AppPickerModal';
import AppScrollView from '../components/AppScrollView';
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

// Personality traits
const PERSONALITY_TRAITS = [
  { id: '1', name: 'Kindness and empathy' },
  { id: '2', name: 'Adventurous spirit' },
  { id: '3', name: 'Intellectual curiosity' },
  { id: '4', name: 'Creative and artistic' },
  { id: '5', name: 'Sense of humor' },
  { id: '6', name: 'Ambitious and driven' },
  { id: '7', name: 'Calm and peaceful' },
  { id: '8', name: 'Outgoing and social' },
  { id: '9', name: 'Loyal and trustworthy' },
  { id: '10', name: 'Optimistic outlook' },
];

// Interests and hobbies
const INTERESTS = [
  { id: '1', name: 'Cooking, Writing, Singing, Photography, Painting' },
  { id: '2', name: 'Reading, Traveling, Hiking, Yoga, Meditation' },
  { id: '3', name: 'Dancing, Music, Theater, Movies, Art' },
  { id: '4', name: 'Sports, Fitness, Running, Swimming, Cycling' },
  { id: '5', name: 'Gaming, Technology, Programming, Science' },
  { id: '6', name: 'Gardening, Nature, Animals, Volunteering' },
  { id: '7', name: 'Fashion, Shopping, Beauty, Interior Design' },
  { id: '8', name: 'Business, Finance, Entrepreneurship, Networking' },
];

const EditPersonalityScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { user, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );

  // Form state
  const [formData, setFormData] = useState({
    bio: '',
    personalityTraitId: '',
    personalityTraitName: '',
    interestsId: '',
    interestsName: '',
  });

  // Picker modal states
  const [showPersonalityPicker, setShowPersonalityPicker] = useState(false);
  const [showInterestsPicker, setShowInterestsPicker] = useState(false);

  const MAX_BIO_LENGTH = 35;

  // Initialize form data from user profile
  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || 'In a world full of noise and distractions, I seek meaning through calm reflection, genuine connection, and creative expression — striving each day to grow, learn, and leave a positive mark behind.',
        personalityTraitId: user.personalityTraitId || '1',
        personalityTraitName: user.personalityTraitName || 'Kindness and empathy',
        interestsId: user.interestsId || '1',
        interestsName: user.interestsName || 'Cooking, Writing, Singing, Photography, Painting',
      });
    }
  }, [user]);

  // Handle bio text change
  const handleBioChange = useCallback((text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length <= MAX_BIO_LENGTH) {
      setFormData(prev => ({ ...prev, bio: text }));
    }
  }, []);

  // Count words in bio
  const getWordCount = useCallback(() => {
    const words = formData.bio.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }, [formData.bio]);

  // Handle personality trait selection
  const handlePersonalitySelection = useCallback((selectedTrait: any) => {
    setFormData(prev => ({
      ...prev,
      personalityTraitId: selectedTrait.id,
      personalityTraitName: selectedTrait.name,
    }));
    setShowPersonalityPicker(false);
  }, []);

  // Handle interests selection
  const handleInterestsSelection = useCallback((selectedInterests: any) => {
    setFormData(prev => ({
      ...prev,
      interestsId: selectedInterests.id,
      interestsName: selectedInterests.name,
    }));
    setShowInterestsPicker(false);
  }, []);

  // Handle form submission
  const handleSave = useCallback(async () => {
    // Validate required fields
    if (!formData.bio.trim()) {
      AppToast('Please enter your bio');
      return;
    }
    
    if (!formData.personalityTraitId) {
      AppToast('Please select your personality trait');
      return;
    }
    
    if (!formData.interestsId) {
      AppToast('Please select your interests');
      return;
    }

    try {
      const requestBody = {
        id: user.id,
        bio: formData.bio,
        personalityTraitId: formData.personalityTraitId,
        interestsId: formData.interestsId,
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
  }, [formData, user, dispatch, navigation]);

  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Personality & Preferences" />
      
      <AppScrollView 
        style={styles.scrollView}
        otherProps={{ contentContainerStyle: styles.scrollContent }}
      >
        {/* Bio Text Area */}
        <View style={styles.bioContainer}>
          <TextInput
            style={styles.bioInput}
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChangeText={handleBioChange}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.wordCount}>
            {getWordCount()}/{MAX_BIO_LENGTH} Words
          </Text>
        </View>

        {/* Personality Trait Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.personalityTraitName}
            placeholder="Select Personality Trait"
            onPress={() => setShowPersonalityPicker(true)}
          />
        </View>

        {/* Interests Dropdown */}
        <View style={styles.fieldContainer}>
          <AppDropdown
            label=""
            selectedValue={formData.interestsName}
            placeholder="Select Interests"
            onPress={() => setShowInterestsPicker(true)}
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
        visible={showPersonalityPicker}
        items={PERSONALITY_TRAITS}
        selectedValue={formData.personalityTraitName}
        onSelect={handlePersonalitySelection}
        onClose={() => setShowPersonalityPicker(false)}
        title="Select Personality Trait"
        isObjects={true}
      />

      <AppPickerModal
        visible={showInterestsPicker}
        items={INTERESTS}
        selectedValue={formData.interestsName}
        onSelect={handleInterestsSelection}
        onClose={() => setShowInterestsPicker(false)}
        title="Select Interests"
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
  bioContainer: {
    marginBottom: Size25,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: COLORS.borderGrey,
    borderRadius: Size16,
    paddingHorizontal: Size16,
    paddingVertical: Size16,
    backgroundColor: COLORS.white,
    fontSize: Size16,
    color: COLORS.black,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  wordCount: {
    textAlign: 'right',
    marginTop: 8,
    fontSize: 14,
    color: COLORS.grey,
  },
  fieldContainer: {
    marginBottom: Size20,
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

export default EditPersonalityScreen;