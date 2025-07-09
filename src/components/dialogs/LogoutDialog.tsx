import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Dialog, PanningProvider } from 'react-native-ui-lib';
import AppText from '../AppText';
import AppButton from '../AppButton';
import { COLORS } from '../../constants/AppColors';
import { fontSize20, SIZES } from '../../constants/Sizes';

const LogoutDialog = ({
  isVisible,
  onDismiss,
  onLogout,
}: {
  isVisible: boolean;
  onDismiss: () => void;
  onLogout: () => void;
}) => {
  return (
    <Dialog
      visible={isVisible}
      onDismiss={onDismiss}
      panDirection={PanningProvider.Directions.DOWN}
    >
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: SIZES.padding2,
          borderRadius: SIZES.radius,
        }}
      >
        <AppText text="Logout" textStyle={styles.title} />
        <AppText text="Do you really want to logout?" />
        <View style={styles.buttonContainer}>
          <AppButton title="No" onPress={onDismiss} textStyle={styles.noButton} />
          <AppButton title="Yes" onPress={onLogout} textStyle={styles.yesButton} />
        </View>
      </View>
    </Dialog>
  );
};

export default LogoutDialog;

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    width: '20%',
  },
  noButton: {
    color: COLORS.red,
  },
  yesButton: {
    color: COLORS.red,
  },
});
