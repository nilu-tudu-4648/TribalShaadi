import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { fontSize24, Size12 } from '../constants/Sizes';
import { ArrowIosBackSvg } from './svg/SvgIcons';
import AppText from './AppText';


const AppHeader = ({ title, onBackPress }: { title: string, onBackPress?: () => void }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBackPress}
        style={styles.backButton}     
      >
        <ArrowIosBackSvg />
      </TouchableOpacity>
      <AppText text={title} textStyle={styles.title} />
      <View style={styles.rightButton} />
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Size12,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize24,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  rightButton: {
    width: '60%',
  },
});
