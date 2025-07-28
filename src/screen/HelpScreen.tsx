import { StyleSheet, View, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import AppSafeView from '../components/AppSafeView';
import AppHeader from '../components/AppHeader';
import AppText from '../components/AppText';
import { COLORS } from '../constants/AppColors';
import * as Sizes from '../constants/Sizes';
import {
  LightBulbIcon,
  RightArrowIcon,
} from '../components/svg/SvgIcons';

import { ROUTES } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import { ChatBubbleIcon, EmailIcon, HeartIcon, LockIcon, MessageIcon, RefundIcon, SupportIcon, TermsIcon, WarningIcon } from '../components/svg/SvgIcons2';


const HelpScreen = () => {
  const navigation = useNavigation<any>();
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
      title: 'Tips',
      icon: WarningIcon,
      onPress: () => {
        navigation.navigate(ROUTES.STACK, { screen: ROUTES.TIPS });
      },
    },
  ];

  const contactOptions = [
    {
      id: 'call',
      title: 'Call Support',
      icon: ChatBubbleIcon,
      iconColor: COLORS.violet,
      onPress: () => Linking.openURL('tel:+91 92341 90205'),
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Support',
      icon: MessageIcon,
      iconColor: '#25D366',
      onPress: () => Linking.openURL('https://wa.me/919234190205'),
    },
    {
      id: 'email',
      title: 'Email Support',
      icon: EmailIcon,
      iconColor: '#3B82F6',
      onPress: () => Linking.openURL('mailto:dummy@tribalshaadi.com'),
    },
  ];

  return (
    <AppSafeView style={styles.container}>
      <AppHeader title="Help" />

      <View style={styles.content}>
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map(item => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
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
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Contact Options */}
        <View style={styles.contactContainer}>
          {contactOptions.map(option => {
            const IconComponent = option.icon;
            return (
              <TouchableOpacity
                key={option.id}
                style={styles.contactOption}
                onPress={option.onPress}
              >
                <View
                  style={[
                    styles.contactIconContainer,
                  ]}
                >
                  <IconComponent
                    width={Sizes.fontSize16}
                    height={Sizes.fontSize16}
                    color={COLORS.white}
                  />
                </View>
                <AppText text={option.title} textStyle={styles.contactText} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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
    paddingTop: Sizes.Size20,
    justifyContent: 'space-between',
  },
  menuContainer: {
    flex: 1,
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
    fontSize: Sizes.fontSize18,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  contactContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.Size8,
    paddingBottom: Sizes.Size20,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: Sizes.Size12,
    paddingHorizontal: Sizes.Size16,
    gap: Sizes.Size12,
  },
  contactIconContainer: {
    width: Sizes.fontSize24,
    height: Sizes.fontSize24,
    borderRadius: Sizes.fontSize12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: {
    fontSize: Sizes.fontSize16,
    color: COLORS.black,
    fontWeight: '600',
  },
});
