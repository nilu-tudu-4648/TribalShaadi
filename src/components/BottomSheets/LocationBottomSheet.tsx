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
  getCitiesByStateId,
  getUserDetailsUrl,
  getUserDetailsApi,
  setReducerLoadingfalse,
  updateUrl,
  searchCitiesApi,
} from '../../constants/functions';
import { useDispatch, useSelector } from 'react-redux';
import { SearchIcon, InfoIcon, ChipCloseIcon } from '../svg/SvgIcons2';
import { completeUserProfileV2Updated } from '../../store/reducers/authReducer';

interface LocationBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  selectedLocations: string[];
  onApply: (locations: string[]) => void;
}

const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  bottomSheetRef,
  selectedLocations,
  onApply,
}) => {
  const snapPoints = ['30%', '70%'];
  const dispatch = useDispatch();
  const { user, states } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const [selectedState, setSelectedState] = useState<any>(
    selectedLocations[0] || null,
  );
  const [selectedCities, setSelectedCities] = useState<any[]>(
    selectedLocations.slice(1) || [],
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
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
          .filter((state: any) => 
            state.name.toLowerCase().includes(query)
          )
          .map((state: any) => ({
            ...state,
            type: 'state',
            displayName: state.name
          }));

        // Search cities via API
        const citiesData = await searchCitiesApi(query);
        const filteredCities = (citiesData || []).map((city: any) => ({
          ...city,
          type: 'city',
          displayName: city.districtName || city.name
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
        setSelectedState(location);
        // Fetch cities for the selected state
        await getCitiesByStateId(location.id);
      } else {
        // Selecting cities/districts
        const alreadyExists = selectedCities.some(
          city => city.id === location.id,
        );
        if (!alreadyExists) {
          setSelectedCities([...selectedCities, location]);
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
        pStateLivingInId: selectedState?.id || null,
        pCityLivingInId:
          selectedCities.length > 0
            ? selectedCities.map(city => city.id)
            : null,
      };
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
      // pass state + cities as array
      onApply([selectedState, ...selectedCities]);
      bottomSheetRef.current?.close();
    } catch (error) {
      console.log(error, 'error');
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
        <View style={styles.searchContainer}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Add multiple cities/states"
            value={searchQuery}
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
                  <AppText text={item.displayName} textStyle={styles.searchResultName} />
                  <AppText 
                    text={item.type === 'state' ? 'State' : 'City'} 
                    textStyle={styles.searchResultType} 
                  />
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.searchResultRow}>
                <AppText text={isSearching ? "Searching..." : "No results found"} />
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
                {selectedState && (
                  <View key={selectedState.id} style={styles.chip}>
                    <AppText
                      text={selectedState.name}
                      textStyle={styles.chipText}
                    />
                    <TouchableOpacity onPress={() => setSelectedState(null)}>
                      <ChipCloseIcon />
                    </TouchableOpacity>
                  </View>
                )}
                {selectedCities.map((city: any) => (
                  <View key={city.id} style={styles.chip}>
                    <AppText text={city.name} textStyle={styles.chipText} />
                    <TouchableOpacity
                      onPress={() =>
                        setSelectedCities(
                          selectedCities.filter(c => c.id !== city.id),
                        )
                      }
                    >
                      <ChipCloseIcon />
                    </TouchableOpacity>
                  </View>
                ))}
                {selectedState === null && selectedCities.length === 0 && (
                  <View style={styles.emptySelectionContainer}>
                    <AppText 
                      text="No locations selected yet. Search above to add locations." 
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
    paddingVertical: Size20,
  },
  emptyText: {
    fontSize: fontSize14,
    fontFamily: Fonts.OPEN_SANS_REGULAR,
    color: COLORS.textGrey,
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
