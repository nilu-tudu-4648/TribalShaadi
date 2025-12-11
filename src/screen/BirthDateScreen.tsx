import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import HeaderBack from '../components/HeaderBack';
import {
  lignHeight20,
  lignHeight24,
  lignHeight72,
  Size16,
  Size18,
  Size8,
  fontSize12,
  fontSize16,
  Size4,
  inputHeight,
} from '../constants/Sizes';
import AppButton from '../components/AppButton';
import DateTimePicker from '@react-native-community/datetimepicker'; // DateTimePickerEvent,
import { COLORS } from '../constants/AppColors';
import { completeUserProfileV2Updated } from '../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import AppToast from '../components/AppToast';
import { CalendarIcon } from '../components/svg/SvgIcons';
import {
  getUserDetailsApi,
  getUserDetailsUrl,
  navigateToLastScreen,
  setReducerLoadingfalse,
  updateUrl,
} from '../constants/functions';
import AppText from '../components/AppText';
import { ROUTES } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../constants/globalStyles';
const BirthDateScreen = () => {
  const [dateOfBirth, setDateOfBirth] = useState(null as any);
  const [showPicker, setShowPicker] = useState(false);
  const [isAgeValid, setIsAgeValid] = useState(true); // Track if user meets 18+ requirement
  const [isFocused, setIsFocused] = useState(false);
  const { user, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // Function to calculate age and validate if user is 18+
  const validateAge = (selectedDate: Date) => {
    const today = new Date();
    let ageDiff = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < selectedDate.getDate())
    ) {
      ageDiff--;
    }
    return ageDiff >= 18;
  };

  // Validate the initial date when component mounts
  useEffect(() => {
    setIsAgeValid(validateAge(new Date(dateOfBirth)));
  }, [dateOfBirth]);

  const handleDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowPicker(Platform.OS === 'ios');
    setDateOfBirth(currentDate);
    setIsFocused(false);

    // Check if user is at least 18 years old
    const ageIsValid = validateAge(currentDate);
    setIsAgeValid(ageIsValid);

    if (!ageIsValid) {
      AppToast('You must be at least 18 years old to continue.');
    }
  };

  const handleContinue = async () => {
    if (!dateOfBirth) {
      AppToast('Please select your date of birth');
      return;
    }

    if (!isAgeValid) {
      AppToast('You must be at least 18 years old to continue.');
      return;
    }

    try {
      const requestBody = {
        id: user.id,
        birthDate: new Date(dateOfBirth).toISOString(),
      };
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
      console.log(error);
    } finally {
      navigateToLastScreen(navigation, ROUTES.RELIGION);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.content}>
        <HeaderBack
          onPress={() => navigateToLastScreen(navigation, ROUTES.NAME)}
        />
        <View style={globalStyles.headerSection}>
          <AppText text="When were you born?" textStyle={globalStyles.title} />
          <AppText
            text="Tell us your birth date — it helps us find matches closer to your preference"
            textStyle={globalStyles.subtitle}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.dateInputContainer,
            isFocused && styles.dateInputFocused,
          ]}
          onPress={() => {
            setShowPicker(true);
            setIsFocused(true);
          }}
          activeOpacity={0.8}
        >
          <AppText
            text={
              dateOfBirth
                ? new Date(dateOfBirth).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
                : 'DD/MM/YYYY'
            }
            textStyle={styles.dateInput}
          />
          <View style={styles.calendarIcon}>
            <CalendarIcon width={20} height={20} color={COLORS.violet} />
          </View>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <View style={styles.descriptionBox}>
          <Image
            source={require('../assets/images/Group.png')}
            style={styles.sheidImage}
          />
          <AppText
            text="Please ensure your Date of Birth matches your government ID to avoid verification issues."
            textStyle={styles.descriptionText}
          />
        </View>

        <AppButton
          title="Continue"
          onPress={handleContinue}
          isButtonDisabled={!dateOfBirth || !isAgeValid || loader}
          isLoading={loader}
          buttonStyle={[
            globalStyles.continueButton,
            !dateOfBirth || !isAgeValid
              ? globalStyles.continueButtonInactive
              : globalStyles.continueButtonActive,
          ]}
          textStyle={[
            globalStyles.continueButtonText,
            !dateOfBirth || !isAgeValid
              ? globalStyles.continueButtonTextInactive
              : globalStyles.continueButtonTextActive,
          ]}
        />
      </View>

      {showPicker && (
        <DateTimePicker
          value={dateOfBirth ? new Date(dateOfBirth) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: lignHeight24,
    paddingVertical: lignHeight24,
    gap: lignHeight20,
    paddingTop: lignHeight72,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.7,
    borderColor: COLORS.greyText,
    borderRadius: Size4,
    paddingHorizontal: Size8,
    height: inputHeight,
    top: Size8,
  },
  dateInputFocused: {
    borderColor: COLORS.violet,
    borderWidth: 1,
  },
  dateInput: {
    flex: 1,
    textAlignVertical: 'center',
    fontSize: fontSize16,
    color: COLORS.greyText,
  },
  calendarIcon: {
    padding: Size8,
  },
  spacer: {
    flex: 1,
  },
  descriptionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBg3,
    borderRadius: Size8,
    padding: Size16,
    gap: Size8,
    paddingHorizontal: Size16 * 1.5,
  },
  descriptionText: {
    fontSize: fontSize12,
    color: COLORS.matchBg,
    textAlign: 'left',
    lineHeight: Size16,
  },
  sheidImage: {
    width: Size18,
    height: Size18,
    resizeMode: 'contain',
  },
});

export default BirthDateScreen;
