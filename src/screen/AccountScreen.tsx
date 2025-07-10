import { StyleSheet, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import AppText from '../components/AppText';
import { COLORS } from '../constants/AppColors';
import * as Sizes from '../constants/Sizes';
import { ROUTES } from '../constants/data';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
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
  SlidersIcon, 
  InfoIcon, 
  HeadphonesIcon, 
  SettingsIcon 
} from '../components/svg/SvgIcons';

const profileImage = require('../assets/images/Male.png'); // Placeholder image

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
  { key: 'selfie', label: 'Selfie\nverified', color: COLORS.primaryBlue, icon: SelfieVerifiedIcon },
  { key: 'govt', label: 'Govt. ID\nverified', color: COLORS.grey, icon: GovtIdIcon },
];

const actionButtons: ActionButton[] = [
  { key: 'plan', label: 'My Plan', icon: CrownIcon, route: ROUTES.UPGRADE },
  { key: 'invite', label: 'Invite', icon: GiftIcon },
  { key: 'preference', label: 'Preference', icon: SlidersIcon },
  { key: 'about', label: 'About Us', icon: InfoIcon },
  { key: 'help', label: 'Help', icon: HeadphonesIcon, route: ROUTES.HELP },
  { key: 'settings', label: 'Settings', icon: SettingsIcon, route: ROUTES.SETTINGS },
];

const AccountScreen = () => {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  return (
    <View style={styles.container}>
      {/* Profile Image with Edit Icon */}
      <View style={styles.profileContainer}>
        <Image source={profileImage} style={styles.profileImage} />
        <TouchableOpacity onPress={()=>{navigation.navigate(ROUTES.STACK, { screen: ROUTES.EDIT_PROFILE } as never)}} style={styles.editIcon}>
          <EditIcon width={Sizes.fontSize18} height={Sizes.fontSize18} />
        </TouchableOpacity>
      </View>
      {/* Name */}
      <AppText text={'Jane Doe'} textStyle={styles.name} />
      {/* Badges */}
      <View style={styles.badgesRow}>
        {badgeData.map(badge => {
          const IconComponent = badge.icon;
          return (
            <View key={badge.key} style={styles.badgeItem}>
              <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}> 
                <IconComponent width={Sizes.fontSize18} height={Sizes.fontSize18} color={COLORS.white} />
              </View>
              <AppText text={badge.label} textStyle={styles.badgeLabel} />
            </View>
          );
        })}
      </View>
      {/* Action Buttons */}
      <View style={styles.actionsGrid}>
        {actionButtons.map((btn) => {
          const IconComponent = btn.icon;
          return (
            <TouchableOpacity onPress={()=>{navigation.navigate(ROUTES.STACK, { screen: btn.route } as never)}} key={btn.key} style={styles.actionItem}>
              <View style={styles.actionIconCircle}>
                <IconComponent width={Sizes.fontSize24} height={Sizes.fontSize24} color={COLORS.textInactive} />
              </View>
              <AppText text={btn.label} textStyle={styles.actionLabel} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  )
}

export default AccountScreen

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
    borderRadius: 20,
    padding: Sizes.Size8,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  name: {
    fontSize: Sizes.fontSize28,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGrey,
    elevation: 2,
  },
  actionLabel: {
    fontSize: Sizes.fontSize16,
    color: COLORS.textInactive,
    textAlign: 'center',
  },
})