import React from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
import { COLORS } from '../../constants/AppColors';
import {
  fontSize14,
  fontSize20,
  Size10,
  Size12,
  Size16,
  Size20,
  Size25,
  Size4,
} from '../../constants/Sizes';
import Fonts from '../../constants/Fonts';
import { useSelector } from 'react-redux';
import {
  BellIcon,
  CheckCircleIcon,
  MailIcon,
  UserIcon,
} from '../svg/SvgIcons2';

interface AccountBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}

const AccountBottomSheet: React.FC<AccountBottomSheetProps> = ({
  bottomSheetRef,
}) => {
  const snapPoints = ['40%', '40%'];
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      bottomSheetRef.current?.close();
    }
  };

  return (
    <>
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
          <View>
            <AppText text="Account details" textStyle={styles.headerTitle} />
            <View style={styles.accountDetailsContainer}>
              <View style={styles.accountDetailItem}>
                <UserIcon />
                <AppText
                  text={`User ID: ${user?.id}`}
                  textStyle={styles.accountDetailText}
                />
              </View>
              <View style={{ ...styles.accountDetailItem, right: Size4 / 2 }}>
                <MailIcon />
                <AppText
                  text={`${user?.email}`}
                  textStyle={styles.accountDetailText}
                />
              </View>
              <View style={styles.accountDetailItem}>
                <BellIcon />
                <AppText
                  text={`${user?.contactNo}`}
                  textStyle={styles.accountDetailText}
                />
              </View>
            </View>
          </View>
          <View>
            <AppText text="Login methods" textStyle={styles.headerTitle} />
            <View style={styles.accountDetailsContainer}>
              <View style={styles.accountDetailItem}>
                <BellIcon />
                <AppText
                  text={`${user?.contactNo}`}
                  textStyle={styles.accountDetailText}
                />
                <CheckCircleIcon color={COLORS.violet} />
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default AccountBottomSheet;

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
    gap: Size25,
  },
  headerTitle: {
    fontSize: fontSize20,
    fontFamily: Fonts.OPEN_SANS_BOLD,
    color: COLORS.textBlack,
  },
  accountDetailsContainer: {
    gap: Size16,
    marginTop: Size12,
  },
  accountDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Size10,
  },
  accountDetailText: {
    fontSize: fontSize14,
    color: COLORS.black,
  },
});
