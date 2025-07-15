import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
import { COLORS } from '../../constants/AppColors';
import {
  fontSize14,
  fontSize16,
  fontSize18,
  Size10,
  Size12,
  Size16,
  Size20,
  Size25,
} from '../../constants/Sizes';
import Fonts from '../../constants/Fonts';
import AppButton from '../AppButton';
import { DELETE_OPTIONS } from '../../constants/data';

interface DeleteBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  onReport: (reportReason: string) => void;
}

const DeleteBottomSheet: React.FC<DeleteBottomSheetProps> = ({
  bottomSheetRef,
  onReport,
}) => {
  const snapPoints = ['50%', '50%'];
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [showContent, setShowContent] = useState<string>('1');

  const handleReport = () => {
    if (showContent === '1') {
      setShowContent('2');
    } else if (showContent === '2') {
      setShowContent('3');
    } else if (showContent === '3') {
      if (selectedReason) {
        onReport(selectedReason);
        bottomSheetRef.current?.close();
        setSelectedReason(''); // Reset after reporting
        setShowContent('1');
      }
    }
  };

  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      setSelectedReason(''); // Reset when closed
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedReason(option);
  };

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetView style={styles.contentContainer}>
          {showContent === '1' ? (
            <>
              <View style={styles.headerContainer}>
                <AppText text="Delete Account" textStyle={styles.headerTitle} />
                <AppText
                  text="Please select the reason to delete your profile"
                  textStyle={styles.headerSubtitle}
                />
              </View>
              {DELETE_OPTIONS.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionContainer}
                  onPress={() => handleOptionSelect(option)}
                >
                  <View
                    style={{
                      ...styles.radioButton,
                      borderColor:
                        selectedReason === option ? COLORS.violet : COLORS.grey,
                    }}
                  >
                    {selectedReason === option && (
                      <View style={styles.radioButtonSelected} />
                    )}
                  </View>
                  <AppText text={option} textStyle={styles.optionText} />
                </TouchableOpacity>
              ))}
            </>
          ) : showContent === '2' ? (
            <View>
              <AppText
                text="We’re happy that you found your betterhalf!"
                textStyle={styles.headerTitle}
              />
              <AppText
                text="Don’t worry, all your photos, connections and chats will be deleted permanently in 7 days"
                textStyle={styles.headerSubtitle}
              />
            </View>
          ) : showContent === '3' ? (
            <View>
              <AppText
                text="We’re sad to see you go!"
                textStyle={styles.headerTitle}
              />
              <AppText
                text="All your photos, connections and chats will be deleted permanently in 7 days"
                textStyle={styles.headerSubtitle}
              />
            </View>
          ) : null}
          <View style={styles.buttonContainer}>
            <AppButton
              title="Cancel"
              onPress={() => {
                bottomSheetRef.current?.close();
                setShowContent('1');
              }}
              textStyle={styles.reportButtonText}
              buttonStyle={[styles.reportButton]}
            />
            <AppButton
              title="Continue"
              onPress={handleReport}
              textStyle={[styles.reportButtonText, { color: COLORS.violet }]}
              buttonStyle={[
                styles.reportButton,
                {
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: COLORS.violet,
                },
              ]}
              isButtonDisabled={!selectedReason}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default DeleteBottomSheet;

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: Size20,
    borderTopRightRadius: Size20,
  },
  handleIndicator: { backgroundColor: COLORS.divider, width: 40, height: 4 },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Size16,
    paddingVertical: Size12,
    gap: Size20,
    justifyContent: 'space-between',
    height: '100%',
  },
  headerContainer: { alignItems: 'flex-start', gap: Size12 },
  headerTitle: {
    fontSize: fontSize18,
    fontFamily: Fonts.OPEN_SANS_BOLD,
    color: COLORS.textBlack,
  },
  headerSubtitle: {
    fontSize: fontSize14,
    fontFamily: Fonts.OPEN_SANS_REGULAR,
    color: COLORS.textInactive,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Size10,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.violet,
  },
  optionText: {
    fontSize: fontSize16,
    fontFamily: Fonts.OPEN_SANS_CONDENSED_MEDIUM,
    color: COLORS.textBlack,
    flex: 1,
  },
  reportButton: {
    backgroundColor: COLORS.violet,
    borderRadius: Size25,
    width: '48%',
  },
  reportButtonDisabled: {
    backgroundColor: COLORS.textInactive,
  },
  reportButtonText: {
    color: COLORS.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Size12,
  },
});
