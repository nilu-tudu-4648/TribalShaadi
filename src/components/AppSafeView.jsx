import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../constants/AppColors';
import { SIZES } from '../constants/Sizes';
const AppSafeView = ({ children, style }) => {
  const theme = 'light';

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          {
            flex: 1,
            backgroundColor:
              theme == 'light' ? COLORS.white : theme == 'dark' && COLORS.black,
            padding: SIZES.padding,
          },
          style,
        ]}
      >
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AppSafeView;
