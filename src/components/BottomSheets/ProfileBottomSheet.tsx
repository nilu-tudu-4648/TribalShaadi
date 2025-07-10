import { View, StyleSheet } from 'react-native';
import React from 'react';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
import { COLORS } from '../../constants/AppColors';
import { SIZES } from '../../constants/Sizes';
import AppChip from '../AppChip';
import AppButton from '../AppButton';
import { UtensilsIcon, WineGlassIcon, SmokingIcon } from '../svg/SvgIcons';

interface ProfileBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}

const ProfileBottomSheet: React.FC<ProfileBottomSheetProps> = ({
  bottomSheetRef,
}) => {
  const snapPoints = ['25%', '50%', '75%'];

  const interests = [
    'Photography',
    'Yoga & Meditation',
    'Working Out',
    'Shopping',
    'Playing Instrument',
  ];

  return (
    <BottomSheet
      onClose={() => {
        bottomSheetRef.current?.close();
      }}
      ref={bottomSheetRef}
      index={-1} // -1 means hidden
      snapPoints={snapPoints}
      enablePanDownToClose={true}
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
        <View style={styles.headerContainer}>
          <AppText text="College/University" textStyle={styles.headerLabel} />
          <AppText text="NIT, Bhopal" textStyle={styles.headerValue} />
        </View>

        <View style={styles.attributesContainer}>
          <View style={styles.attributeCard}>
            <UtensilsIcon />
            <AppText text="Non-Vegetarian" textStyle={styles.attributeTitle} />
            <AppText
              text="Eating Habits"
              textStyle={styles.attributeSubtitle}
            />
          </View>
          <View style={styles.attributeCard}>
            <WineGlassIcon />
            <AppText text="Socially" textStyle={styles.attributeTitle} />
            <AppText
              text="Drinking Habits"
              textStyle={styles.attributeSubtitle}
            />
          </View>
          <View style={styles.attributeCard}>
            <SmokingIcon />
            {/* <SmokingIcon /> */}
            <AppText
              text="Planning to quit"
              textStyle={styles.attributeTitle}
            />
            <AppText
              text="Smoking Habits"
              textStyle={styles.attributeSubtitle}
            />
          </View>
          <View style={styles.attributeCard}>
            <WineGlassIcon />
            <AppText text="Socially" textStyle={styles.attributeTitle} />
            <AppText
              text="Drinking Habits"
              textStyle={styles.attributeSubtitle}
            />
          </View>
        </View>

        <View style={styles.interestsContainer}>
          <AppText
            text="Interests & Hobbies"
            textStyle={styles.interestsTitle}
          />
          <View style={styles.chipsContainer}>
            {interests.map(interest => (
              <AppChip key={interest} title={interest} onPress={() => {}} />
            ))}
          </View>
        </View>

        <View style={styles.reportButtonContainer}>
          <AppButton
            title="Report"
            onPress={() => console.log('Report Pressed')}
            textStyle={styles.reportButtonText}
            buttonStyle={styles.reportButton}
            // icon={<ShieldIcon color={COLORS.red} width={SIZES.h5} height={SIZES.h5} />}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default ProfileBottomSheet;

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius * 2, // Larger radius for the top corners
  },
  handleIndicator: {
    backgroundColor: COLORS.grey, // Style the grabber handle
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    gap: SIZES.base * 2,
  },
  headerContainer: {
    marginBottom: SIZES.base,
  },
  headerLabel: {
    fontSize: SIZES.font,
    color: COLORS.textInactive,
  },
  headerValue: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  attributesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderLight,
  },
  attributeCard: {
    width: '49%',
    paddingVertical: SIZES.padding,
    gap: SIZES.base * 0.5,
    alignItems: 'flex-start',
  },
  attributeTitle: {
    fontSize: SIZES.h5,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  attributeSubtitle: {
    fontSize: SIZES.font,
    color: COLORS.textInactive,
  },
  interestsContainer: {
    gap: SIZES.base,
  },
  interestsTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,
  },
  reportButtonContainer: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  reportButton: {
    backgroundColor: 'transparent',
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base * 2,
  },
  reportButtonText: {
    color: COLORS.red,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
});
