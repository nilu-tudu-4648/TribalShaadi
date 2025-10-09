import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS } from '../constants/AppColors';
import {
  Size18,
  Size4,
} from '../constants/Sizes';
import { ArrowIosBackSvg } from './svg/SvgIcons';
import { useNavigation } from '@react-navigation/native';


const HeaderBack = ({ onPress = () => {} }: { onPress?: () => void }) => {
  const navigation = useNavigation();
    return (
      <TouchableOpacity onPress={onPress || navigation.goBack()} style={styles.container}>
        <ArrowIosBackSvg />
      </TouchableOpacity>
    );
};

export default HeaderBack;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: Size18,
    width: Size18 * 2,
    height: Size18 * 2,
    padding: Size4,
  },
});
