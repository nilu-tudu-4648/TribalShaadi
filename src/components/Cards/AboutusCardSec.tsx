import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import React from 'react';
import AppText from '../AppText';
import {
  fontSize16,
  fontSize32,
  Size12,
  Size16,
  Size20,
  Size25,
} from '../../constants/Sizes';
import { COLORS } from '../../constants/AppColors';

const AboutusCardSec = ({
  title,
  description,
  style,
  textStyle,
  titleStyle,
}: {
  title: string;
  description: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
}) => {
  return (
    <View style={[styles.container,style]}>
      <AppText text={title} textStyle={[styles.title,titleStyle]} />
      <AppText text={description} textStyle={[styles.description,textStyle]} />
    </View>
  );
};

export default AboutusCardSec;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightgrey,
    borderRadius: Size16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Size12,
    padding: Size20,
    paddingVertical: Size25,
  },
  title: {
    fontSize: fontSize32,
    fontWeight: 'bold',
  },
  description: {
    fontSize: fontSize16,
    textAlign: 'center',
    color: COLORS.aboutText,
    letterSpacing: 0.5,
  },
});
