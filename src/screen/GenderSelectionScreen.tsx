import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../components/AppButton';
import { COLORS } from '../constants/AppColors';
import {
  fontSize32,
  Size10,
  Size18,
  Size8,
  Size4,
  fontSize14,
  SIZES,
  Size20,
} from '../constants/Sizes';
import { completeUserProfileV2Gender } from '../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import AppToast from '../components/AppToast';
import {
  getUserDetailsApi,
  getUserDetailsUrl,
  navigateToLastScreen,
  updateUrl,
} from '../constants/functions';
import { ROUTES } from '../constants/data';
import AppText from '../components/AppText';
import { globalStyles } from '../constants/globalStyles';
import { usePostHog } from 'posthog-react-native';

const GenderSelectionScreen = () => {
  const { user, loader, userProfileGenderUpdated } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const posthog = usePostHog();
  const handleSelect = (gender: string) => {
    setSelectedGender(gender);
  };
  useEffect(() => {
    if (userProfileGenderUpdated) {
      navigation.navigate(ROUTES.NAME as never);
    }
  }, [userProfileGenderUpdated, navigation]);
  const handleSubmit = async () => {
    try {
      posthog.capture('gender_selected')
      if (!selectedGender) {
        AppToast('Please select a gender');
        return;
      }
      dispatch(
        completeUserProfileV2Gender(updateUrl, {
          id: user.id,
          gender: selectedGender,
        }),
      );
      await getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
    } catch (error) {
      console.log(error);
    } finally {
      navigateToLastScreen(navigation, ROUTES.NAME);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={{ gap: Size4 }}>
          <AppText text="Tell us about you" textStyle={globalStyles.title} />
        </View>
        <View style={{ gap: Size10 }}> 
          <AppText text="Select your gender" textStyle={styles.subtitle} />
         <View style={{ gap: Size20 }}> 
         <Pressable
            style={[
              styles.genderOption,
              selectedGender === 'female' && styles.selectedGender,
            ]}
            onPress={() => handleSelect('female')}
          >
            <AppText text="Female" textStyle={styles.genderText} />
            <Image
              source={require('../assets/images/Female.png')}
              style={styles.genderImage}
            />
          </Pressable>
          <Pressable
            style={[
              styles.genderOption,
              selectedGender === 'male' && styles.selectedGender,
            ]}
            onPress={() => handleSelect('male')}
          >
            <AppText text="Male" textStyle={styles.genderText} />
            <Image
              source={require('../assets/images/Male.png')}
              style={styles.genderImage}
            />
          </Pressable>

      
          </View>
        </View>
        <View style={{ width: '100%', alignItems: 'flex-end', flex: 1 }} />
        <AppButton
          title="Continue"
          onPress={() => handleSubmit()}
          isLoading={loader}
          isButtonDisabled={!selectedGender || loader}
          buttonStyle={[
            globalStyles.continueButton,
            selectedGender
              ? globalStyles.continueButtonActive
              : globalStyles.continueButtonInactive,
          ]}
          textStyle={[
            globalStyles.continueButtonText,
            selectedGender
              ? globalStyles.continueButtonTextActive
              : globalStyles.continueButtonTextInactive,
          ]}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Size18 * 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Size10 * 2,
    gap: Size18 * 2,
    paddingTop: Size18 * 2,
  },
  subtitle: {
    fontSize: fontSize14,
    color: COLORS.black,
    fontWeight: '400',
  },
  genderOption: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Size20,
    paddingVertical: Size20,
    borderWidth: 1,
    borderRadius: Size8,
    backgroundColor: COLORS.lightGrey,
  },
  genderImage: {
    width: SIZES.width * 0.22,
    height: SIZES.width * 0.22,
    resizeMode: 'contain',
  },
  genderText: {
    fontSize: fontSize32,
    fontWeight: '400',
  },
  selectedGender: {
    borderColor: COLORS.violet,
    backgroundColor: COLORS.lightViolet2,
  },
});

export default GenderSelectionScreen;
