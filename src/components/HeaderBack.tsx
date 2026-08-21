import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { COLORS } from '../constants/AppColors';
import {
  fontSize16,
  Size18,
  Size4,
} from '../constants/Sizes';
import { ArrowIosBackSvg } from './svg/SvgIcons';
import { useNavigation } from '@react-navigation/native';


const HeaderBack = ({
  onPress = () => {},
  onSkip,
  progress,
}: {
  onPress?: () => void;
  onSkip?: () => void;
  progress?: number;
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={onPress || navigation.goBack()}
        style={styles.container}
      >
        <ArrowIosBackSvg />
      </TouchableOpacity>
      {progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
      )}
      {onSkip ? (
        <TouchableOpacity onPress={onSkip} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default HeaderBack;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
  skipText: {
    fontSize: fontSize16,
    fontWeight: '600',
    color: COLORS.primaryBlue,
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginLeft: 16,
    marginRight: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1F2937',
    borderRadius: 2,
  },
});
