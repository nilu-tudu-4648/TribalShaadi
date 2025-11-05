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
  Size12,
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
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
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
    setIsAgeValid(validateAge(dateOfBirth));
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
        birthDate: dateOfBirth.toISOString(),
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
        <HeaderBack onPress={() => navigateToLastScreen(navigation, ROUTES.NAME)} />
        <AppText text="Add your date of birth" textStyle={globalStyles.title} />

        <AppText
          text="This won't be shared but Human at heart. First let's start with birth date."
          textStyle={globalStyles.subtitle}
        />

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
            text={dateOfBirth.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
            textStyle={styles.dateInput}
          />
          <View style={styles.calendarIcon}>
            <CalendarIcon width={20} height={20} color={COLORS.textBlack} />
          </View>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <View style={styles.descriptionBox}>
          <Image
            source={require('../assets/images/Group.png')}
            style={styles.sheidImage}
          />
          <AppText
            text="Please select your date of birth carefully as this information cannot be changed later and will be used for verification purposes."
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
          value={dateOfBirth}
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
  },
  dateInputFocused: {
    borderColor: COLORS.violet,
    borderWidth: 1,
  },
  dateInput: {
    flex: 1,
    textAlignVertical: 'center',
    fontSize: fontSize16,
    color: COLORS.textBlack,
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
    backgroundColor: COLORS.lightgreen,
    borderRadius: Size12,
    padding: Size16,
    gap: Size8,
  },
  descriptionText: {
    fontSize: fontSize12,
    color: COLORS.black,
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
