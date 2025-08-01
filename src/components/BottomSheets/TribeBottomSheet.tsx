import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
import { COLORS } from '../../constants/AppColors';
import {
  fontSize14,
  fontSize16,
  fontSize20,
  Size12,
  Size14,
  Size16,
  Size20,
  Size25,
  Size8,
} from '../../constants/Sizes';
import Fonts from '../../constants/Fonts';
import Svg, { Path } from 'react-native-svg';
import {
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
  updateUrl,
} from '../../constants/functions';
import { completeUserProfileV2Updated } from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';

// Workaround: Defining Checkbox component locally due to issues with SvgIcons.jsx
const Checkbox = ({
  isChecked,
  size = Size25,
}: {
  isChecked: boolean;
  size?: number;
}) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: COLORS.violet,
        backgroundColor: isChecked ? COLORS.violet : 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {isChecked && (
        <Svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 16 12"
          fill="none"
        >
          <Path
            d="M1 5.5L6.5 10.5L15 1.5"
            stroke={COLORS.white}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    </View>
  );
};

interface TribeBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  selectedTribes: string[];
  onSelectionChange: (tribes: string[]) => void;
  onApply: (tribes: string[]) => void;
  tribeOptions: any[];
}

const TribeBottomSheet: React.FC<TribeBottomSheetProps> = ({
  bottomSheetRef,
  selectedTribes,
  onSelectionChange,
  onApply,
  tribeOptions,
}) => {
  const snapPoints = ['60%', '85%'];
  const [localSelectedTribes, setLocalSelectedTribes] =
    useState<string[]>(selectedTribes);
  const [localSelectedTribeId, setLocalSelectedTribeId] = useState<string[]>(
    [],
  );
  console.log(tribeOptions, 'tribeOptions');
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  useEffect(() => {
    setLocalSelectedTribeId(user.pCommunityId);
  }, [user.pCommunityId]);
  // Ensure initial tribes are preserved and merged with API values
  useEffect(() => {
    // Merge initial selectedTribes with user.pCommunityId from API, avoiding duplicates
    const apiTribes = Array.isArray(user.pCommunityId) ? user.pCommunityId : [];
    const initialTribes = Array.isArray(selectedTribes) ? selectedTribes : [];
    // Use Set to avoid duplicates
    const mergedTribes = Array.from(new Set([...initialTribes, ...apiTribes]));
    setLocalSelectedTribeId(mergedTribes);
    setLocalSelectedTribes(mergedTribes);
  }, [user.pCommunityId, selectedTribes]);

  const handleTribeToggle = (tribe: any) => {
    const tribeIds = Array.isArray(localSelectedTribeId) ? localSelectedTribeId : [];
    let updatedTribes: string[];
    if (tribeIds.includes(tribe.id)) {
      updatedTribes = tribeIds.filter(t => t !== tribe.id);
    } else {
      updatedTribes = [...tribeIds, tribe.id];
    }
    setLocalSelectedTribeId(updatedTribes);
    setLocalSelectedTribes(updatedTribes);
    onSelectionChange(updatedTribes);
  };

  const handleApply = async () => {
    try {
      const requestBody = {
        id: user.id,
        pCommunityId: localSelectedTribes.join(','),
      };
      console.log('requestBody', requestBody);
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
      console.log('error', error);
    } finally {
      bottomSheetRef.current?.close();
      onApply(localSelectedTribes);
    }
  };

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      handleApply();
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = localSelectedTribeId.includes(item.id);
    return (
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => handleTribeToggle(item)}
        activeOpacity={0.7}
      >
        <Checkbox isChecked={isSelected} />
        <AppText text={item.name} textStyle={styles.optionText} />
      </TouchableOpacity>
    );
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
        <View style={styles.headerContainer}>
          <AppText text="Tribe" textStyle={styles.headerTitle} />
          <AppText
            text="You can select multiple options"
            textStyle={styles.headerSubtitle}
          />
        </View>

        <FlatList
          data={tribeOptions}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default TribeBottomSheet;

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: Size20,
    borderTopRightRadius: Size20,
  },
  handleIndicator: {
    backgroundColor: COLORS.divider,
    width: 40,
    height: 8,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Size16,
    paddingVertical: Size12,
  },
  headerContainer: {
    alignItems: 'flex-start',
    gap: Size8,
    marginBottom: Size25,
  },
  headerTitle: {
    fontSize: fontSize20,
    fontFamily: Fonts.OPEN_SANS_SEMI_BOLD,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: fontSize14,
    fontFamily: Fonts.OPEN_SANS_REGULAR,
    color: COLORS.textInactive,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Size12,
  },
  optionText: {
    fontSize: fontSize16,
    fontFamily: Fonts.OPEN_SANS_REGULAR,
    color: COLORS.textBlack,
    left: Size14,
  },
});
