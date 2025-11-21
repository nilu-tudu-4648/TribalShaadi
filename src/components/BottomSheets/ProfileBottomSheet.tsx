import { View, StyleSheet } from 'react-native';
import React, { useRef } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { COLORS } from '../../constants/AppColors';
import {
  fontSize14,
  fontSize16,
  fontSize24,
  Size10,
  Size5,
  SIZES,
} from '../../constants/Sizes';
import AppButton from '../AppButton';
import { useDispatch, useSelector } from 'react-redux';
import ReportBottomSheet from './ReportBottomSheet';
import {
  getProposalsSendByMeApi,
  sentProposalApi,
  getPassedUsersApi,
} from '../../store/reducers/userReducer';
import {
  baseUrl,
  delay,
  getPassedUsersUrl,
  getProposalsSendByMeUrl,
  insertUserNotificationsUrl,
  sendProposalUrl,
} from '../../constants/functions';
import FONT_FAMILY from '../../constants/Fonts';
import { insertUserNotificationsApi } from '../../store/reducers/chatReducer';
import ProfileCard from '../Cards/ProfileCard';
import { NOTIFICATION_MESSAGES } from '../../constants/data';

interface ProfileBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  isButtonVisible?: boolean;
  user: any;
  currentUserPackage: any;
  report?: boolean;
}

