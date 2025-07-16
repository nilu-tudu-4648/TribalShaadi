import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import React, { useRef } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import AppText from '../AppText';
import { COLORS } from '../../constants/AppColors';
import {
  fontSize14,
  fontSize16,
  fontSize24,
  Size10,
  SIZES,
} from '../../constants/Sizes';
import AppChip from '../AppChip';
import AppButton from '../AppButton';
import {
  UtensilsIcon,
  WineGlassIcon,
  SmokingIcon,
  HomeWorkOutlineIcon,
  WorkIcon,
  PublicSectorIcon,
  RupeesIcon,
  LanguageIcon,
  CalendarIcon,
  HeartIcon2,
  HeightIcon,
  TribeIcon,
  ReligionIcon,
} from '../svg/SvgIcons';
import { ReportIcon } from '../svg/SvgIcons2';
import { useDispatch, useSelector } from 'react-redux';
import ReportBottomSheet from './ReportBottomSheet';
import AppLoader from '../AppLoader';
import {
  getProposalsSendByMeApi,
  sentProposalApi,
} from '../../store/reducers/userReducer';
import {
  baseUrl,
  convertCmToReadableHeight,
  getProposalsSendByMeUrl,
  imageUrl,
  sendProposalUrl,
} from '../../constants/functions';
import FONT_FAMILY from '../../constants/Fonts';

interface ProfileBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  isButtonVisible?: boolean;
}

