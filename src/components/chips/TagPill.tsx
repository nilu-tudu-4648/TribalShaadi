import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import AppText from '../AppText';
import {
  fontSize16,
  fontWeight500,
  Size14,
  Size4,
  Size8,
} from '../../constants/Sizes';
import { COLORS } from '../../constants/AppColors';
import FONT_FAMILY from '../../constants/Fonts';

const TagPill = ({ icon, label, containerStyle }: { icon: any; label: string, containerStyle?: ViewStyle }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <AppText text={label} textStyle={styles.label} numberOfLines={1} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '100%',
    paddingHorizontal: Size14,
    paddingVertical: Size8,
    borderRadius: Size14,
    backgroundColor: COLORS.chipBg,
    gap: Size4,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    flexShrink: 1,
    fontSize: fontSize16,
    color: COLORS.navBarInactive,
    fontWeight: fontWeight500,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_MEDIUM,
  },
});

export default TagPill;
