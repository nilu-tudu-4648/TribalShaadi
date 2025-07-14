import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { fontSize24, Size12, Size8 } from '../constants/Sizes';
import { ArrowIosBackSvg } from './svg/SvgIcons';
import AppText from './AppText';
import { useNavigation } from '@react-navigation/native';

const AppHeader = ({
  title,
  onBackPress,
  rightButton,
}: {
  title: string;
  onBackPress?: () => void;
  rightButton?: React.ReactNode;
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.leftButton}>
        <TouchableOpacity onPress={onBackPress || navigation.goBack} style={styles.backButton}>
          <ArrowIosBackSvg />
        </TouchableOpacity>
        <AppText text={title} textStyle={styles.title} />
      </View>
      <View style={styles.rightButton}>{rightButton}</View>
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
    paddingHorizontal: Size12,

  },
  leftButton: {
    width: '60%',
    flexDirection: 'row',
    gap: Size8,
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
    width: '40%',
  },
});
