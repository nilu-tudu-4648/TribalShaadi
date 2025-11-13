import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useRef, useEffect } from 'react';
import AppText from '../components/AppText';
import { COLORS } from '../constants/AppColors';
import * as Sizes from '../constants/Sizes';
import { ROUTES } from '../constants/data';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { RootStackParamList as StackNavigationParamList } from '../navigation/StackNavigation';
import {
  EditIcon,
  CrownIcon,
  SelfieVerifiedIcon,
  GiftIcon,
  InfoIcon,
  HeadphonesIcon,
  SettingsIcon,
  RocketIcon,
  GovtIdIcon,
  HeartIcon,
} from '../components/svg/SvgIcons';
import { useDispatch, useSelector } from 'react-redux';
import { baseUrl, delay, imageUrl } from '../constants/functions';
import { PreferenceIcon } from '../components/svg/SvgIcons2';
import Loader from '../components/loader/Loader';
import ProfileBottomSheet from '../components/BottomSheets/ProfileBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  getCurrentMatchedUserGalleryImageListApi,
  getSelectedUserApi,
  getSelectedUserPackageApi,
} from '../store/reducers/userReducer';
import {
  getGalleryImageListUrl,
  getPackageByUserIdUrl,
  getSelectedUserUrl,
} from '../constants/functions';
import DeviceInfo from 'react-native-device-info';

type AccountScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList, typeof ROUTES.ACCOUNT>,
  NativeStackNavigationProp<StackNavigationParamList>
>;

type BadgeData = {
  key: string;
  label: string;
  color: string;
  icon: React.ComponentType<any>;
  route?: string;
};

type ActionButton = {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  route?: string;
};

