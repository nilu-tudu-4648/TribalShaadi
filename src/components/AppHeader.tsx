import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import { fontSize24, Size10, Size12, Size8 } from '../constants/Sizes';
import { ArrowIosBackSvg } from './svg/SvgIcons';
import AppText from './AppText';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/AppColors';

const AppHeader = ({
  title,
  onBackPress,
  rightButton,
  style,
  titleStyle,
  arrowColor = COLORS.black,
  leftButtonStyle,
}: {
  title: string;
  onBackPress?: () => void;
  rightButton?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  arrowColor?: string;
  leftButtonStyle?: StyleProp<ViewStyle>;
}) => {
  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.container,
        { paddingRight: rightButton ? Size10 : 0 },
        style,
      ]}
    >
      <View style={[styles.leftButton, leftButtonStyle]}>
        <Pressable
          onPress={onBackPress || navigation.goBack}
          style={styles.backButton}
        >
          <ArrowIosBackSvg color={arrowColor} />
        </Pressable>
        <AppText text={title} textStyle={[styles.title, titleStyle]} />
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
