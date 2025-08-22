import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
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
} from '../../constants/Sizes';
import Fonts from '../../constants/Fonts';
import Svg, { Path } from 'react-native-svg';
import {
  baseUrl,
  getMatchedUsersUrl,
  getUserDetailsApi,
  getUserDetailsUrl,
  setReducerLoadingfalse,
  updateUrl,
} from '../../constants/functions';
import { completeUserProfileV2Updated } from '../../store/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setMatchedUserApi } from '../../store/reducers/userReducer';

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
      style={[
        styles.checkboxContainer,
        isChecked ? styles.checkboxChecked : styles.checkboxUnchecked,
        {
          width: size,
          height: size,
        },
      ]}
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

// Extract backdrop component to avoid defining during render
const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
  />
);

interface TribeBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  tribeOptions: any[];
}

const TribeBottomSheet: React.FC<TribeBottomSheetProps> = ({
  bottomSheetRef,
  tribeOptions,
}) => {
  const snapPoints = ['70%', '80%'];
  const [localSelectedTribes, setLocalSelectedTribes] =
    useState<string[]>();
  const [localSelectedTribeId, setLocalSelectedTribeId] = useState<string[]>(
    [],
  );
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  useEffect(() => {
    let normalizedIds: string[] = [];
    
    if (Array.isArray(user.pCommunityId)) {
      normalizedIds = user.pCommunityId.map((id: any) => String(id).trim());
    } else if (typeof user.pCommunityId === 'string') {
      // Check if pCommunityId is "any" string
      if (user.pCommunityId === 'any') {
        normalizedIds = ['Any'];
      } else {
        normalizedIds = user.pCommunityId
          .split(',')
          .map((id: string) => id.trim())
          .filter(Boolean);
      }
    } else if (user.pCommunityId != null) {
      normalizedIds = [String(user.pCommunityId).trim()];
    }

    const mergedTribes = Array.from(new Set(normalizedIds));
    setLocalSelectedTribeId(mergedTribes);
    setLocalSelectedTribes(mergedTribes);
  }, [user.pCommunityId]);

  const handleTribeToggle = (tribe: any) => {
    const tappedId = String(tribe.id);
    const currentIds = Array.isArray(localSelectedTribeId)
      ? [...localSelectedTribeId]
      : [];

    let updatedTribes: string[] = currentIds;

    if (tappedId === 'Any') {
      // Toggle 'Any' and clear all others when selecting it
      if (currentIds.includes('Any')) {
        updatedTribes = [];
      } else {
        updatedTribes = ['Any'];
      }
    } else {
      // Remove 'Any' if present when selecting specific options
      updatedTribes = currentIds.filter(id => id !== 'Any');
      if (updatedTribes.includes(tappedId)) {
        updatedTribes = updatedTribes.filter(id => id !== tappedId);
      } else {
        updatedTribes = [...updatedTribes, tappedId];
      }
    }

    setLocalSelectedTribeId(updatedTribes);
    setLocalSelectedTribes(updatedTribes);
  };

  const handleApply = async () => {
    try {
      let pCommunityIdValue: string;
      
      // Check if 'Any' is selected
      if ((localSelectedTribes || []).includes('Any')) {
        pCommunityIdValue = 'any';
      } else {
        // Remove 'any' (id: 97) from the selected tribes before sending to API
        const filteredTribes = (localSelectedTribes || []).filter(
          id => id !== '97',
        );
        pCommunityIdValue = filteredTribes.join(',');
      }
      
      const requestBody = {
        id: user.id,
        pCommunityId: pCommunityIdValue,
      };
      console.log('requestBody', requestBody);
      dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
      setReducerLoadingfalse(dispatch, () => {
        getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      });
    } catch (error) {
      console.log('error', error);
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

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = localSelectedTribeId?.includes(String(item.id)) || false;
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
      enablePanDownToClose
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.bottomSheetBackground}
    >
      {/* header stays outside the list */}
      <View style={styles.headerContainer}>
        <AppText text="Tribe" textStyle={styles.headerTitle} />
        <AppText
          text="You can select multiple options"
          textStyle={styles.headerSubtitle}
        />
      </View>

      {/* list */}
      <BottomSheetFlatList
        data={[{ id: 'Any', name: 'Any' }, ...tribeOptions]}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
      />
    </BottomSheet>
  );
};

export default React.memo(TribeBottomSheet);

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
    paddingHorizontal: Size16,
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
  checkboxContainer: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.violet,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.violet,
  },
  checkboxUnchecked: {
    backgroundColor: 'transparent',
  },
  listContentContainer: {
    paddingBottom: 40,
    paddingHorizontal: Size16,
  },
});
