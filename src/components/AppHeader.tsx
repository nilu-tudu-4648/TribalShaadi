import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { fontSize24, Size12 } from '../constants/Sizes';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowIosBackSvg } from './svg/SvgIcons';
import AppText from './AppText';
import { ROUTES } from '../constants/data';
import { RootStackParamList } from '../../App';
import { RootStackParamList as StackNavigationParamList } from '../navigation/StackNavigation';
type AppHeaderNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList, typeof ROUTES.MAIN_TABS>,
  NativeStackNavigationProp<StackNavigationParamList>
>;

const AppHeader = ({ title }: { title: string }) => {
  const navigation = useNavigation<AppHeaderNavigationProp>();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate(ROUTES.MAIN_TABS)}
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
