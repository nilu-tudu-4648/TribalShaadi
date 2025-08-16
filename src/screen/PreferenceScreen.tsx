import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
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
  Size4,
  Size8,
} from '../constants/Sizes';
import { CheckCircleIcon } from '../components/svg/SvgIcons2';
import AppHeader from '../components/AppHeader';
import { useDispatch, useSelector } from 'react-redux';
import {
  formatHeightInFeettoInches,
  getEmploymentTypeApi,
  resetPreferenceApi,
} from '../constants/functions';
import { useNavigation } from '@react-navigation/native';
import Loader from '../components/loader/Loader';

const PreferenceCard = ({
  title,
  value,
  isClickable = false,
  onPress,
}: {
  title: string;
  value: string;
  isClickable?: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, isClickable && styles.clickableCard]}
      onPress={onPress}
      disabled={!isClickable}
      activeOpacity={isClickable ? 0.7 : 1}
    >
      <View style={styles.cardContent}>
        <AppText text={title} textStyle={styles.cardTitle} />
        <AppText text={value} textStyle={styles.cardValue} />
      </View>
      <CheckCircleIcon />
    </TouchableOpacity>
  );
};

const PreferenceScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCities, setSelectedCities] = useState<any[]>([]);
  const [localSelectedStatuses, setLocalSelectedStatuses] =
  useState<string[]>();
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [jobTypeOptions, setJobTypeOptions] = useState<string[]>([]);
  const [localSelectedReligion, setLocalSelectedReligion] =
  useState<string | null>(null);
const [localSelectedReligionId, setLocalSelectedReligionId] = useState<
  string | null
