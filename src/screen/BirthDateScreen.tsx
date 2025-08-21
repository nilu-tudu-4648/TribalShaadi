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
  fontSize14,
  fontSize16,
  borderWidth,
  fontSize24,
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
  setReducerLoadingfalse,
  updateUrl,
} from '../constants/functions';
import AppText from '../components/AppText';
const BirthDateScreen = () => {
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isAgeValid, setIsAgeValid] = useState(true); // Track if user meets 18+ requirement
  const { user, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const dispatch = useDispatch();

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
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <HeaderBack />
        <AppText text="Add your date of birth" textStyle={styles.title} />

        <AppText
          text="This won't be shared but Human at heart. First let's start with birth date."
          textStyle={styles.subtitle}
        />

        <TouchableOpacity
          style={styles.dateInputContainer}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.8}
        >
          <AppText
            text={dateOfBirth.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
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
            styles.continueButton,
            !dateOfBirth || !isAgeValid
              ? styles.continueButtonInactive
              : styles.continueButtonActive,
          ]}
          textStyle={[
            styles.continueButtonText,
            !dateOfBirth || !isAgeValid
              ? styles.continueButtonTextInactive
              : styles.continueButtonTextActive,
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
  container: { flex: 1, backgroundColor: COLORS.white },
  content: {
    flex: 1,
    paddingHorizontal: lignHeight24,
    paddingVertical: lignHeight24,
    gap: lignHeight20,
    paddingTop: lignHeight72,
  },
  title: {
    fontSize: fontSize24,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  subtitle: {
    fontSize: fontSize14,
    color: COLORS.textGrey,
    lineHeight: lignHeight20,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: borderWidth,
    borderBottomColor: COLORS.borderBottom,
  },
  dateInput: {
    flex: 1,
    fontSize: fontSize16,
    color: COLORS.textBlack,
    paddingVertical: Size12,
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
  continueButton: {
    borderRadius: Size8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonActive: {
    backgroundColor: COLORS.textBlack,
  },
  continueButtonInactive: {
    backgroundColor: COLORS.borderLight,
  },
  continueButtonText: {
    fontSize: fontSize16,
    fontWeight: '600',
  },
  continueButtonTextActive: {
    color: COLORS.white,
  },
  continueButtonTextInactive: {
    color: COLORS.placeholderInactive,
  },
  sheidImage: {
    width: Size18,
    height: Size18,
    resizeMode: 'contain',
  },
});

export default BirthDateScreen;
