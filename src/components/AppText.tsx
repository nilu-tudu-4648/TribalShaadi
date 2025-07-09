import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import React from 'react';
import { fontSize16 } from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import FONT_FAMILY from '../constants/Fonts';

const AppText = ({
  text,
  textStyle,
}: {
  text: string;
  textStyle?: StyleProp<TextStyle>;
}) => {
  return <Text style={[styles.text, textStyle]}>{text}</Text>;
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    fontSize: fontSize16,
    color: COLORS.black,
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_SEMI_BOLD,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
});