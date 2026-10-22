import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import BottomSheet from '@gorhom/bottom-sheet';
import { ROUTES } from '../constants/data';

export type PreferenceGroup = 'primary' | 'secondary';

export const useIsPremium = (group: PreferenceGroup) => {
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const {
    packageByUserId,
    isPrimaryPreferenceEditPaid,
    isSecondaryPreferenceEditPaid,
  } = useSelector(
    (state: any) => state.entities.paymentReducer,
  );
  return (
    !(group === 'primary'
      ? isPrimaryPreferenceEditPaid
      : isSecondaryPreferenceEditPaid) ||
    (Array.isArray(packageByUserId) && packageByUserId.length > 0) ||
    user?.gender === 'Female'
  );
};

// Lets non-premium users view a preference sheet, but any tap on its
// content closes the sheet and sends them to the upgrade screen.
const PremiumGateOverlay = ({
  bottomSheetRef,
  group,
}: {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  group: PreferenceGroup;
}) => {
  const navigation = useNavigation();
  const isPremium = useIsPremium(group);
  if (isPremium) return null;
  return (
    <Pressable
      style={StyleSheet.absoluteFill}
      onPress={() => {
        bottomSheetRef.current?.close();
        (navigation as any).navigate(ROUTES.UPGRADE);
      }}
    />
  );
};

export default PremiumGateOverlay;
