import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import AppSafeView from '../components/AppSafeView';
import AppScrollView from '../components/AppScrollView';
import AppText from '../components/AppText';
import { COLORS } from '../constants/AppColors';
import Fonts from '../constants/Fonts';
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
  fontSize18,
  fontSize22,
  Size12,
  Size14,
  Size8,
} from '../constants/Sizes';
import { CheckCircleIcon } from '../components/svg/SvgIcons2';
import AppHeader from '../components/AppHeader';
import { useSelector } from 'react-redux';
import AppLoader from '../components/AppLoader';
import {
  formatHeightInFeettoInches,
  resetPreferenceApi,
} from '../constants/functions';

const PreferenceScreen = () => {
  const { user, maritalStatuses, religion, community, height, loader } =
    useSelector((state: any) => state.entities.authReducer);
  const maritalStatusBottomSheetRef = useRef<BottomSheet>(null);
  const ageRangeBottomSheetRef = useRef<BottomSheet>(null);
  const religionBottomSheetRef = useRef<BottomSheet>(null);
  const heightRangeBottomSheetRef = useRef<BottomSheet>(null);
  const tribeBottomSheetRef = useRef<BottomSheet>(null);
  const locationBottomSheetRef = useRef<BottomSheet>(null);
  const jobTypeBottomSheetRef = useRef<BottomSheet>(null);
  const settleDownBottomSheetRef = useRef<BottomSheet>(null);
  const [selectedMaritalStatuses, setSelectedMaritalStatuses] = useState<
    string[]
  >([]);
  const [selectedAgeRange, setSelectedAgeRange] = useState<{
    min: number;
    max: number;
  }>({ min: 20, max: 45 });
  const [selectedHeightRange, setSelectedHeightRange] = useState<{
    min: number;
    max: number;
  }>({ min: 5 * 12 + 5, max: 6 * 12 + 5 }); // 5ft 5in to 6ft 5in
  const [selectedTribes, setSelectedTribes] = useState<string[]>(['Any']);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>(['Any']);
  const [selectedSettleDown, setSelectedSettleDown] = useState<string[]>([
    'Any',
  ]);
  useEffect(() => {
    setSelectedMaritalStatuses(user.pMaritalStatusId);
    if (user?.preferredSettleDown) {
      setSelectedSettleDown(
        Array.isArray(user.preferredSettleDown)
          ? user.preferredSettleDown
          : [user.preferredSettleDown],
      );
    }
  }, [user]);
  const getMaritalStatusValue = () => {
    const uniqueCount = new Set(user.pMaritalStatusId).size;
    if (uniqueCount === 0) {
      return 'Any';
    }
    return `${uniqueCount} selected`;
  };
  const getAgeRangeValue = () => {
    if (user.pFromAge && user.pToAge) {
      return `${user.pFromAge} - ${user.pToAge} Years`;
    }
    return 'Any';
  };
  const cmToInches = (cm: number) => Math.round(cm / 2.54);
  const getReligionValue = () => {
    if (user.pReligionId) {
      return (
        religion.find((item: any) => item.id == user.pReligionId[0])?.name ||
        user.religion
      );
    }
    return user.religion;
  };
  const getHeightRangeValue = () => {
    if (user.pFromHeight && user.pToHeight) {
      return `${formatHeightInFeettoInches(
        cmToInches(user.pFromHeight),
      )} - ${formatHeightInFeettoInches(cmToInches(user.pToHeight))}`;
    }
    return 'Any';
  };
  const getTribeValue = () => {
    if (user.pCommunityId && typeof user.pCommunityId === 'string') {
      const communities = user.pCommunityId
        .split(',')
        .filter((id: string) => id.trim() !== '');
      return communities.length > 0 ? `${communities.length} selected` : 'Any';
    }
    if (Array.isArray(user.pCommunityId)) {
      return user.pCommunityId.length > 0 ? `${user.pCommunityId.length} selected` : 'Any';
    }
    return 'Any';
  };
  const getLocationValue = () => {
    if (selectedLocations.includes('Any')) {
      return 'Any';
    }
    if (selectedLocations.length === 0) {
      return 'Any';
    }
    if (selectedLocations.length === 1) {
      return selectedLocations[0];
    }
    return `${selectedLocations.length} selected`;
  };
  const getJobTypeValue = () => {
    if (!user.pOccupationId || user.pOccupationId === '' || user.pOccupationId === 'Any') {
      return 'Any';
    }
    let ids: string[] = [];
    if (Array.isArray(user.pOccupationId)) {
      ids = user.pOccupationId.filter((id: any) => id && id !== 'Any');
    } else if (typeof user.pOccupationId === 'string') {
      ids = user.pOccupationId
        .split(',')
        .map((id: string) => id.trim())
        .filter((id: string) => id && id !== 'Any');
    }
    if (ids.length === 0) {
      return 'Any';
    }
    return `${ids.length} selected`;
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
    {
      title: 'Marital Status',
      value: getMaritalStatusValue(),
      isClickable: true,
    },
    { title: 'Age', value: getAgeRangeValue(), isClickable: true },
    { title: 'Religion', value: getReligionValue(), isClickable: true },
    { title: 'Height', value: getHeightRangeValue(), isClickable: true },
  ];

  const secondaryPreferences = [
    { title: 'Tribe', value: getTribeValue(), isClickable: true },
    { title: 'Location', value: getLocationValue(), isClickable: true },
    { title: 'Job type', value: getJobTypeValue(), isClickable: true },
    { title: 'Settle Down', value: getSettleDownValue(), isClickable: true },
  ];

  const handleMaritalStatusPress = () => {
    maritalStatusBottomSheetRef.current?.expand();
  };

  const handleAgeRangePress = () => {
    ageRangeBottomSheetRef.current?.expand();
  };

  const handleReligionPress = () => {
    religionBottomSheetRef.current?.expand();
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

  const handleResetPress = () => {
    resetPreferenceApi();
  };

  const PreferenceCard = ({
    title,
    value,
    isClickable = false,
  }: {
    title: string;
    value: string;
    isClickable?: boolean;
  }) => {
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
        <View style={{ width: '80%' }}>
          <AppText text={title} textStyle={styles.cardTitle} />
          <AppText text={value} textStyle={styles.cardValue} />
        </View>
        <CheckCircleIcon />
      </TouchableOpacity>
    );
  };

  return (
    <AppSafeView style={{ padding: 0 }}>
      {loader && <AppLoader />}
      <View style={styles.header}>
        <AppHeader
          title="Preferences"
          rightButton={
            <TouchableOpacity
              onPress={handleResetPress}
              style={styles.resetButton}
            >
              <AppText text="Reset" textStyle={styles.resetButtonText} />
            </TouchableOpacity>
          }
        />
      </View>

      <AppScrollView style={{}}>
        <View style={styles.container}>
          <View style={styles.section}>
            <AppText
              text="My mandatory preferences"
              textStyle={styles.sectionTitle}
            />
            <AppText useChildren textStyle={styles.sectionDescription}>
              The matches you'll receive will{' '}
              <AppText useChildren textStyle={{ color: COLORS.secondaryText }}>
                exactly
              </AppText>{' '}
              meet the{' '}
              <AppText useChildren textStyle={{ color: COLORS.secondaryText }}>
                mandatory preferences.
              </AppText>
            </AppText>

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
        maritalOptions={maritalStatuses}
      />

      <AgeRangeBottomSheet
        bottomSheetRef={ageRangeBottomSheetRef}
        selectedAgeRange={selectedAgeRange}
      />

      <ReligionBottomSheet
        bottomSheetRef={religionBottomSheetRef}
        religionOptions={religion}
      />

      <HeightRangeBottomSheet
        bottomSheetRef={heightRangeBottomSheetRef}
        selectedHeightRange={selectedHeightRange}
        onSelectionChange={handleHeightRangeChange}
        onApply={handleHeightRangeApply}
        heightOptions={height}
      />

      <TribeBottomSheet
        bottomSheetRef={tribeBottomSheetRef}
        selectedTribes={selectedTribes}
        tribeOptions={community}
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
        selectedsettleTypes={selectedSettleDown}
        onApply={handleSettleDownApply}
      />
    </AppSafeView>
  );
};

export default PreferenceScreen;

const styles = StyleSheet.create({
  header: {},
  headerTitle: {
    fontSize: fontSize22,
    fontFamily: Fonts.OPEN_SANS_BOLD,
    color: COLORS.textBlack,
  },
  resetButton: {
    width: '45%',
    backgroundColor: COLORS.black,
    paddingVertical: Size8,
    borderRadius: Size8,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: COLORS.white,
    fontFamily: Fonts.OPEN_SANS_SEMI_BOLD,
    fontSize: fontSize14,
  },
  container: {
    padding: Size14,
    gap: Size14,
  },
  section: {
    gap: Size12,
  },
  sectionTitle: {
    fontSize: fontSize18,
    fontFamily: Fonts.OPEN_SANS_SEMI_CONDENSED_BOLD,
    color: COLORS.black,
    letterSpacing: 0.9,
  },
  sectionDescription: {
    fontSize: fontSize14,
    fontFamily: Fonts.OPEN_SANS_REGULAR,
    color: COLORS.secondaryText,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Size12,
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: Size12,
    padding: Size12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
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
  },
});
