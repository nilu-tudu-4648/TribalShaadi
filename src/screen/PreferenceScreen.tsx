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
  Size8,
} from '../constants/Sizes';
import { CheckCircleIcon } from '../components/svg/SvgIcons2';
import AppHeader from '../components/AppHeader';
import { useDispatch, useSelector } from 'react-redux';
import {
  formatHeightInFeettoInches,
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
  const [isResetLoading, setIsResetLoading] = useState(false);

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
    const uniqueCount = new Set(user?.pMaritalStatusId || []).size;
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
      return user.pCommunityId.length > 0
        ? `${user.pCommunityId.length} selected`
        : 'Any';
    }
    return 'Any';
  };
  const getLocationValue = () => {
    const cities = user.pCityLivingInId ? user.pCityLivingInId.split(',') : [];
    const states = user.pStateLivingInId
      ? user.pStateLivingInId.split(',')
      : [];
    if (cities.length > 0 && states.length > 0) {
      return `${cities.length + states.length} selected`;
    }
    if (cities.length > 0) {
      return `${cities.length} cities selected`;
    }
    if (states.length > 0) {
      return `${states.length} states selected`;
    }
    return 'Any';
  };
  const getJobTypeValue = () => {
    if (
      !user.pOccupationId ||
      user.pOccupationId === '' ||
      user.pOccupationId === 'Any'
    ) {
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
    if (
      user.psettle_down === 'Any' ||
      user.psettle_down === null ||
      user.psettle_down === undefined
    ) {
      return 'Any';
    }
    return `${user.psettle_down.split(',').length} selected`;
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
      <AppSafeView style={{ padding: 0 }}>
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
        />

        <AgeRangeBottomSheet bottomSheetRef={ageRangeBottomSheetRef} />

        <ReligionBottomSheet
          bottomSheetRef={religionBottomSheetRef}
          religionOptions={religion}
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

        <JobTypeBottomSheet bottomSheetRef={jobTypeBottomSheetRef} />

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
  cardContent: {
    width: '80%',
  },
  noPadding: {
    padding: 0,
  },
  secondaryTextStyle: {
    color: COLORS.secondaryText,
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
