import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import React from 'react';
import AppText from '../AppText';
import AppButton from '../AppButton';
import { COLORS } from '../../constants/AppColors';
import { fontSize14, fontSize16, fontSize20, SIZES } from '../../constants/Sizes';

const { width } = Dimensions.get('window');

const BULLET_ITEMS = [
  'New matches',
  'Messages',
  'Received/Accepted Interests',
];

const NotificationEnableDialog = ({
  isVisible,
  onDismiss,
  onEnable,
}: {
  isVisible: boolean;
  onDismiss: () => void;
  onEnable: () => void;
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onDismiss}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <AppText text="✕" textStyle={styles.closeIcon} />
            </TouchableOpacity>
            <View style={styles.iconWrapper}>
              <Image
                source={require('../../assets/images/notifi.png')}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <AppText
              text="Turn on Notifications"
              textStyle={styles.title}
            />
            <AppText
              text="We recommend you to enable notifications to receive important updates on:"
              textStyle={styles.message}
            />
            <View style={styles.bulletList}>
              {BULLET_ITEMS.map((item, index) => (
                <View key={index} style={styles.bulletRow}>
                  <AppText text="• " textStyle={styles.bullet} />
                  <AppText text={item} textStyle={styles.bulletText} />
                </View>
              ))}
            </View>
            <AppButton
              title="Enable notification"
              onPress={onEnable}
              textStyle={styles.primaryButtonText}
              buttonStyle={styles.primaryButton}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default NotificationEnableDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding2*1.2,
    paddingBottom:SIZES.padding2*2,
    borderRadius: SIZES.radius,
    width: width * 0.85,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: SIZES.padding2,
    right: SIZES.padding2,
    zIndex: 1,
  },
  closeIcon: {
    fontSize: fontSize20,
    color: COLORS.textPrimary,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: COLORS.violet,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.padding2,
  },
  icon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: fontSize20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SIZES.base2,
  },
  message: {
    fontSize: fontSize14,
    textAlign: 'center',
    color: "#565E69",
  },
  bulletList: {
    alignSelf: 'stretch',
    marginVertical: SIZES.padding2 * 2,
  },
  bulletRow: {
    flexDirection: 'row',
  },
  bullet: {
    fontSize: fontSize16,
    color: COLORS.black,
  },
  bulletText: {
    flex: 1,
    fontSize: fontSize14,
    color: COLORS.black,
  },
  primaryButton: {
    backgroundColor: COLORS.violet,
    width: '100%',
    borderRadius: SIZES.radius / 3,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
