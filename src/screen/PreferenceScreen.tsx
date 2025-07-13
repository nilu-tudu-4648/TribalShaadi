import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, { useRef, useState } from 'react';
import AppSafeView from '../components/AppSafeView';
import AppScrollView from '../components/AppScrollView';
import AppText from '../components/AppText';
import {COLORS} from '../constants/AppColors';
import Fonts from '../constants/Fonts';
import HeaderBack from '../components/HeaderBack';
import MaritalStatusBottomSheet from '../components/BottomSheets/MaritalStatusBottomSheet';
import AgeRangeBottomSheet from '../components/BottomSheets/AgeRangeBottomSheet';
import ReligionBottomSheet from '../components/BottomSheets/ReligionBottomSheet';
import HeightRangeBottomSheet from '../components/BottomSheets/HeightRangeBottomSheet';
import TribeBottomSheet from '../components/BottomSheets/TribeBottomSheet';
import LocationBottomSheet from '../components/BottomSheets/LocationBottomSheet';
import JobTypeBottomSheet from '../components/BottomSheets/JobTypeBottomSheet';
import SettleDownBottomSheet from '../components/BottomSheets/SettleDownBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  borderWidth,
  fontSize14,
  fontSize16,
  fontSize22,
  Size10,
  Size12,
  Size14,
  Size16,
  Size20,
  Size4,
  Size8,
} from '../constants/Sizes';
import { CheckCircleIcon } from '../components/svg/SvgIcons2';

