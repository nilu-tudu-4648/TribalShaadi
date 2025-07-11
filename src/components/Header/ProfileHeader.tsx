import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { BackIcon } from '../svg/SvgIcons';
import AppText from '../AppText';
import { fontSize24, Size18 } from '../../constants/Sizes';

const ProfileHeader = ({
  onBackPress,
  title,
  icon,
}: {
  onBackPress: () => void;
  title: string;
  icon: React.ReactNode;
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress}>
        <BackIcon />
      </TouchableOpacity>
      {icon}
      <AppText text={title} textStyle={styles.title} />
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    gap: Size18,
  },
  title: {
    fontSize: fontSize24,
    fontWeight: '700',
    lineHeight: fontSize24,
  },
});
