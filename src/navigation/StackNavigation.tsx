import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SettingsScreen from '../screen/SettingsScreen';
import { ROUTES } from '../constants/data';

export type RootStackParamList = {
  [ROUTES.SETTINGS]: undefined;
};

const StackNavigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