const ProfileBottomSheet: React.FC<ProfileBottomSheetProps> = ({
  bottomSheetRef,
  isButtonVisible = false,
  user,
  currentUserPackage,
  report = true,
}) => {
  const { selectedUser, currentMatchedUserGalleryImageList } = useSelector(
    (state: any) => state.entities.userReducer,
  );
  const reportBottomSheetRef = useRef<BottomSheet | null>(null);
  const openReport = () => {
    reportBottomSheetRef?.current?.expand();
  };
  const dispatch = useDispatch();
  const handleSendProposal = async (id: number) => {
    try {
      dispatch(
        sentProposalApi(`${baseUrl}/${sendProposalUrl}`, {
          proposalUserId: id,
        }),
      );
      await delay();
      dispatch(
        insertUserNotificationsApi(`${baseUrl}/${insertUserNotificationsUrl}`, {
          title: NOTIFICATION_MESSAGES.NEW_PROPOSAL.title,
          message: `${user.firstName} ${user.lastName ?? ''} ${
            NOTIFICATION_MESSAGES.NEW_PROPOSAL.message
          }`,
          receiverUserId: id,
        }),
      );
      dispatch(
        getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`),
      );
      dispatch(getPassedUsersApi(`${baseUrl}/${getPassedUsersUrl}`));
    } catch (error) {
      console.log(error, 'error');
    } finally {
      bottomSheetRef.current?.close();
    }
  };
  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['80%']}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        enableOverDrag={false}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.bottomSheetBackground}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
      >
        <BottomSheetScrollView style={styles.contentContainer}>
          {selectedUser && (
            <ProfileCard
              name={
                selectedUser.firstName + ' ' + (selectedUser.lastName ?? '')
              }
              isNameLoading={false}
              age={selectedUser.age}
              height={selectedUser.height}
              religion={selectedUser.religion}
              caste={selectedUser.community}
              districtName={selectedUser.districtName}
              stateName={selectedUser.stateName}
              bio={selectedUser.aboutMe}
              image={selectedUser.image || selectedUser.imageUrl}
              galleryImageList={
                selectedUser.galleryImageList ||
                currentMatchedUserGalleryImageList
              }
              isLoading={false}
              maritalStatus={user.maritalStatus}
              dob={selectedUser.birthDate}
              motherTongue={selectedUser.motherTongue}
              annualIncome={selectedUser.annualIncome}
              partnerExpectation={selectedUser.about_lifepartener}
              employedIn={selectedUser.employmentType}
              occupation={selectedUser.occupationCategoryName}
              organizationName={selectedUser.companyName}
              settlingTime={selectedUser.planingto_settle}
              highestQualification={selectedUser.education}
              college={selectedUser.college_name}
              eatingHabits={selectedUser.diet}
              drinkingHabits={selectedUser.drinking}
              smokingHabits={selectedUser.smoking}
              kids={selectedUser.kids}
              interests={selectedUser.intrests}
              isVerified={selectedUser.isVerified}
              isPremium={currentUserPackage.length > 0}
              openReport={openReport}
              report={report}
            />
          )}
          <View style={styles.actionsContainer}>
            {isButtonVisible && (
              <AppButton
                title="Connect"
                onPress={() => {
                  handleSendProposal(selectedUser?.id);
                }}
                textStyle={styles.connectButtonText}
                buttonStyle={styles.connectButton}
              />
            )}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
      <ReportBottomSheet
        bottomSheetRef={reportBottomSheetRef}
        onReport={(reportReason: string) => {
          console.log('Profile reported for:', reportReason);
          // Add your report logic here
        }}
      />
    </>
  );
};

export default React.memo(ProfileBottomSheet);

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius, // Larger radius for the top corners
  },
  profileImage: {
    width: '100%',
    height: SIZES.height * 0.5,
    borderRadius: SIZES.radius,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  handleIndicator: {
    backgroundColor: COLORS.grey, // Style the grabber handle
  },
  contentContainer: {
    flex: 1,
    gap: SIZES.base * 2,
    // paddingHorizontal: SIZES.padding,
  },
  headerLabel: {
    fontSize: SIZES.font,
    color: COLORS.textInactive,
  },
  headerValue: {
    fontSize: fontSize16,
    fontWeight: '600',
    color: COLORS.black,
  },
  actionsContainer: {
    gap: SIZES.padding * 3,
    paddingVertical: SIZES.padding * 3,
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
    justifyContent: 'center',
  },
  interestsTitle: {
    fontSize: fontSize14,
    fontWeight: 'bold',
    color: COLORS.violet,
  },
  interestChip: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: Size5,
  },
  interestChipText: {
    fontSize: fontSize14,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,
  },
  reportButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.base,
  },
  reportButtonText: {
    color: COLORS.red,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  connectButton: {
    backgroundColor: COLORS.violet,
    width: '60%',
    alignSelf: 'center',
    borderRadius: SIZES.h5,
  },
  connectButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  bioSection: {
    // padding: SIZES.padding,
    gap: SIZES.base,
  },
  horizontalLine: {
    height: Size10,
    backgroundColor: COLORS.divider,
    width: SIZES.width,
    alignSelf: 'center',
  },
  verticalLine: {
    width: 1,
    backgroundColor: COLORS.divider,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SIZES.padding,
  },
  column: {
    alignItems: 'flex-start',
    gap: SIZES.base / 2,
    flex: 1,
    paddingLeft: SIZES.padding2,
    justifyContent: 'space-between',
  },
  value: {
    fontWeight: 'bold',
    fontSize: fontSize14,
    fontFamily: FONT_FAMILY.PRODUCT_SANS_BOLD,
  },
  label: {
    color: COLORS.textGrey,
    fontSize: fontSize14,
  },
  section: {
    padding: SIZES.padding,
    gap: SIZES.padding,
  },
  sectionTitle: {
    fontSize: fontSize16,
    fontWeight: 'bold',
    color: COLORS.violet,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.padding,
  },
  detailRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SIZES.padding,
  },
  detailText: {
    gap: SIZES.base2,
  },
  banner: {
    backgroundColor: COLORS.bannerColor,
    padding: SIZES.padding,
    alignItems: 'flex-start',
    gap: SIZES.base / 2,
  },
  bannerTitle: {
    fontSize: fontSize24,
    fontWeight: '700',
    color: COLORS.white,
    fontStyle: 'italic',
  },
  bannerSubtitle: {
    fontSize: fontSize14,
    color: COLORS.white,
  },
  bioLabel: {
    fontWeight: '700',
    fontStyle: 'italic',
    color: COLORS.textGrey,
  },
  bio: {
    fontSize: fontSize14,
    color: COLORS.textGrey,
    lineHeight: 20,
  },
  thinLine: {
    height: 1,
    backgroundColor: COLORS.borderViolet,
    width: '100%',
  },
  galleryImage: {
    width: '100%',
    height: SIZES.height * 0.6,
  },
});
