import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../components/AppButton';
import { COLORS } from '../constants/AppColors';
import {
  fontSize18,
  fontSize20,
  fontSize32,
  Size10,
  Size18,
  Size8,
  Size2,
  Size5,
} from '../constants/Sizes';
import { completeUserProfileV2Gender } from '../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import AppToast from '../components/AppToast';
import {
  getUserDetailsApi,
  getUserDetailsUrl,
  updateUrl,
} from '../constants/functions';
import { ROUTES } from '../constants/data';

const GenderSelectionScreen = () => {
  const { user, loader, userProfileGenderUpdated } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>I identify{'\n'}myself as...</Text>

        <TouchableOpacity
          style={[
            styles.genderOption,
            styles.maleOption,
            { opacity: selectedGender === 'male' ? 1 : 0.6 },
          ]}
          onPress={() => handleSelect('male')}
        >
          <Image
            source={require('../assets/images/Male.png')}
            style={styles.genderImage}
          />
          <Text style={styles.genderText}>Male</Text>
          {selectedGender === 'male' && (
            <View style={styles.checkIconContainer}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderOption,
            styles.femaleOption,
            { opacity: selectedGender === 'female' ? 1 : 0.6 },
          ]}
          onPress={() => handleSelect('female')}
        >
          <Image
            source={require('../assets/images/Female.png')}
            style={styles.genderImage}
          />
          <Text style={styles.genderText}>Female</Text>
          {selectedGender === 'female' && (
            <View style={styles.checkIconContainer}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={{ width: '100%', alignItems: 'flex-end', flex: 1 }} />
        <AppButton
          title="Continue"
          onPress={() => handleSubmit()}
          isLoading={loader}
          isButtonDisabled={!selectedGender || loader}
          buttonStyle={[
            styles.continueButton,
            selectedGender
              ? styles.continueButtonActive
              : styles.continueButtonInactive,
          ]}
          textStyle={[
            styles.continueButtonText,
            selectedGender
              ? styles.continueButtonTextActive
              : styles.continueButtonTextInactive,
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
  title: {
    fontSize: fontSize32,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'left',
    paddingBottom: Size18 * 2,
    lineHeight: fontSize32 * 1.2,
  },
  genderOption: {
    alignSelf: 'center',
    width: Size18 * 10,
    height: Size18 * 10,
    borderRadius: Size18 * 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    gap: Size10,
  },
  maleOption: {
    backgroundColor: COLORS.maleOption,
  },
  femaleOption: {
    backgroundColor: COLORS.femaleOption,
  },
  genderImage: {
    width: Size10 * 10,
    height: Size10 * 10,
  },
  genderText: {
    fontSize: fontSize20,
    fontWeight: '600',
    color: COLORS.black,
  },
  continueButton: {
    width: '100%',
    borderRadius: Size8,
  },
  continueButtonActive: {
    backgroundColor: COLORS.black,
  },
  continueButtonInactive: {
    backgroundColor: COLORS.continueInactive,
  },
  continueButtonText: {
    fontSize: fontSize18,
    fontWeight: '600',
  },
  continueButtonTextActive: {
    color: COLORS.white,
  },
  continueButtonTextInactive: {
    color: COLORS.textInactive,
  },
  checkIconContainer: {
    position: 'absolute',
    top: Size10,
    right: Size10,
    backgroundColor: COLORS.success,
    borderRadius: Size10 * 1.5,
    width: Size10 * 3,
    height: Size10 * 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: Size2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: Size5,
  },
  checkIcon: {
    color: COLORS.white,
    fontSize: fontSize18,
    fontWeight: 'bold',
  },
});

export default GenderSelectionScreen;
