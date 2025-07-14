import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
import { COLORS } from '../../constants/AppColors';
import {
  fontSize14,
  fontSize16,
  Size12,
  Size14,
  Size16,
  Size20,
  Size8,
} from '../../constants/Sizes';
import Fonts from '../../constants/Fonts';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { getCitiesUrl } from '../../constants/functions';
import { getCities } from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';

// --- Local Svg Icons (Workaround) ---
const SearchIcon = ({ size = 20, color = COLORS.textInactive }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 21L16.65 16.65"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ChipCloseIcon = ({ size = 12, color = COLORS.textBlack }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line
      x1="18"
      y1="6"
      x2="6"
      y2="18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="6"
      y1="6"
      x2="18"
      y2="18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const InfoIcon = ({ size = 20, color = COLORS.black }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Line x1="12" y1="16" x2="12" y2="12" stroke={color} strokeWidth="2" />
    <Line
      x1="12"
      y1="8"
      x2="12"
      y2="8"
      stroke={color}
      strokeWidth="2"
      stroke-linecap="round"
    />
  </Svg>
);

interface LocationBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  selectedLocations: string[];
  onApply: (locations: string[]) => void;
}

const allLocations = [
  'Jharkhand(State)',
  'Jharsuguda',
  'Dhanbad',
  'Ranchi',
  'Jamshedpur',
  'Bokaro',
  'Deoghar',
  'Hazaribagh',
  'Giridih',
  'Ramgarh',
  'Odisha(State)',
  'Bhubaneswar',
  'Cuttack',
  'Rourkela',
  'Puri',
  'West Bengal(State)',
  'Kolkata',
  'Asansol',
  'Siliguri',
  'Durgapur',
];

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
  const [localSelected, setLocalSelected] =
    useState<string[]>(selectedLocations);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    if (localSelected.length > 0) {
      dispatch(getCities(`${getCitiesUrl}?stateId=${localSelected[0]}`));
    }
  }, [localSelected, dispatch]);
  const filteredLocations = useMemo(() => {
    if (!searchQuery) return [];
    return allLocations.filter(
      loc =>
        loc.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !localSelected.includes(loc),
    );
  }, [searchQuery, localSelected]);

  const addLocation = (location: string) => {
    if (!localSelected.includes(location)) {
      setLocalSelected([...localSelected, location]);
    }
    setSearchQuery('');
  };

  const removeLocation = (location: string) => {
    setLocalSelected(localSelected.filter(loc => loc !== location));
  };

  const handleApply = () => {
    onApply(localSelected);
    bottomSheetRef.current?.close();
  };

  // const handleSheetChanges = (index: number) => {
  //   if (index === -1) {
  //     setLocalSelected(selectedLocations);
  //     setSearchQuery('');
  //   }
  // };

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
            data={filteredLocations}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.searchResultRow}
                onPress={() => addLocation(item)}
              >
                <AppText text={item} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.searchResultRow}>
                <AppText text="No results found" />
              </View>
            }
          />
        ) : (
          <View style={{ flex: 1 }}>
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

            <View style={styles.chipsContainer}>
              {localSelected.map(loc => (
                <View key={loc} style={styles.chip}>
                  <AppText text={loc} textStyle={styles.chipText} />
                  <TouchableOpacity onPress={() => removeLocation(loc)}>
                    <ChipCloseIcon />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: Size12,
    paddingHorizontal: Size12,
    marginBottom: Size16,
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
    marginBottom: Size12,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EFFF',
    borderRadius: Size8,
    padding: Size12,
    marginBottom: Size16,
    gap: Size8,
  },
  infoText: {
    fontSize: fontSize14,
    fontFamily: Fonts.OPEN_SANS_REGULAR,
    color: COLORS.textBlack,
    flex: 1,
  },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Size8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgDisabled,
    borderRadius: Size20,
    paddingHorizontal: Size12,
    paddingVertical: Size8,
    borderWidth: 1,
    borderColor: COLORS.divider,
    gap: Size8,
  },
  chipText: { fontSize: fontSize14, fontFamily: Fonts.OPEN_SANS_REGULAR },
  applyButton: {
    backgroundColor: COLORS.black,
    paddingVertical: Size14,
    borderRadius: Size12,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: Size8,
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
});