>(null);
  useEffect(() => {
    getEmploymentTypeApi().then(res => {
      setJobTypeOptions(res);
    });
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      maritalStatusBottomSheetRef.current?.close();
      ageRangeBottomSheetRef.current?.close();
      religionBottomSheetRef.current?.close();
      heightRangeBottomSheetRef.current?.close();
      tribeBottomSheetRef.current?.close();
      locationBottomSheetRef.current?.close();
      jobTypeBottomSheetRef.current?.close();
      settleDownBottomSheetRef.current?.close();
    });

    return unsubscribe;
  }, [navigation]);

  const getMaritalStatusValue = () => {
    const maritalStatusIds = user.pMaritalStatusId || [];
    const statusList = Array.isArray(maritalStatuses) ? maritalStatuses : [];
    const selectedStatuses = statusList
      .filter((item: any) => maritalStatusIds.includes(item.id))
      .map((item: any) => item.name);
    if (selectedStatuses.length === 0) return 'Any';
    if (selectedStatuses.length <= 1) return selectedStatuses.join(', ');
    return `${selectedStatuses.slice(0, 1).join(', ').charAt(0).toUpperCase() + selectedStatuses.slice(0, 1).join(', ').slice(1)}...`;
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
    let communityIds: string[] = [];
    const rawCommunity = user.pCommunityId;
    if (Array.isArray(rawCommunity)) {
      communityIds = rawCommunity.map((id: any) => String(id).trim());
    } else if (typeof rawCommunity === 'string') {
      communityIds = rawCommunity
        .split(',')
        .map((id: string) => id.trim())
        .filter(Boolean);
    } else if (rawCommunity != null) {
      communityIds = [String(rawCommunity).trim()];
    }

    const communities = community
      .filter((item: any) => communityIds.includes(String(item.id)))
      .map((item: any) => item.name);
    if (communities.length === 0) return 'Any';
    if (communities.length <= 1) return communities.join(', ');
    return `${communities.slice(0, 1).join(', ')}...`;
  };
  const getLocationValue = () => {
    const cities = user.pCityLivingInId ? user.pCityLivingInId.split(',') : [];
    const states = user.pStateLivingInId
      ? user.pStateLivingInId.split(',')
      : [];
    const selectedValues = [...cities, ...states];
    if (selectedValues.length === 0) return 'Any';
    if (selectedValues.length <= 1) return selectedValues.join(', ');
    return `${selectedValues.slice(0, 1).join(', ')}...`;
  };
  const getJobTypeValue = () => {
    const jobTypeIds = user.pOccupationId || [];
    const jobTypes = jobTypeOptions
      .filter((item: any) => jobTypeIds.includes(item.id))
      .map((item: any) => item.name);
    if (jobTypes.length === 0) return 'Any';
    if (jobTypes.length <= 1) return jobTypes.join(', ');
    return `${jobTypes.slice(0, 1).join(', ')}...`;
  };
  const getSettleDownValue = () => {
    if (user.psettle_down) {
      return `${user.psettle_down?.split(',')[0]}...`;
    }
    return 'Any';
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

  const handleTribePress = () => {
    tribeBottomSheetRef.current?.expand();
  };

  const handleLocationPress = () => {
    locationBottomSheetRef.current?.expand();
  };

  const handleJobTypePress = () => {
    jobTypeBottomSheetRef.current?.expand();
  };
  const handleSettleDownPress = () => {
    settleDownBottomSheetRef.current?.expand();
  };

  const handleResetPress = () => {
    setIsResetLoading(true);
    setSelectedCities([]);
    setSelectedState([]);
    setLocalSelectedReligion(null);
    setLocalSelectedReligionId(null);
    setLocalSelectedStatuses([]);
    resetPreferenceApi(dispatch, () => {
      setIsResetLoading(false);
    });
  };

  const getPreferenceHandler = (title: string) => {
    if (title === 'Marital Status') return handleMaritalStatusPress;
    if (title === 'Age') return handleAgeRangePress;
    if (title === 'Religion') return handleReligionPress;
    if (title === 'Height') return handleHeightRangePress;
    if (title === 'Tribe') return handleTribePress;
    if (title === 'Location') return handleLocationPress;
    if (title === 'Job type') return handleJobTypePress;
    if (title === 'Settle Down') return handleSettleDownPress;
    return () => {};
  };

  return (
    <>
      <AppSafeView style={styles.appSafeViewContainer}>
        <View style={styles.header}>
          <AppHeader
            title="Preferences"
            onBackPress={() => navigation.goBack()}
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
                <AppText
                  useChildren
                  textStyle={{ color: COLORS.secondaryText }}
                >
                  exactly
                </AppText>{' '}
                meet the{' '}
                <AppText
                  useChildren
                  textStyle={{ color: COLORS.secondaryText }}
                >
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
                    onPress={getPreferenceHandler(item.title)}
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
                    onPress={getPreferenceHandler(item.title)}
                  />
                ))}
              </View>
            </View>
          </View>
        </AppScrollView>

        <MaritalStatusBottomSheet
          bottomSheetRef={maritalStatusBottomSheetRef}
          maritalOptions={maritalStatuses}
          localSelectedStatuses={localSelectedStatuses}
          setLocalSelectedStatuses={setLocalSelectedStatuses}
        />

        <AgeRangeBottomSheet bottomSheetRef={ageRangeBottomSheetRef} />

        <ReligionBottomSheet
          bottomSheetRef={religionBottomSheetRef}
          religionOptions={religion}
          localSelectedReligion={localSelectedReligion}
          setLocalSelectedReligion={setLocalSelectedReligion}
          localSelectedReligionId={localSelectedReligionId}
          setLocalSelectedReligionId={setLocalSelectedReligionId}
        />

        <HeightRangeBottomSheet
          bottomSheetRef={heightRangeBottomSheetRef}
          heightOptions={height}
        />

        <TribeBottomSheet
          bottomSheetRef={tribeBottomSheetRef}
          tribeOptions={community}
        />

        <LocationBottomSheet
          bottomSheetRef={locationBottomSheetRef}
          selectedCities={selectedCities}
          setSelectedCities={setSelectedCities}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
        />

        <JobTypeBottomSheet
          bottomSheetRef={jobTypeBottomSheetRef}
          jobTypeOptions={jobTypeOptions}
        />

        <SettleDownBottomSheet bottomSheetRef={settleDownBottomSheetRef} />
      </AppSafeView>
      {(loader || isResetLoading) && (
        <View style={styles.loaderOverlay}>
          <Loader />
        </View>
      )}
    </>
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
    paddingVertical: Size14,
    paddingHorizontal: Size12,
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
    marginBottom: Size4,
  },
  cardValue: {
    fontSize: fontSize14,
    fontFamily: Fonts.OPEN_SANS_BOLD,
    color: COLORS.textBlack,
  },
  cardContent: {
    width: '80%',
  },
  secondaryTextStyle: {
    color: COLORS.secondaryText,
  },
  appSafeViewContainer: {
    padding: 0,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
