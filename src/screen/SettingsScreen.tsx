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
import { deleteUserApi, logoutUser } from '../constants/functions';
import { useNavigation } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';
import DeleteBottomSheet from '../components/BottomSheets/DeleteBottomSheet';
import AccountBottomSheet from '../components/BottomSheets/AccountBottomSheet';

const SettingsScreen = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state: any) => state.entities.authReducer);
  const [isLogoutDialogVisible, setIsLogoutDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const accountBottomSheetRef = useRef<BottomSheet | null>(null);
  const handleLogout = () => {
    if (isDeleteDialogVisible) {
      return deleteUserApi(user.id, dispatch);
    }
    setIsLogoutDialogVisible(false);
    logoutUser(dispatch);
  };
  const navigation = useNavigation();
  const deleteBottomSheetRef = useRef<BottomSheet | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      accountBottomSheetRef.current?.close();
      deleteBottomSheetRef.current?.close();
    });

    return unsubscribe;
  }, [navigation]);

  const openDeleteBottomSheet = () => {
    deleteBottomSheetRef?.current?.expand();
  };
  const handleDelete = (reason: string) => {
    console.log('reason', reason);
  };
  const onDismiss = () => {
    setIsDeleteDialogVisible(false);
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
            <AppText text="User ID, Emai" textStyle={styles.subText} />
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
        <AppButton
          title="Delete"
          onPress={openDeleteBottomSheet}
          buttonStyle={styles.secondaryButton}
          textStyle={styles.buttonText}
        />
      </View>
      <LogoutDialog
        isVisible={isLogoutDialogVisible || isDeleteDialogVisible}
        onDismiss={onDismiss}
        onLogout={handleLogout}
        isDelete={isDeleteDialogVisible}
      />
      <DeleteBottomSheet
        bottomSheetRef={deleteBottomSheetRef}
        onReport={handleDelete}
        onPressYes={() => {
          setIsDeleteDialogVisible(true);
        }}
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
  secondaryButton: {
    backgroundColor: COLORS.white,
  },
  buttonText: {
    color: COLORS.red,
  },
});