const AccountScreen = () => {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  const { user, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const fullName = `${user?.firstName} ${user?.lastName || ''}`.trim();
  const { packageByUserId } = useSelector(
    (state: any) => state.entities.paymentReducer,
  );
  const handleCardPress = async (id: string) => {
    try {
      dispatch(getSelectedUserApi(`${baseUrl}/${getSelectedUserUrl}?id=${id}`));
      dispatch(
        getSelectedUserPackageApi(`${baseUrl}/${getPackageByUserIdUrl}`, {
          userId: id,
        }),
      );
      dispatch(
        getCurrentMatchedUserGalleryImageListApi(
          `${baseUrl}/${getGalleryImageListUrl}`,
          {
            userId: id,
          },
        ),
      );
      await delay();
      profileBottomSheetRef.current?.snapToIndex(0); // Open the bottom sheet at 50%
    } catch (error) {
      console.log(error, 'error');
    }
  };
  const dispatch = useDispatch();
  const profileBottomSheetRef = useRef<BottomSheet>(null);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      profileBottomSheetRef.current?.close();
    });

    return unsubscribe;
  }, [navigation]);
  const badgeData: BadgeData[] = [
    {
      key: 'crown',
      label: 'Crown\nbadge',
      color: packageByUserId && packageByUserId.length > 0 || user.gender === "Female" ? '#FFD600' : COLORS.grey,
      icon: CrownIcon,
      route: ROUTES.UPGRADE,
    },
    {
      key: 'selfie',
      label: 'Selfie\nverified',
      color: user && user.isVerified ? COLORS.primaryBlue : COLORS.grey,
      icon: SelfieVerifiedIcon,
      route: user && !user.isVerified ? ROUTES.SELFIE_VERIFY : undefined,
    },
    {
      key: 'govt',
      label: 'Govt. ID\nverified',
      color: COLORS.grey,
      icon: GovtIdIcon,
    },
  ];
  const actionButtons: ActionButton[] = [
    {
      key: 'plan',
      label: packageByUserId.length > 0 || user.gender === "Female" ? 'My Plan' : 'Upgrade',
      icon: RocketIcon,
      route: ROUTES.UPGRADE,
    },
    { key: 'invite', label: 'Invite', icon: GiftIcon, route: ROUTES.INVITE },
    {
      key: 'preference',
      label: 'Preference',
      icon: PreferenceIcon,
      route: ROUTES.PREFERENCE,
    },
    { key: 'about', label: 'About Us', icon: InfoIcon, route: ROUTES.ABOUT_US },
    { key: 'help', label: 'Help', icon: HeadphonesIcon, route: ROUTES.HELP },
    {
      key: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      route: ROUTES.SETTINGS,
    },
  ];

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <View style={styles.container}>
          {/* Profile Image with Edit Icon */}
          <View style={styles.profileContainer}>
            <TouchableOpacity
              onPress={() => {
                handleCardPress(user.id);
              }}
            >
              <Image
                source={{ uri: imageUrl + user?.image }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(ROUTES.STACK, {
                  screen: ROUTES.EDIT_PROFILE,
                } as never);
              }}
              style={styles.editIcon}
            >
              <EditIcon width={Sizes.fontSize18} height={Sizes.fontSize18} />
            </TouchableOpacity>
          </View>
          {/* Name */}
          <AppText text={fullName} textStyle={styles.name} />
          {/* Badges */}
          <View style={styles.badgesRow}>
            {badgeData.map(badge => {
              const IconComponent = badge.icon;
              return (
                <Pressable
                  key={badge.key}
                  style={styles.badgeItem}
                  onPress={() => {
                    navigation.navigate(ROUTES.STACK, {
                      screen: badge.route,
                    } as never);
                  }}
                  disabled={!badge.route}
                >
                  <View
                    style={[styles.badgeIcon, { backgroundColor: badge.color }]}
                  >
                    <IconComponent
                      width={Sizes.fontSize18}
                      height={Sizes.fontSize18}
                    />
                  </View>
                  <AppText text={badge.label} textStyle={styles.badgeLabel} />
                </Pressable>
              );
            })}
          </View>
          {/* Action Buttons */}
          <View style={styles.actionsGrid}>
            {actionButtons.map(btn => {
              const IconComponent = btn.icon;
              return (
                <Pressable
                  onPress={() => {
                    navigation.navigate(ROUTES.STACK, {
                      screen: btn.route,
                    } as never);
                  }}
                  key={btn.key}
                  style={styles.actionItem}
                >
                  <View style={styles.actionIconCircle}>
                    <IconComponent
                      width={Sizes.fontSize24}
                      height={Sizes.fontSize24}
                    />
                  </View>
                  <AppText text={btn.label} textStyle={styles.actionLabel} />
                </Pressable>
              );
            })}
          </View>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/newlogo.png')} style={styles.logo} />
            <AppText text={`Version ${DeviceInfo.getVersion()}`} textStyle={styles.logoutText} />
            <View style={styles.madeWithContainer}>
              <AppText text="Made with" textStyle={styles.logoutText} />
              <HeartIcon color={COLORS.greyText3} width={Sizes.Size20*.7} height={Sizes.Size20} />
              <AppText text="in Jharkhand" textStyle={styles.logoutText} />
            </View>
          </View>
        </View>
      )}
      <ProfileBottomSheet
        bottomSheetRef={profileBottomSheetRef}
        isButtonVisible={false}
        user={user}
        currentUserPackage={packageByUserId}
        report={false}
      />
    </>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingTop: Sizes.Size20,
    gap: Sizes.Size16,
  },
  profileContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizes.Size8,
    paddingTop: Sizes.Size20 * 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    right: -5,
    bottom: 0,
    backgroundColor: COLORS.white,
    borderRadius: Sizes.Size20,
    padding: Sizes.Size8,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  name: {
    fontSize: Sizes.fontSize24,
    fontWeight: '600',
    paddingTop: Sizes.Size10,
    paddingBottom: Sizes.Size8,
    textAlign: 'center',
    color: COLORS.textPrimary,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Sizes.Size16,
    paddingBottom: Sizes.Size20,
  },
  badgeItem: {
    alignItems: 'center',
    gap: Sizes.Size4,
  },
  badgeIcon: {
    width: Sizes.Size40,
    height: Sizes.Size40,
    borderRadius: Sizes.Size20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.borderGrey,
    overflow: 'hidden',
  },
  badgeLabel: {
    fontSize: Sizes.fontSize12,
    color: COLORS.textBlack,
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Sizes.Size10,
    width: '90%',
    paddingTop: Sizes.Size10,
  },
  actionItem: {
    width: '30%',
    alignItems: 'center',
    gap: Sizes.Size4,
    paddingVertical: Sizes.Size10,
  },
  actionIconCircle: {
    width: Sizes.Size50,
    height: Sizes.Size50,
    borderRadius: Sizes.Size25,
    padding: Sizes.Size18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderWidth: 0.1,
    borderColor: COLORS.borderGrey,
  },
  actionLabel: {
    fontSize: Sizes.fontSize16,
    color: COLORS.greytext,
    textAlign: 'center',
  },
  logoContainer: {
    position: 'absolute',
    paddingVertical: Sizes.Size10,
    paddingHorizontal: Sizes.Size20,
    borderRadius: Sizes.Size10,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: Sizes.Size20,
  },
  logoutText: {
    fontSize: Sizes.fontSize12,
    color: COLORS.greyText3,
  },
  madeWithContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizes.Size4,
  },
  logo: {
    width: "100%",
    height: Sizes.Size50/2,
    resizeMode: 'contain',
    bottom: Sizes.Size10,
  },
});
