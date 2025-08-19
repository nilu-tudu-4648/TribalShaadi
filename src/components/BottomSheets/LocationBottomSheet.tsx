import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
import { COLORS } from '../../constants/AppColors';
import {
  borderWidth,
  fontSize14,
  fontSize16,
  Size12,
  Size14,
  Size16,
  Size20,
  Size8,
} from '../../constants/Sizes';
import Fonts from '../../constants/Fonts';
import {
  getUserDetailsUrl,
  getUserDetailsApi,
  setReducerLoadingfalse,
  updateUrl,
  searchCitiesApi,
  baseUrl,
  getMatchedUsersUrl,
} from '../../constants/functions';
import { useDispatch, useSelector } from 'react-redux';
import { SearchIcon, InfoIcon, ChipCloseIcon } from '../svg/SvgIcons2';
import { completeUserProfileV2Updated } from '../../store/reducers/authReducer';
import { setMatchedUserApi } from '../../store/reducers/userReducer';

interface LocationBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  selectedCities: any[];
  setSelectedCities: (cities: any[]) => void;
  selectedState: any;
  setSelectedState: (state: any) => void;
}

const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  bottomSheetRef,
  selectedCities,
  setSelectedCities,
  selectedState,
  setSelectedState,
}) => {
  const snapPoints = ['30%', '70%'];
  const dispatch = useDispatch();
  const { user, states } = useSelector(
    (state: any) => state.entities.authReducer,
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (user.pStateLivingInId) {
      setSelectedState(user.pStateLivingInId.split(','));
    }
    if (user.pCityLivingInId) {
      setSelectedCities(user.pCityLivingInId.split(','));
    }
  }, [user, setSelectedCities, setSelectedState]);
  // Handle search with useEffect instead of useMemo
  useEffect(() => {
    const searchCities = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const query = searchQuery.toLowerCase();

        // Filter states based on search query
        const filteredStates = states
          .filter((state: any) => state.name.toLowerCase().includes(query))
          .map((state: any) => ({
            ...state,
            type: 'state',
            displayName: state.name,
          }));

        // Search cities via API
        const citiesData = await searchCitiesApi(query);
        const filteredCities = (citiesData || []).map((city: any) => ({
          ...city,
          type: 'city',
          displayName: city.districtName || city.name,
        }));

        // Combine states and cities, with states first
        const combinedResults = [...filteredStates, ...filteredCities];
        setSearchResults(combinedResults);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchCities, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchQuery, states]);

  const addLocation = async (location: any) => {
    try {
      // If selecting a state
      if (location?.type === 'state') {
        // Ensure selectedState is always an array and not null/undefined
        const stateArray = Array.isArray(selectedState)
          ? selectedState
          : selectedState
          ? [selectedState]
          : [];
        const alreadyExists = stateArray.some(
          (state: any) =>
            (typeof state === 'string' ? state : state.name) ===
            (typeof location === 'string' ? location : location.name),
        );
        if (!alreadyExists) {
          setSelectedState((prev: any) => {
            const prevArray = Array.isArray(prev) ? prev : prev ? [prev] : [];
            return [...prevArray, location];
          });
        }
      } else {
        // Selecting cities/districts
        const cityArray = Array.isArray(selectedCities)
          ? selectedCities
          : selectedCities
          ? [selectedCities]
          : [];
        const alreadyExists = cityArray.some(
          (city: any) =>
            (typeof city === 'string' ? city : city.name) ===
            (typeof location === 'string' ? location : location.name),
        );
        if (!alreadyExists) {
          setSelectedCities([...cityArray, location]);
        }
      }
      setSearchQuery('');
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const handleApply = () => {
    try {
      const requestBody = {
        id: user.id,
        pStateLivingInId:
          selectedState && selectedState.length > 0
            ? selectedState.map((st: any) => st.name || st).join(',')
            : null,
        pCityLivingInId:
          selectedCities && selectedCities.length > 0
            ? selectedCities.map(city => city.name || city).join(',')
            : null,
      };
      console.log('requestBody', requestBody);
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
      console.log(error, 'error');
    } finally {
      dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
        bottomSheetRef.current?.close();
    }
  };

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      handleApply();
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onChange={handleSheetChanges}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View
          style={[
            styles.searchContainer,
            { borderColor: active && searchQuery.length > 0 ? COLORS.violet : COLORS.divider },
          ]}
        >
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Add multiple cities/states"
            value={searchQuery}
            placeholderTextColor={COLORS.textGrey}
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            onChangeText={setSearchQuery}
          />
        </View>

        {searchQuery.length > 0 ? (
          <BottomSheetFlatList
            data={searchResults}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }: { item: any }) => (
              <TouchableOpacity
                style={styles.searchResultRow}
                onPress={() => addLocation(item)}
              >
                <View style={styles.searchResultContent}>
                  <AppText
                    text={item.displayName}
                    textStyle={styles.searchResultName}
                  />
                  <AppText
                    text={item.type === 'state' ? 'State' : 'City'}
                    textStyle={styles.searchResultType}
                  />
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.searchResultRow}>
                <AppText
                  text={isSearching ? 'Searching...' : 'No results found'}
                />
              </View>
            }
          />
        ) : (
          <View style={styles.selectedLocationsContainer}>
            <AppText
              text="Selected Locations"
              textStyle={styles.sectionTitle}
            />
            <View style={styles.infoBanner}>
              <InfoIcon color={COLORS.violet} />
              <AppText
                text="Add your home state to get 10X more preferred matches"
                textStyle={styles.infoText}
              />
            </View>

            <BottomSheetScrollView
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.chipsContainer}>
                {selectedState?.map((state: any, index: number) => {
                  const stateName =
                    typeof state === 'string' ? state : state.name;
                  return (
                    <View key={index} style={styles.chip}>
                      <AppText text={stateName} textStyle={styles.chipText} />
                      <TouchableOpacity
                        onPress={() =>
                          setSelectedState(
                            selectedState.filter(
                              (s: any) =>
                                (typeof s === 'string' ? s : s.name) !==
                                stateName,
                            ),
                          )
                        }
                      >
                        <ChipCloseIcon />
                      </TouchableOpacity>
                    </View>
                  );
                })}
                {selectedCities.map((city: any, index: number) => {
                  const cityName = typeof city === 'string' ? city : city.name;
                  return (
                    <View key={index} style={styles.chip}>
                      <AppText text={cityName} textStyle={styles.chipText} />
                      <TouchableOpacity
                        onPress={() =>
                          setSelectedCities(
                            selectedCities.filter(
                              (c: any) =>
                                (typeof c === 'string' ? c : c.name) !==
                                cityName,
                            ),
                          )
                        }
                      >
                        <ChipCloseIcon />
                      </TouchableOpacity>
                    </View>
                  );
                })}
                {selectedState === null && selectedCities.length === 0 && (
                  <View style={styles.emptySelectionContainer}>
                    <AppText
                      text="Open to all cities/states"
                      textStyle={styles.emptyText}
                    />
                  </View>
                )}
              </View>
            </BottomSheetScrollView>
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default LocationBottomSheet;

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: Size20,
    borderTopRightRadius: Size20,
  },
  handleIndicator: { backgroundColor: COLORS.divider, width: 40, height: 4 },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Size16,
    paddingVertical: Size12,
    gap: Size16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: Size12,
    paddingHorizontal: Size12,
    gap: Size8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: fontSize16,
    fontFamily: Fonts.OPEN_SANS_REGULAR,
  },
  sectionTitle: {
    fontSize: fontSize16,
    fontFamily: Fonts.OPEN_SANS_SEMI_BOLD,
    color: COLORS.textBlack,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EFFF',
    borderRadius: Size8,
    padding: Size12,
    gap: Size8,
  },
  infoText: {
    fontSize: fontSize14,
    fontFamily: Fonts.OPEN_SANS_REGULAR,
    color: COLORS.textBlack,
    flex: 1,
  },
  selectedLocationsContainer: {
    flex: 1,
    gap: Size12,
  },
  scrollContainer: {
    flex: 1,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Size8,
    paddingBottom: Size16,
  },
    emptySelectionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Size20*4,
    width: '90%',
  },
  emptyText: {
    fontSize: fontSize16,
    fontFamily: Fonts.OPEN_SANS_REGULAR,
    color: "#1B222B",
    textAlign: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: Size20,
    paddingHorizontal: Size12,
    paddingVertical: Size8,
    borderWidth: borderWidth,
    borderColor: COLORS.grey,
    elevation: 2,
    gap: Size8,
  },
  chipText: { fontSize: fontSize14, fontFamily: Fonts.OPEN_SANS_REGULAR },
  applyButton: {
    backgroundColor: COLORS.black,
    paddingVertical: Size14,
    borderRadius: Size12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: fontSize16,
    fontFamily: Fonts.OPEN_SANS_SEMI_BOLD,
  },
  searchResultRow: {
    paddingVertical: Size14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  searchResultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchResultName: {
    fontSize: fontSize14,
    fontFamily: Fonts.OPEN_SANS_REGULAR,
    color: COLORS.textBlack,
  },
  searchResultType: {
    fontSize: fontSize14,
    fontFamily: Fonts.OPEN_SANS_REGULAR,
    color: COLORS.textGrey,
    backgroundColor: COLORS.lightgrey,
    paddingHorizontal: Size8,
    paddingVertical: Size8,
    borderRadius: Size8,
  },
});
