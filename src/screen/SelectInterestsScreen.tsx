import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import HeaderBack from '../components/HeaderBack';
import { COLORS } from '../constants/AppColors';
import {
  fontSize16,
  lignHeight24,
  lignHeight72,
  Size16,
  lignHeight20,
  Size12,
  fontSize24,
  Size4,
  borderWidth,
  Size10,
} from '../constants/Sizes';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { navigateToLastScreen, updateUrl } from '../constants/functions';
import { completeUserProfileV2Interests } from '../store/reducers/authReducer';
import { useNavigation } from '@react-navigation/native';
import { ROUTES, INTERESTS } from '../constants/data';
import { globalStyles } from '../constants/globalStyles';
import { usePostHog } from 'posthog-react-native';

const SelectInterestsScreen = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const maxSelect = 5;
  const { user, loader, isInterestsUpdated } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const posthog = usePostHog();
  const toggleInterest = (item: string) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else if (selected.length < maxSelect) {
      setSelected([...selected, item]);
    } else {
      // AppToast('You can select up to 5 interests only.');
    }
  };
  useEffect(() => {
    if (isInterestsUpdated) {
      navigation.navigate(ROUTES.WELCOME_HOME as never);
    }
  }, [isInterestsUpdated, navigation]);
  const handleContinue = async () => {
    const selectedInterests = selected
      .map(item => item.split(' ').slice(1).join(' '))
      .join(',');
    try {
      posthog.capture('interests_selected')
      const requestBody = {
        id: user.id,
        intrests: selectedInterests,
        isProfileCompleted: 1,
        pMaritalStatusId: 'any',
        pReligionId: 'any',
        pCommunityId: 'any',
        pOccupationId: 'any',
        psettle_down: 'any',
        pFromHeight: 'any',
        pToHeight: 'any',
        pFromAge: 'any',
        pToAge: 'any',
      };
      dispatch(completeUserProfileV2Interests(updateUrl, requestBody));
    } catch (error) {
      console.log('error', error);
    } finally {
      navigateToLastScreen(navigation, ROUTES.WELCOME_HOME);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <HeaderBack onPress={() => navigateToLastScreen(navigation, ROUTES.UPLOAD_IMAGE)} progress={1.0} />

        <View style={styles.headerRow}>
          <AppText text="Select interests" textStyle={styles.title} />
          <AppText
            text={`(${selected.length}/${maxSelect})`}
            textStyle={styles.counter}
          />
        </View>

        {/* Interests */}
        <ScrollView
          contentContainerStyle={styles.interestsContainer}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
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
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Loading Button */}
        <AppButton
          title="Continue"
          onPress={handleContinue}
          isLoading={loader}
          isButtonDisabled={selected.length < maxSelect}
          buttonStyle={[
            globalStyles.continueButton,
            selected.length === maxSelect
              ? globalStyles.continueButtonActive
              : globalStyles.continueButtonInactive,
          ]}
          textStyle={[
            globalStyles.continueButtonText,
            selected.length === maxSelect
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
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: lignHeight24,
    paddingVertical: lignHeight24,
    gap: lignHeight20,
    paddingTop: lignHeight72,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize24,
    fontWeight: '500',
    color: COLORS.black,
  },
  counter: {
    fontSize: fontSize16,
    color: COLORS.black,
  },
  scrollView: {
    flex: 1,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Size12,
  },
  interestChip: {
    paddingHorizontal: Size16,
    paddingVertical: Size10,
    borderRadius: Size4,
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    borderColor: COLORS.lightGrey2,
    borderWidth: borderWidth,
  },
  interestChipSelected: {
    backgroundColor: COLORS.lightViolet2,
    borderColor: COLORS.violet,
    borderWidth: borderWidth,
  },
  interestChipUnselected: {
    backgroundColor: COLORS.lightGreyBackground,
  },
  interestText: {
    fontSize: fontSize16,
    color: COLORS.black,
  },
});

export default SelectInterestsScreen;