const ProfileBottomSheet: React.FC<ProfileBottomSheetProps> = ({
  bottomSheetRef,
  isButtonVisible = false,
}) => {
  const snapPoints = ['55%', '50%'];
  const { selectedUser, loader } = useSelector(
    (state: any) => state.entities.userReducer,
  );
  const reportBottomSheetRef = useRef<BottomSheet | null>(null);
  const openReport = () => {
    reportBottomSheetRef?.current?.expand();
  };
  const dispatch = useDispatch();
  const handleSendProposal = (id: number) => {
    try {
      dispatch(
        sentProposalApi(`${baseUrl}/${sendProposalUrl}`, { proposalUserId: id }),
      );
      bottomSheetRef.current?.close();
      dispatch(getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`));
    } catch (error) {
      console.log(error, 'error');
    }
 };
  return (
    <>
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
        <BottomSheetScrollView style={styles.contentContainer}>
          {loader && <AppLoader />}
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: `${imageUrl + selectedUser?.image}` }}
              style={styles.profileImage}
            />
            <View style={styles.bioSection}>
              <AppText text="Bio" textStyle={styles.bioLabel} />
              <AppText text={selectedUser?.bio} textStyle={styles.bio} />
              <View style={styles.horizontalLine} />
              <View style={styles.row}>
                <View style={styles.column}>
                  <ReligionIcon />
                  <AppText
                    text={selectedUser?.religion}
                    textStyle={styles.value}
                  />
                  <AppText text={'Religion'} textStyle={styles.label} />
                </View>
                <View style={styles.verticalLine} />
                <View style={styles.column}>
                  <TribeIcon />
                  <AppText
                    text={selectedUser?.community}
                    textStyle={styles.value}
                  />
                  <AppText text={'Tribe'} textStyle={styles.label} />
                </View>
              </View>
              <View style={styles.horizontalLine} />
              <View style={styles.section}>
                <AppText text="About" textStyle={styles.sectionTitle} />
                <View style={styles.detailRow}>
                  <HeightIcon />
                  <View style={styles.detailText}>
                    <AppText text="Height" textStyle={styles.label} />
                    <AppText
                      text={convertCmToReadableHeight(selectedUser?.height)}
                      textStyle={styles.value}
                    />
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <HeartIcon2 color={COLORS.black} />
                  <View style={styles.detailText}>
                    <AppText text="Marital Status" textStyle={styles.label} />
                    <AppText
                      text={selectedUser?.maritalStatus}
                      textStyle={styles.value}
                    />
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <CalendarIcon color={COLORS.black} />
                  <View style={styles.detailText}>
                    <AppText text="Date of Birth" textStyle={styles.label} />
                    <AppText
                      text={selectedUser?.birthDate}
                      textStyle={styles.value}
                    />
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <LanguageIcon color={COLORS.black} />
                  <View style={styles.detailText}>
                    <AppText text="Mother Tongue" textStyle={styles.label} />
                    <AppText
                      text={selectedUser?.motherTongue}
                      textStyle={styles.value}
                    />
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <RupeesIcon color={COLORS.black} />
                  <View style={styles.detailText}>
                    <AppText text="Annual Income" textStyle={styles.label} />
                    <AppText
                      text={selectedUser?.annualIncome}
                      textStyle={styles.value}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.banner}>
                <AppText
                  text="matters most in a Life Partner!"
                  textStyle={styles.bannerSubtitle}
                />
                <AppText
                  text={selectedUser?.about_lifepartener}
                  textStyle={styles.bannerTitle}
                />
              </View>

              <View style={{ height: 200, backgroundColor: COLORS.divider }}>
                <ImageBackground
                  source={{ uri: `${imageUrl + selectedUser?.image}` }}
                  style={{ width: '100%', height: '100%' }}
                />
              </View>

              <View style={styles.section}>
                <View style={styles.detailRow2}>
                  <View style={styles.detailText}>
                    <AppText text="Employed in" textStyle={styles.label} />
                    <AppText
                      text={selectedUser?.employedIn}
                      textStyle={styles.value}
                    />
                  </View>
                  <PublicSectorIcon />
                </View>
                <View style={styles.thinLine} />
                <View style={styles.detailRow2}>
                  <View style={styles.detailText}>
                    <AppText text="Occupation" textStyle={styles.label} />
                    <AppText
                      text={selectedUser?.occupation}
                      textStyle={styles.value}
                    />
                  </View>
                  <WorkIcon />
                </View>
                <View style={styles.thinLine} />
                <View style={styles.detailRow2}>
                  <View style={styles.detailText}>
                    <AppText
                      text="Organisation Name"
                      textStyle={styles.label}
                    />
                    <AppText
                      text={selectedUser?.companyName}
                      textStyle={styles.value}
                    />
                  </View>
                  <HomeWorkOutlineIcon />
                </View>
              </View>

              <View style={styles.banner}>
                <AppText
                  text="planning to settle down"
                  textStyle={styles.bannerSubtitle}
                />
                <AppText
                  text={selectedUser?.planingto_settle}
                  textStyle={styles.bannerTitle}
                />
              </View>

              <View style={{ height: 200, backgroundColor: COLORS.divider }}>
                <ImageBackground
                  source={{ uri: `${imageUrl + selectedUser?.image}` }}
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            </View>
            <AppText text="College/University" textStyle={styles.headerLabel} />
            <AppText
              text={selectedUser?.college_name}
              textStyle={styles.headerValue}
            />
          </View>

          <View style={styles.attributesContainer}>
            <View style={styles.attributeCard}>
              <UtensilsIcon />
              <AppText
                text={selectedUser?.diet}
                textStyle={styles.attributeTitle}
              />
              <AppText
                text="Eating Habits"
                textStyle={styles.attributeSubtitle}
              />
            </View>
            <View style={styles.attributeCard}>
              <WineGlassIcon />
              <AppText
                text={selectedUser?.drinking}
                textStyle={styles.attributeTitle}
              />
              <AppText
                text="Drinking Habits"
                textStyle={styles.attributeSubtitle}
              />
            </View>
            <View style={styles.attributeCard}>
              <SmokingIcon />
              {/* <SmokingIcon /> */}
              <AppText
                text={selectedUser?.smoking}
                textStyle={styles.attributeTitle}
              />
              <AppText
                text="Smoking Habits"
                textStyle={styles.attributeSubtitle}
              />
            </View>
            <View style={styles.attributeCard}>
              <WineGlassIcon />
              <AppText
                text={selectedUser?.drinking_habits}
                textStyle={styles.attributeTitle}
              />
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
            {selectedUser?.intrests && (
              <View style={styles.chipsContainer}>
                {selectedUser?.intrests.split(',').map((interest: string) => (
                  <AppChip
                    key={interest}
                    style={{ width: '48%' }}
                    title={interest}
                    onPress={() => {}}
                  />
                ))}
              </View>
            )}
          </View>
          <View style={{ gap: SIZES.padding * 3, paddingVertical: SIZES.padding}}>
            <TouchableOpacity
              onPress={openReport}
              style={styles.reportButtonContainer}
            >
              <ReportIcon />
              <AppText text="Report" textStyle={styles.reportButtonText} />
            </TouchableOpacity>
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

export default ProfileBottomSheet;

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
  },
  handleIndicator: {
    backgroundColor: COLORS.grey, // Style the grabber handle
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    gap: SIZES.base * 2,
  },
  headerContainer: {},
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
    justifyContent: 'center',
  },
  interestsTitle: {
    fontSize: fontSize14,
    fontWeight: 'bold',
    color: COLORS.violet,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,

    // justifyContent: 'center',
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
    padding: SIZES.padding,
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
    fontFamily: FONT_FAMILY.OPEN_SANS_CONDENSED_SEMI_BOLD,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SIZES.padding,
  },
  thinLine: {
    height: 1,
    backgroundColor: COLORS.borderViolet,
    width: '100%',
  },
});
