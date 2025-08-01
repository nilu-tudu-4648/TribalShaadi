import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import HeaderBack from '../components/HeaderBack';
import { COLORS } from '../constants/AppColors';
import {
  fontSize16,
  fontSize14,
  lignHeight24,
  lignHeight72,
  Size16,
  Size8,
  lignHeight20,
  Size20,
  Size12,
  fontSize24,
} from '../constants/Sizes';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { updateUrl } from '../constants/functions';
import { completeUserProfileV2Interests } from '../store/reducers/authReducer';
import { useNavigation } from '@react-navigation/native';
import { ROUTES, INTERESTS } from '../constants/data';



const SelectInterestsScreen = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const maxSelect = 5;
  const { user, loader, isInterestsUpdated } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
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
    const selectedInterests = selected.map(item => item.split(' ').slice(1).join(' ')).join(',');
    try {
      const requestBody = {
        id: user.id,
        intrests: selectedInterests,
      };
      dispatch(completeUserProfileV2Interests(updateUrl, requestBody));
    } catch (error) {
      console.log('error', error);
    }
  };

    return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <HeaderBack />

        <View style={styles.headerRow}>
          <AppText text="Select interests" textStyle={styles.title} />
          <AppText text={`(${selected.length}/${maxSelect})`} textStyle={styles.counter} />
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
                  isSelected ? styles.interestChipSelected : styles.interestChipUnselected
                ]}
              >
                <AppText text={item} textStyle={[
                  styles.interestText,
                  isSelected ? styles.interestTextSelected : styles.interestTextUnselected
                ]} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Loading Button */}
        <AppButton
          title="Continue"
          onPress={handleContinue}
          isLoading={loader}
          isButtonDisabled={selected.length < 1}
          buttonStyle={[
            styles.continueButton,
            selected.length !== 0 ? styles.continueButtonActive : styles.continueButtonInactive,
          ]}
          textStyle={[
            styles.continueButtonText,
            selected.length !== 0
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
    backgroundColor: COLORS.violet,
  },
  interestChipUnselected: {
    backgroundColor: COLORS.lightGreyBackground,
  },
  interestText: {
    fontSize: fontSize14,
    letterSpacing: 1.3,
  },
  interestTextSelected: {
    color: COLORS.white,
  },
  interestTextUnselected: {
    color: COLORS.textBlack,
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
});

export default SelectInterestsScreen;
