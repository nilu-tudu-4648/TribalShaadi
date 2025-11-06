import React from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import { COLORS } from '../constants/AppColors';
import {
  fontSize16,
  fontSize18,
  Size16,
  Size20,
  borderWidth,
  lignHeight60,
} from '../constants/Sizes';
import AppText from './AppText';

interface AppPickerModalProps {
  visible: boolean;
  title: string;
  items: string[] | any[];
  selectedValue: string;
  onSelect: (value: string | any) => void;
  onClose: () => void;
  isObjects?: boolean; // true if items are objects with id/name properties
  displayProperty?: string; // property name to display (default: 'name')
  modalTitleStyle?: StyleProp<TextStyle>;
}

const AppPickerModal: React.FC<AppPickerModalProps> = ({
  visible,
  title,
  items,
  selectedValue,
  onSelect,
  onClose,
  isObjects = false,
  displayProperty = 'name',
  modalTitleStyle,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <AppText text="Cancel" textStyle={styles.modalButton} />
            </TouchableOpacity>
            <AppText text={title} textStyle={[styles.modalTitle,modalTitleStyle]} />
            <View style={styles.modalButtonPlaceholder} />
          </View>
          <ScrollView style={styles.modalList}>
            {items.map(item => {
              const displayName = isObjects ? item[displayProperty] : item;
              const itemKey = isObjects ? item.id : item;
              return (
                <TouchableOpacity
                  key={itemKey}
                  style={[
                    styles.modalItem,
                    selectedValue === displayName && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    onSelect(isObjects ? item : item);
                    onClose();
                  }}
                >
                  <AppText
                    textStyle={[
                      styles.modalItemText,
                      selectedValue === displayName &&
                        styles.modalItemTextSelected,
                    ]}
                    text={displayName}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: Size20,
    borderTopRightRadius: Size20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Size20,
    paddingVertical: Size16,
    borderBottomWidth: borderWidth,
    borderBottomColor: COLORS.borderBottom,
  },
  modalTitle: {
    fontSize: fontSize18,
    fontWeight: '600',
    color: COLORS.textBlack,
  },
  modalButton: {
    fontSize: fontSize16,
    color: COLORS.primaryBlue,
  },
  modalButtonPlaceholder: {
    width: lignHeight60,
  },
  modalList: {
    paddingHorizontal: Size20,
  },
  modalItem: {
    paddingVertical: Size16,
    borderBottomWidth: borderWidth,
    borderBottomColor: COLORS.disabledBG,
  },
  modalItemSelected: {
    backgroundColor: COLORS.lightGreyBackground,
  },
  modalItemText: {
    fontSize: fontSize16,
    color: COLORS.textBlack,
  },
  modalItemTextSelected: {
    color: COLORS.primaryBlue,
    fontWeight: '600',
  },
});

export default AppPickerModal; 