import {
  StyleSheet,
  View,
  Pressable,
  Image,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppSafeView from '../components/AppSafeView';
import AppHeader from '../components/AppHeader';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { COLORS } from '../constants/AppColors';
import * as Sizes from '../constants/Sizes';
import { LightBulbIcon, RightArrowIcon } from '../components/svg/SvgIcons';

import { ROUTES } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import {
  HeartIcon,
  LockIcon,
  RefundIcon,
  SupportIcon,
  TermsIcon,
  WarningIcon,
} from '../components/svg/SvgIcons2';
import BottomSheet from '@gorhom/bottom-sheet';
import DeleteBottomSheet from '../components/BottomSheets/DeleteBottomSheet';
import LogoutDialog from '../components/dialogs/LogoutDialog';
import { deleteUserApi } from '../constants/functions';
import { usePostHog } from 'posthog-react-native';

const HelpScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const posthog = usePostHog();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const deleteBottomSheetRef = useRef<BottomSheet | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      deleteBottomSheetRef.current?.close();
    });

    return unsubscribe;
  }, [navigation]);

  const handleDelete = (reason: string) => {};

  const handleDeleteAccount = () => {
    posthog.capture('tap_delete_account');
    setIsDeleteDialogVisible(false);
    deleteUserApi(user.id, dispatch);
  };
  const menuItems = [
    {
      id: 'support',
      title: 'Support',
      icon: SupportIcon,
      onPress: () => {
        navigation.navigate(ROUTES.STACK, { screen: ROUTES.SUPPORT });
      },
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: LightBulbIcon,
      onPress: () => {
        navigation.navigate(ROUTES.STACK, { screen: ROUTES.FAQ });
      },
    },
    {
      id: 'story',
      title: 'Your Story',
      icon: HeartIcon,
      onPress: () => {
        navigation.navigate(ROUTES.STACK, { screen: ROUTES.YOUR_STORY });
      },
    },
    {
      id: 'terms',
      title: 'Terms and Conditions',
      icon: TermsIcon,
      onPress: () => {
        navigation.navigate(ROUTES.STACK, {
          screen: ROUTES.TERMS_AND_CONDITIONS,
        });
      },
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: LockIcon,
      onPress: () => {
        navigation.navigate(ROUTES.STACK, { screen: ROUTES.PRIVACY_POLICY });
      },
    },
    {
      id: 'refund',
      title: 'Refund Policy',
      icon: RefundIcon,
      onPress: () => {
        navigation.navigate(ROUTES.STACK, { screen: ROUTES.REFUND_POLICY });
      },
    },
    {
      id: 'tips',
      title: 'Safety guidelines',
      icon: WarningIcon,
      onPress: () => {
        navigation.navigate(ROUTES.STACK, { screen: ROUTES.TIPS });
      },
    },
  ];

  return (
    <AppSafeView style={styles.container}>
      <AppHeader
        title="Help"
        rightButton={
          <AppButton
            title="Delete"
            onPress={() => deleteBottomSheetRef?.current?.expand()}
            buttonStyle={styles.deleteButton}
            textStyle={styles.deleteButtonText}
          />
        }
      />

      <View style={styles.content}>
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(item => {
            const IconComponent = item.icon;
            return (
              <Pressable
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <IconComponent
                    width={Sizes.fontSize20}
                    height={Sizes.fontSize20}
                    color={COLORS.black}
                  />
                  <AppText text={item.title} textStyle={styles.menuItemText} />
                </View>
                <RightArrowIcon />
              </Pressable>
            );
          })}
        </View>
        <View style={styles.contactContainer}>
          <AppText text="Contact Support" textStyle={[styles.contactText,{fontSize:Sizes.fontSize24}]} />
          <AppText
            text="We will be happy to assist you further"
            textStyle={styles.contactText}
          />
          <Image
            source={require('../assets/images/supportimage.png')}
            style={styles.contactImage}
          />
        </View>
      </View>
      <LogoutDialog
        isVisible={isDeleteDialogVisible}
        onDismiss={() => setIsDeleteDialogVisible(false)}
        onLogout={handleDeleteAccount}
        isDelete={true}
      />
      <DeleteBottomSheet
        bottomSheetRef={deleteBottomSheetRef}
        onReport={handleDelete}
        onPressYes={() => {
          setIsDeleteDialogVisible(true);
        }}
      />
    </AppSafeView>
  );
};

export default HelpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: Sizes.Size25,
    paddingVertical: Sizes.Size8,
    // width: Sizes.Size20,
  },
  deleteButtonText: {
    color: COLORS.red,
  },
  menuContainer: {
    gap: Sizes.Size4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizes.Size16,
    paddingHorizontal: Sizes.Size8,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.borderLight2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.Size16,
  },
  menuItemText: {
    fontSize: Sizes.fontSize16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  contactContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  contactText: {
    fontSize: Sizes.fontSize16,
    color: COLORS.black,
    fontWeight: '500',
    textAlign: 'center',
    width: '55%',
  },
  contactImage: {
    width: '100%',
    height: Sizes.Size50 * 4,
    resizeMode: 'contain',
  },
});
