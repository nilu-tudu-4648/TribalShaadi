import { StyleSheet, View, Modal, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import AppText from '../AppText';
import AppButton from '../AppButton';
import { COLORS } from '../../constants/AppColors';
import { fontSize20, SIZES } from '../../constants/Sizes';

const { width } = Dimensions.get('window');

const LogoutDialog = ({
  isVisible,
  onDismiss,
  onLogout,
  isDelete = false,
}: {
  isVisible: boolean;
  onDismiss: () => void;
  onLogout: () => void;
  isDelete?: boolean;
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onDismiss}
      >
        <TouchableOpacity activeOpacity={1} style={styles.dialogContainer}>
          <View style={styles.dialog}>
            <AppText text={isDelete ? "Delete" : "Logout"} textStyle={styles.title} />
            <AppText text={`Do you really want to ${isDelete ? "delete your profile?" : "logout?"}`} textStyle={styles.message} />
            <View style={styles.buttonContainer}>
              <AppButton 
                title="No" 
                onPress={onDismiss} 
                textStyle={styles.noButton}
                buttonStyle={styles.cancelButton}
              />
              <AppButton 
                title="Yes" 
                onPress={onLogout} 
                textStyle={styles.yesButton}
                buttonStyle={styles.confirmButton}
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default LogoutDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  dialog: {
    gap: SIZES.base2,
    backgroundColor: COLORS.white,
    padding: SIZES.padding2,
    borderRadius: SIZES.radius,
    width: width * 0.8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: fontSize20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: COLORS.white,
    width: '20%',
  },
  confirmButton: {
    width: '20%',
    backgroundColor: COLORS.white,
  },
  noButton: {
    color: COLORS.red,
  },
  yesButton: {
    color: COLORS.red,
  },
});
