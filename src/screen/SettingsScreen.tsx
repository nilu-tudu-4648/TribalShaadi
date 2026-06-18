import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppHeader from '../components/AppHeader';
import { COLORS } from '../constants/AppColors';
import AppSafeView from '../components/AppSafeView';
import { LightBulbIcon, RightArrowIcon } from '../components/svg/SvgIcons';
import AppText from '../components/AppText';
import { fontSize16, Size12, Size25, Size4, Size8 } from '../constants/Sizes';
import AppButton from '../components/AppButton';
import LogoutDialog from '../components/dialogs/LogoutDialog';
import { logoutUser } from '../constants/functions';
import { useNavigation } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import AccountBottomSheet from '../components/BottomSheets/AccountBottomSheet';
import { usePostHog } from 'posthog-react-native';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const posthog = usePostHog();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const [isLogoutDialogVisible, setIsLogoutDialogVisible] = useState(false);
  const accountBottomSheetRef = useRef<BottomSheet | null>(null);
  const handleLogout = () => {
    posthog.capture('tap_logout_account');
    setIsLogoutDialogVisible(false);
    logoutUser(dispatch, user?.id);
  };
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      accountBottomSheetRef.current?.close();
    });

    return unsubscribe;
  }, [navigation]);

  const onDismiss = () => {
    setIsLogoutDialogVisible(false);
  };
  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Settings" onBackPress={() => navigation.goBack()} />
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => {
            accountBottomSheetRef?.current?.expand();
          }}
        >
          <View style={styles.iconContainer}>
            <LightBulbIcon />
            <AppText text="Account details" />
            <AppText text="User ID, Email" textStyle={styles.subText} />
          </View>
          <RightArrowIcon />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          title="Logout"
          onPress={() => setIsLogoutDialogVisible(true)}
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
        />
      </View>
      <LogoutDialog
        isVisible={isLogoutDialogVisible}
        onDismiss={onDismiss}
        onLogout={handleLogout}
      />
      <AccountBottomSheet bottomSheetRef={accountBottomSheetRef} />
    </AppSafeView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  topContainer: {
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: Size12,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Size4,
    paddingVertical: Size8,
  },
  subText: {
    fontSize: fontSize16,
    color: COLORS.grey,
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: Size8,
    paddingVertical: Size12,
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: Size25,
  },
  buttonText: {
    color: COLORS.red,
  },
});
