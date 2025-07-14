import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import React from 'react';
import { COLORS } from '../constants/AppColors';
import {
  fontSize12,
  fontSize18,
  fontSize24,
  Size2,
  Size12,
  Size16,
  Size20,
  Size25,
  lignHeight20,
  lignHeight32,
  lignHeight38,
  lignHeight43,
  lignHeight53,
  compPadding,
  fontSize20,
} from '../constants/Sizes';
import FONT_FAMILY from '../constants/Fonts';
import AppText from '../components/AppText';
import {
  UserProfileIcon,
  SlidersIcon,
  RightArrowIcon,
  EducationIcon,
  PersonalityIcon,
} from '../components/svg/SvgIcons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import AppSafeView from '../components/AppSafeView';
import { ROUTES } from '../constants/data';
import { useSelector } from 'react-redux';
import { imageUrl } from '../constants/functions';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const menuItems = [
    {
      id: 1,
      title: 'Personal Details',
      description:
        'Update your basic information that helps others understand who you are',
      icon: UserProfileIcon,
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
      icon: PersonalityIcon,
      onPress: () => {
        (navigation.navigate as any)(ROUTES.STACK, {
          screen: ROUTES.EDIT_PERSONALITY,
        });
      },
    },
  ];

  return (
    <AppSafeView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <AppHeader title="Edit Profile" />

        {/* Profile Images Section */}
        <View style={styles.profileImagesContainer}>
          <View style={styles.profileImageWrapper}>
            <View style={styles.profileImage}>
              <View style={styles.profileImagePlaceholder}>
                <Image
                  source={{ uri: imageUrl + user.image }}
                  style={styles.placeholderImage}
                  resizeMode="cover"
                />
              </View>
              {/* <View style={styles.profileImageBanner}>
                <AppText
                  text="Profile Image"
                  textStyle={styles.profileImageText}
                />
                <TouchableOpacity style={styles.editIconWrapper}>
                  <EditIcon width={16} height={16} color={COLORS.white} />
                </TouchableOpacity>
              </View> */}
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
            <Pressable
              onPress={item.onPress}
              key={item.id}
              style={styles.menuItem}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.iconContainer}>
                  <item.icon
                    width={lignHeight32}
                    height={lignHeight32}
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
            </Pressable>
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
  scrollContent: {
    gap: Size12,
    paddingBottom: Size20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: compPadding,
    paddingVertical: Size12,
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
    gap: Size25,
  },
  menuItem: {
    justifyContent: 'flex-start',
  },
  menuItemContent: {
    flexDirection: 'row',
    gap: Size20,
  },
  iconContainer: {
    width: lignHeight32,
    height: lignHeight32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    flex: 1,
    gap: Size2,
  },
  menuItemTitle: {
    fontSize: fontSize20,
    fontWeight: '700',
    color: COLORS.black,
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_SEMI_BOLD,
  },
  menuItemDescription: {
    fontSize: fontSize12,
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
