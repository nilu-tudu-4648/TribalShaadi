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
    </Stack.Navigator>
  );
};

export default StackNavigation;
