import { StyleProp, View, ViewStyle } from 'react-native';
import React from 'react';
import { COLORS } from '../../constants/AppColors';
import AppText from '../AppText';
import { fontSize10, Size12, fontSize22 } from '../../constants/Sizes';

const NotifiNumberChip = ({
  number,
  style,
}: {
  number: number;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View
      style={[
        {
          position: 'absolute',
          bottom: 0,
          left: Size12,
          backgroundColor: COLORS.violet,
          borderRadius: fontSize22 / 2,
          width: fontSize22,
          height: fontSize22,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <AppText
        text={number.toString()}
        textStyle={{
          fontSize: fontSize10,
          color: COLORS.white,
        }}
      />
    </View>
  );
};

export default NotifiNumberChip;
