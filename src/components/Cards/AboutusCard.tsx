import { StyleSheet, View } from 'react-native';
import React from 'react';
import AppText from '../AppText';
import { fontSize14, fontSize20, Size12, Size16, Size25 } from '../../constants/Sizes';
import { COLORS } from '../../constants/AppColors';

const AboutusCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <View style={styles.container}>
      <AppText text={title} textStyle={styles.title} />
      <AppText text={description} textStyle={styles.description} />
    </View>
  );
};

export default AboutusCard;

const styles = StyleSheet.create({
  container: {
        backgroundColor: COLORS.lightgrey,
    borderRadius: Size16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Size12,
    padding: Size25,
  },
  title: {
    fontSize: fontSize20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: fontSize14,
    textAlign: 'center',
    color: COLORS.aboutText,
    letterSpacing: 0.8,
  },
});
