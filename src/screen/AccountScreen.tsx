import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
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
  GovtIdIcon,
  GiftIcon,
  InfoIcon,
  HeadphonesIcon,
  SettingsIcon,
  RocketIcon,
} from '../components/svg/SvgIcons';
import { useSelector } from 'react-redux';
import { imageUrl } from '../constants/functions';
import { PreferenceIcon } from '../components/svg/SvgIcons2';

type AccountScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList, typeof ROUTES.ACCOUNT>,
  NativeStackNavigationProp<StackNavigationParamList>
>;

type BadgeData = {
  key: string;
  label: string;
  color: string;
  icon: React.ComponentType<any>;
};

type ActionButton = {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  route?: string;
};

const badgeData: BadgeData[] = [
  { key: 'crown', label: 'Crown\nbadge', color: '#FFD600', icon: CrownIcon },
  {
    key: 'selfie',
    label: 'Selfie\nverified',
    color: COLORS.primaryBlue,
    icon: SelfieVerifiedIcon,
  },
  {
    key: 'govt',
    label: 'Govt. ID\nverified',
    color: COLORS.grey,
    icon: GovtIdIcon,
  },
];

const actionButtons: ActionButton[] = [
  { key: 'plan', label: 'My Plan', icon: RocketIcon, route: ROUTES.UPGRADE },
  { key: 'invite', label: 'Invite', icon: GiftIcon, route: ROUTES.INVITE },
  { key: 'preference', label: 'Preference', icon: PreferenceIcon, route: ROUTES.PREFERENCE },
  { key: 'about', label: 'About Us', icon: InfoIcon, route: ROUTES.ABOUT_US },
  { key: 'help', label: 'Help', icon: HeadphonesIcon, route: ROUTES.HELP },
  {
    key: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    route: ROUTES.SETTINGS,
  },
];

const AccountScreen = () => {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const fullName = `${user?.firstName} ${user?.lastName}`.trim();
  return (
    <View style={styles.container}>
      {/* Profile Image with Edit Icon */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: imageUrl + user?.image }}
          style={styles.profileImage}
        />
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
      <AppText
        text={fullName}
        textStyle={styles.name}
      />
      {/* Badges */}
      <View style={styles.badgesRow}>
        {badgeData.map(badge => {
          const IconComponent = badge.icon;
          return (
            <View key={badge.key} style={styles.badgeItem}>
              <View
                style={[styles.badgeIcon, { backgroundColor: badge.color }]}
              >
                <IconComponent
                  width={Sizes.fontSize18}
                  height={Sizes.fontSize18}
                />
              </View>
              <AppText text={badge.label} textStyle={styles.badgeLabel} />
            </View>
          );
        })}
      </View>
      {/* Action Buttons */}
      <View style={styles.actionsGrid}>
        {actionButtons.map(btn => {
          const IconComponent = btn.icon;
          return (
            <TouchableOpacity
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
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
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
});
