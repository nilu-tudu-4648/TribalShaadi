import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SettingsScreen from '../screen/SettingsScreen';
import { ROUTES } from '../constants/data';
import UpgradeScreen from '../screen/UpgradeScreen';
import EditProfileScreen from '../screen/EditProfileScreen';
import EditPersonalScreen from '../screen/EditPersonalScreen';
import EditLifeScreen from '../screen/EditLifeScreen';
import EditEducationScreen from '../screen/EditEducationScreen';
import EditPersonalityScreen from '../screen/EditPersonalityScreen';
import HelpScreen from '../screen/HelpScreen';
import PreferenceScreen from '../screen/PreferenceScreen';
import PaymentConfirmation from '../screen/PaymentConfirmation';
import AboutUsScreen from '../screen/AboutUsScreen';
import InviteScreen from '../screen/InviteScreen';
import ConversationsScreen from '../screen/ConversationsScreen';
import MathcingScreen from '../screen/MathcingScreen';
import SelfieVerifyScreen from '../screen/SelfieVerifyScreen';
import CameraScreen from '../screen/CameraScreen';
import PaymentSuccess from '../screen/PaymentSuccess';
import YourStoryScreen from '../screen/YourStoryScreen';
import SupportScreen from '../screen/SupportScreen';
import FAQScreen from '../screen/FAQScreen';
import TermScreen from '../screen/TermScreen';
import PrivacyScreen from '../screen/PrivacyScreen';
import RefundScreen from '../screen/RefundScreen';
import TipsScreen from '../screen/TipsScreen';
import JustPayScreen from '../screen/JustPayScreen';
export type RootStackParamList = {
  [ROUTES.SETTINGS]: undefined;
};

const StackNavigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
      <Stack.Screen name={ROUTES.UPGRADE} component={UpgradeScreen} />
      <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfileScreen} />
      <Stack.Screen name={ROUTES.EDIT_PERSONAL} component={EditPersonalScreen} />
      <Stack.Screen name={ROUTES.EDIT_LIFE} component={EditLifeScreen} />
      <Stack.Screen name={ROUTES.EDIT_EDUCATION} component={EditEducationScreen} />
      <Stack.Screen name={ROUTES.EDIT_PERSONALITY} component={EditPersonalityScreen} />
      <Stack.Screen name={ROUTES.HELP} component={HelpScreen} />
      <Stack.Screen name={ROUTES.PREFERENCE} component={PreferenceScreen} />    
      <Stack.Screen name={ROUTES.PAYMENT_CONFIRMATION} component={PaymentConfirmation} />
      <Stack.Screen name={ROUTES.ABOUT_US} component={AboutUsScreen} />
      <Stack.Screen name={ROUTES.INVITE} component={InviteScreen} />
      <Stack.Screen name={ROUTES.CONVERSATIONS} component={ConversationsScreen} />
      <Stack.Screen name={ROUTES.MATCHING} component={MathcingScreen} />
      <Stack.Screen name={ROUTES.SELFIE_VERIFY} component={SelfieVerifyScreen} />
      <Stack.Screen name={ROUTES.CAMERA} component={CameraScreen} />
      <Stack.Screen name={ROUTES.PAYMENT_SUCCESS} component={PaymentSuccess} />
      <Stack.Screen name={ROUTES.YOUR_STORY} component={YourStoryScreen} />
      <Stack.Screen name={ROUTES.SUPPORT} component={SupportScreen} />
      <Stack.Screen name={ROUTES.FAQ} component={FAQScreen} />
      <Stack.Screen name={ROUTES.TERMS_AND_CONDITIONS} component={TermScreen} />
      <Stack.Screen name={ROUTES.PRIVACY_POLICY} component={PrivacyScreen} />
      <Stack.Screen name={ROUTES.REFUND_POLICY} component={RefundScreen} />
      <Stack.Screen name={ROUTES.TIPS} component={TipsScreen} />
      <Stack.Screen name={ROUTES.JUST_PAY} component={JustPayScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
