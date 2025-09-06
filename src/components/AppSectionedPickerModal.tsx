import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../constants/AppColors';
import {
  borderWidth,
  fontSize16,
  fontSize18,
  Size12,
  Size16,
  Size20,
  Size8,
  lignHeight60,
} from '../constants/Sizes';
import AppText from './AppText';

type SectionItem = {
  id: string | number;
  name: string;
};

type Section = {
  id: string | number;
  title: string;
  data: SectionItem[];
};

interface Props {
  visible: boolean;
  title: string;
  sections: Section[];
  selectedItemId?: string | number;
  onSelect: (item: SectionItem, section: Section) => void;
  onClose: () => void;
}

const AppSectionedPickerModal: React.FC<Props> = ({
  visible,
  title,
  sections,
  selectedItemId,
  onSelect,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <AppText text="Cancel" textStyle={styles.modalButton} />
            </TouchableOpacity>
            <AppText text={title} textStyle={styles.modalTitle} />
            <View style={styles.modalButtonPlaceholder} />
          </View>

          <ScrollView style={styles.modalList}>
            {sections.map(section => (
              <View key={section.id} style={styles.sectionContainer}>
                <AppText text={section.title} textStyle={styles.sectionTitle} />
                {section.data.map(item => {
                  const isSelected = selectedItemId === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.itemRow}
                      onPress={() => {
                        onSelect(item, section);
                        onClose();
                      }}
                    >
                      <AppText text={item.name} textStyle={styles.itemText} />
                      <View
                        style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
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
    maxHeight: '75%',
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
  sectionContainer: {
    paddingVertical: Size12,
  },
  sectionTitle: {
    fontSize: fontSize16,
    fontWeight: '700',
    color: COLORS.textBlack,
    marginBottom: Size8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Size12,
    borderBottomWidth: borderWidth,
    borderBottomColor: COLORS.disabledBG,
  },
  itemText: {
    fontSize: fontSize16,
    color: COLORS.textBlack,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.placeholderInactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primaryBlue,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primaryBlue,
  },
});

export default AppSectionedPickerModal;