const PreferenceScreen = () => {
  const maritalStatusBottomSheetRef = useRef<BottomSheet>(null);
  const ageRangeBottomSheetRef = useRef<BottomSheet>(null);
  const religionBottomSheetRef = useRef<BottomSheet>(null);
  const heightRangeBottomSheetRef = useRef<BottomSheet>(null);
  const tribeBottomSheetRef = useRef<BottomSheet>(null);
  const locationBottomSheetRef = useRef<BottomSheet>(null);
  const jobTypeBottomSheetRef = useRef<BottomSheet>(null);
  const settleDownBottomSheetRef = useRef<BottomSheet>(null);
  const [selectedMaritalStatuses, setSelectedMaritalStatuses] = useState<string[]>(['Never Married']);
  const [selectedAgeRange, setSelectedAgeRange] = useState<{ min: number; max: number }>({ min: 20, max: 45 });
  const [selectedReligion, setSelectedReligion] = useState<string>('Sarna');
  const [selectedHeightRange, setSelectedHeightRange] = useState<{ min: number; max: number }>({ min: 5*12+5, max: 6*12+5 }); // 5ft 5in to 6ft 5in
  const [selectedTribes, setSelectedTribes] = useState<string[]>(['Any']);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['Any']);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(['Any']);
  const [selectedSettleDown, setSelectedSettleDown] = useState<string[]>(['Any']);

  const getMaritalStatusValue = () => {
    if (selectedMaritalStatuses.length === 0) return 'None';
    if (selectedMaritalStatuses.length === 1) return selectedMaritalStatuses[0];
    return `${selectedMaritalStatuses.length} selected`;
  };

  const getAgeRangeValue = () => {
    return `${selectedAgeRange.min} - ${selectedAgeRange.max} Years`;
  };

  const formatHeight = (totalInches: number) => {
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}ft ${inches}in`;
  };

  const getHeightRangeValue = () => {
    return `${formatHeight(selectedHeightRange.min)} - ${formatHeight(selectedHeightRange.max)}`;
  };

  const getTribeValue = () => {
    if (selectedTribes.includes('Any')) {
      return 'Any';
    }
    if (selectedTribes.length === 0) {
      return 'None';
    }
    if (selectedTribes.length === 1) {
      return selectedTribes[0];
    }
    return `${selectedTribes.length} selected`;
  };

  const getLocationValue = () => {
    if (selectedLocations.includes('Any')) {
        return 'Any';
    }
    if (selectedLocations.length === 0) {
      return 'None';
    }
    if (selectedLocations.length === 1) {
      return selectedLocations[0];
    }
    return `${selectedLocations.length} selected`;
  };

  const getJobTypeValue = () => {
    if (selectedJobTypes.includes('Any')) {
      return 'Any';
    }
    if (selectedJobTypes.length === 0) {
      return 'None';
    }
    if (selectedJobTypes.length === 1) {
      return selectedJobTypes[0];
    }
    return `${selectedJobTypes.length} selected`;
  };

  const getSettleDownValue = () => {
    if (selectedSettleDown.includes('Any')) {
      return 'Any';
    }
    if (selectedSettleDown.length === 0) {
      return 'None';
    }
    if (selectedSettleDown.length === 1) {
      return selectedSettleDown[0];
    }
    return `${selectedSettleDown.length} selected`;
  };

  const mandatoryPreferences = [
    {title: 'Marital Status', value: getMaritalStatusValue(), isClickable: true},
    {title: 'Age', value: getAgeRangeValue(), isClickable: true},
    {title: 'Religion', value: selectedReligion, isClickable: true},
    {title: 'Height', value: getHeightRangeValue(), isClickable: true},
  ];

  const secondaryPreferences = [
    {title: 'Tribe', value: getTribeValue(), isClickable: true},
    {title: 'Location', value: getLocationValue(), isClickable: true},
    {title: 'Job type', value: getJobTypeValue(), isClickable: true},
    {title: 'Settle Down', value: getSettleDownValue(), isClickable: true},
  ];

  const handleMaritalStatusPress = () => {
    maritalStatusBottomSheetRef.current?.expand();
  };

  const handleMaritalStatusChange = (_statuses: string[]) => {
    // Handle real-time selection changes if needed
  };

  const handleMaritalStatusApply = (statuses: string[]) => {
    setSelectedMaritalStatuses(statuses);
  };

  const handleAgeRangePress = () => {
    ageRangeBottomSheetRef.current?.expand();
  };

  const handleAgeRangeChange = (_range: { min: number; max: number }) => {
    // Handle real-time range changes if needed
  };

  const handleAgeRangeApply = (range: { min: number; max: number }) => {
    setSelectedAgeRange(range);
  };

  const handleReligionPress = () => {
    religionBottomSheetRef.current?.expand();
  };

  const handleReligionChange = (_religion: string) => {
    // Handle real-time selection changes if needed
  };

  const handleReligionApply = (religion: string) => {
    setSelectedReligion(religion);
  };

  const handleHeightRangePress = () => {
    heightRangeBottomSheetRef.current?.expand();
  };

  const handleHeightRangeChange = (_range: { min: number; max: number }) => {
    // Handle real-time range changes if needed
  };

  const handleHeightRangeApply = (range: { min: number; max: number }) => {
    setSelectedHeightRange(range);
  };

  const handleTribePress = () => {
    tribeBottomSheetRef.current?.expand();
  };

  const handleTribeChange = (_tribes: string[]) => {
    // Handle real-time changes if needed
  };

  const handleTribeApply = (tribes: string[]) => {
    setSelectedTribes(tribes);
  };

  const handleLocationPress = () => {
    locationBottomSheetRef.current?.expand();
  };

  const handleLocationApply = (locations: string[]) => {
    setSelectedLocations(locations);
  };

  const handleJobTypePress = () => {
    jobTypeBottomSheetRef.current?.expand();
  };

  const handleJobTypeApply = (jobTypes: string[]) => {
    setSelectedJobTypes(jobTypes);
  };

  const handleSettleDownPress = () => {
    settleDownBottomSheetRef.current?.expand();
  };

  const handleSettleDownApply = (options: string[]) => {
    setSelectedSettleDown(options);
  };

  const PreferenceCard = ({title, value, isClickable = false}: {title: string; value: string; isClickable?: boolean}) => {
    const handlePress = () => {
      if (isClickable) {
        if (title === 'Marital Status') {
          handleMaritalStatusPress();
        } else if (title === 'Age') {
          handleAgeRangePress();
        } else if (title === 'Religion') {
          handleReligionPress();
        } else if (title === 'Height') {
          handleHeightRangePress();
        } else if (title === 'Tribe') {
          handleTribePress();
        } else if (title === 'Location') {
          handleLocationPress();
        } else if (title === 'Job type') {
          handleJobTypePress();
        } else if (title === 'Settle Down') {
          handleSettleDownPress();
        }
      }
    };

    return (
      <TouchableOpacity 
        style={[styles.card, isClickable && styles.clickableCard]} 
        onPress={handlePress}
        disabled={!isClickable}
        activeOpacity={isClickable ? 0.7 : 1}
      >
        <View>
          <AppText text={title} textStyle={styles.cardTitle} />
          <AppText text={value} textStyle={styles.cardValue} />
        </View>
        <CheckCircleIcon />
      </TouchableOpacity>
    );
  };

  return (
    <AppSafeView style={{padding: 0}}>
      <View style={styles.header}>
        <HeaderBack />
        <AppText text="Preferences" textStyle={styles.headerTitle} />
        <TouchableOpacity style={styles.resetButton}>
          <AppText text="Reset" textStyle={styles.resetButtonText} />
        </TouchableOpacity>
      </View>

      <AppScrollView style={{}}>
        <View style={styles.container}>
          <View style={styles.section}>
            <AppText
              text="My mandatory preferences"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text="The matches you'll receive will exactly meet the mandatory
              preferences"
              textStyle={styles.sectionDescription}
            />
            <View style={styles.cardContainer}>
              {mandatoryPreferences.map((item, index) => (
                <PreferenceCard
                  key={index}
                  title={item.title}
                  value={item.value}
                  isClickable={item.isClickable}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <AppText
              text="My secondary preferences"
              textStyle={styles.sectionTitle}
            />
            <AppText
              text="The matches you'll receive might/might not exactly meet the
              secondary preferences"
              textStyle={styles.sectionDescription}
            />
            <View style={styles.cardContainer}>
              {secondaryPreferences.map((item, index) => (
                <PreferenceCard
                  key={index}
                  title={item.title}
                  value={item.value}
                  isClickable={item.isClickable}
                />
              ))}
            </View>
          </View>
        </View>
      </AppScrollView>
      
      <MaritalStatusBottomSheet
        bottomSheetRef={maritalStatusBottomSheetRef}
        selectedStatuses={selectedMaritalStatuses}
        onSelectionChange={handleMaritalStatusChange}
        onApply={handleMaritalStatusApply}
      />
      
      <AgeRangeBottomSheet
        bottomSheetRef={ageRangeBottomSheetRef}
        selectedAgeRange={selectedAgeRange}
        onSelectionChange={handleAgeRangeChange}
        onApply={handleAgeRangeApply}
      />

      <ReligionBottomSheet
        bottomSheetRef={religionBottomSheetRef}
        selectedReligion={selectedReligion}
        onSelectionChange={handleReligionChange}
        onApply={handleReligionApply}
      />

      <HeightRangeBottomSheet
        bottomSheetRef={heightRangeBottomSheetRef}
        selectedHeightRange={selectedHeightRange}
        onSelectionChange={handleHeightRangeChange}
        onApply={handleHeightRangeApply}
      />

      <TribeBottomSheet
        bottomSheetRef={tribeBottomSheetRef}
        selectedTribes={selectedTribes}
        onSelectionChange={handleTribeChange}
        onApply={handleTribeApply}
      />

      <LocationBottomSheet
        bottomSheetRef={locationBottomSheetRef}
        selectedLocations={selectedLocations}
        onApply={handleLocationApply}
      />

      <JobTypeBottomSheet
        bottomSheetRef={jobTypeBottomSheetRef}
        selectedJobTypes={selectedJobTypes}
        onApply={handleJobTypeApply}
      />

      <SettleDownBottomSheet
        bottomSheetRef={settleDownBottomSheetRef}
        selectedJobTypes={selectedJobTypes}
        onApply={handleSettleDownApply}
      />
    </AppSafeView>
  );
};

export default PreferenceScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Size14,
    paddingVertical: Size10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    fontSize: fontSize22,
    fontFamily: Fonts.OPEN_SANS_BOLD,
    color: COLORS.textBlack,
  },
  resetButton: {
    backgroundColor: COLORS.black,
    paddingHorizontal: Size16,
    paddingVertical: Size8,
    borderRadius: Size8,
  },
  resetButtonText: {
    color: COLORS.white,
    fontFamily: Fonts.OPEN_SANS_SEMI_BOLD,
    fontSize: fontSize14,
  },
  container: {
    padding: Size14,
  },
  section: {
    marginBottom: Size20,
  },
  sectionTitle: {
    fontSize: fontSize16,
    fontFamily: Fonts.OPEN_SANS_BOLD,
    color: COLORS.textBlack,
    marginBottom: Size4,
  },
  sectionDescription: {
    fontSize: fontSize14,
    fontFamily: Fonts.OPEN_SANS_REGULAR,
    color: COLORS.textInactive,
    marginBottom: Size12,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: Size12,
    padding: Size12,
    marginBottom: Size12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  clickableCard: {
    borderWidth: borderWidth,
    borderColor: COLORS.white,
  },
  cardTitle: {
    fontSize: fontSize14,
    fontFamily: Fonts.OPEN_SANS_SEMI_BOLD,
    color: COLORS.textInactive,
  },
  cardValue: {
    fontSize: fontSize14,
    fontFamily: Fonts.OPEN_SANS_BOLD,
    color: COLORS.textBlack,
    marginTop: Size4,
  },
});