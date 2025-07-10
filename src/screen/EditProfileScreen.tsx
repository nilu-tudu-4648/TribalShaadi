import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import { COLORS } from '../constants/AppColors';
import {
  fontSize12,
  fontSize14,
  fontSize18,
  fontSize24,
  Size2,
  Size12,
  Size16,
  Size20,
  Size25,
  lignHeight20,
  lignHeight24,
  lignHeight32,
  lignHeight38,
  lignHeight43,
  lignHeight53,
  compPadding,
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import AppText from '../components/AppText';
import {
  AccountIcon,
  SlidersIcon,
  SettingsIcon,
  RightArrowIcon,
  EditIcon,
} from '../components/svg/SvgIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import AppSafeView from '../components/AppSafeView';
import { ROUTES } from '../constants/data';

// Custom Education Icon
const EducationIcon = ({ width = 24, height = 24, color = COLORS.black }) => (
  <View
    style={{ width, height, alignItems: 'center', justifyContent: 'center' }}
  >
    <Text style={{ fontSize: 20, color }}>🎓</Text>
  </View>
);

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const menuItems = [
    {
      id: 1,
      title: 'Personal Details',
      description:
        'Update your basic information that helps others understand who you are',
      icon: AccountIcon,
      onPress: () => {
        (navigation.navigate as any)(ROUTES.STACK, {
          screen: ROUTES.EDIT_PERSONAL,
        });
      },
    },
    {
      id: 2,
      title: 'Lifestyle & Location',
      description: 'Define your lifestyle choices and where you are based',
      icon: SlidersIcon,
      onPress: () => {
        (navigation.navigate as any)(ROUTES.STACK, {
          screen: ROUTES.EDIT_LIFE,
        });
      },
    },
    {
      id: 3,
      title: 'Education & Career',
      description: 'Showcase your academic background and professional journey',
      icon: EducationIcon,
      onPress: () => {
        (navigation.navigate as any)(ROUTES.STACK, {
          screen: ROUTES.EDIT_EDUCATION,
        });
      },
    },
    {
      id: 4,
      title: 'Personality & Preferences',
      description:
        'Share more about yourself, your values, and what you seek in a life partner',
      icon: SettingsIcon,
      onPress: () => {
        (navigation.navigate as any)(ROUTES.STACK, {
          screen: ROUTES.EDIT_PERSONALITY,
        });
      },
    },
  ];

  return (
    <AppSafeView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <AppHeader title="Edit Profile" />

        {/* Profile Images Section */}
        <View style={styles.profileImagesContainer}>
          <View style={styles.profileImageWrapper}>
            <View style={styles.profileImage}>
              <View style={styles.profileImagePlaceholder}>
                <Image
                  source={require('../assets/images/Female.png')}
                  style={styles.placeholderImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.profileImageBanner}>
                <AppText
                  text="Profile Image"
                  textStyle={styles.profileImageText}
                />
                <TouchableOpacity style={styles.editIconWrapper}>
                  <EditIcon width={16} height={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.profileImage}>
            <View style={styles.profileImagePlaceholder}>
              <Image
                source={require('../assets/images/Female (1).png')}
                style={styles.placeholderImage}
                resizeMode="cover"
              />
            </View>
          </View>

          <View style={styles.profileImage}>
            <View style={styles.profileImagePlaceholder}>
              <Image
                source={require('../assets/images/Female.png')}
                style={styles.placeholderImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.iconContainer}>
                  <item.icon
                    width={lignHeight24}
                    height={lignHeight24}
                    color={COLORS.black}
                  />
                </View>
                <View style={styles.menuItemText}>
                  <AppText text={item.title} textStyle={styles.menuItemTitle} />
                  <AppText
                    text={item.description}
                    textStyle={styles.menuItemDescription}
                  />
                </View>
                <View style={styles.arrowContainer}>
                  <RightArrowIcon />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </AppSafeView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: compPadding,
    paddingVertical: Size12,
    marginBottom: Size20,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: lignHeight38,
    height: lignHeight38,
  },
  headerTitle: {
    fontSize: fontSize24,
    fontWeight: '800',
    fontStyle: 'italic',
    color: COLORS.black,
  },
  rightSpace: {
    width: lignHeight38,
  },
  profileImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: compPadding,
    marginBottom: lignHeight43,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: lignHeight53 * 2,
    height: lignHeight53 * 2.2,
    borderRadius: Size16,
    overflow: 'hidden',
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.borderLight,
    borderRadius: Size16,
    overflow: 'hidden',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
  },
  profileImageBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.violet,
    paddingVertical: Size12,
    paddingHorizontal: Size12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopLeftRadius: Size16,
    borderTopRightRadius: Size16,
  },
  profileImageText: {
    color: COLORS.white,
    fontSize: fontSize12,
    fontWeight: '600',
  },
  editIconWrapper: {
    width: lignHeight20,
    height: lignHeight20,
    borderRadius: lignHeight20 / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: {
    paddingHorizontal: compPadding,
  },
  menuItem: {
    marginBottom: Size25,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: lignHeight32,
    height: lignHeight32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Size20,
  },
  menuItemText: {
    flex: 1,
    marginRight: Size16,
  },
  menuItemTitle: {
    fontSize: fontSize18,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: Size2,
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_SEMI_BOLD,
  },
  menuItemDescription: {
    fontSize: fontSize14,
    color: COLORS.textSecondary,
    lineHeight: fontSize18,
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_REGULAR,
    fontWeight: '400',
  },
  arrowContainer: {
    width: lignHeight20,
    height: lignHeight20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
