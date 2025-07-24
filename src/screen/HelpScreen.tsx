import { StyleSheet, View, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import AppSafeView from '../components/AppSafeView';
import AppHeader from '../components/AppHeader';
import AppText from '../components/AppText';
import { COLORS } from '../constants/AppColors';
import * as Sizes from '../constants/Sizes';
import {
  HeadphonesIcon,
  LightBulbIcon,
  RightArrowIcon,
  PhoneSvg,
} from '../components/svg/SvgIcons';

import { Svg, Path, Circle, Rect, Line, Polyline } from 'react-native-svg';
import { ROUTES } from '../constants/data';
import { useNavigation } from '@react-navigation/native';

// Additional SVG Icons for the menu items
const FAQIcon = ({ width = 24, height = 24, color = COLORS.black }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path
      d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path d="M12 17h.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const HeartIcon = ({ width = 24, height = 24, color = COLORS.black }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={color}
    />
  </Svg>
);

const DocumentIcon = ({ width = 24, height = 24, color = COLORS.black }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Polyline
      points="14,2 14,8 20,8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="16"
      y1="13"
      x2="8"
      y2="13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="16"
      y1="17"
      x2="8"
      y2="17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const LockIcon = ({ width = 24, height = 24, color = COLORS.black }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="11"
      width="18"
      height="11"
      rx="2"
      ry="2"
      stroke={color}
      strokeWidth="2"
    />
    <Circle cx="12" cy="16" r="1" fill={color} />
    <Path
      d="M7 11V7a5 5 0 0 1 10 0v4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const RefundIcon = ({ width = 24, height = 24, color = COLORS.black }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="12"
      y1="9"
      x2="12"
      y2="13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Line
      x1="12"
      y1="17"
      x2="12.01"
      y2="17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const WhatsAppIcon = ({ width = 24, height = 24, color = COLORS.white }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.473 3.488"
      fill={color}
    />
  </Svg>
);

const EmailIcon = ({ width = 24, height = 24, color = COLORS.white }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      fill={color}
    />
    <Path
      d="M22 6L12 13L2 6"
      stroke={color === COLORS.white ? '#333' : COLORS.white}
      strokeWidth="1.5"
    />
  </Svg>
);

const HelpScreen = () => {
  const navigation = useNavigation<any>();
  const menuItems = [
    {
      id: 'support',
      title: 'Support',
      icon: HeadphonesIcon,
      onPress: () => {
        navigation.navigate(ROUTES.STACK, { screen: ROUTES.SUPPORT });
      },
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: FAQIcon,
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
      icon: DocumentIcon,
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
      icon: LightBulbIcon,
      onPress: () => {
        navigation.navigate(ROUTES.STACK, { screen: ROUTES.TIPS });
      },
    },
  ];

  const contactOptions = [
    {
      id: 'call',
      title: 'Call Support',
      icon: PhoneSvg,
      iconColor: COLORS.violet,
      onPress: () => Linking.openURL('tel:+1234567890'),
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Support',
      icon: WhatsAppIcon,
      iconColor: '#25D366',
      onPress: () => Linking.openURL('https://wa.me/1234567890'),
    },
    {
      id: 'email',
      title: 'Email Support',
      icon: EmailIcon,
      iconColor: '#3B82F6',
      onPress: () => Linking.openURL('mailto:support@example.com'),
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
                    { backgroundColor: option.iconColor },
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
    paddingHorizontal: Sizes.Size16,
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
    flexDirection: 'column',
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
