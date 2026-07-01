import {
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../AppText';
import { COLORS } from '../../constants/AppColors';
import {
  SIZES,
  fontSize24,
  fontSize14,
  fontSize16,
  Size10,
  Size8,
  fontWeight700,
  Size14,
  Size4,
  fontSize18,
} from '../../constants/Sizes';
import {
  convertCmToReadableHeight,
  imageUrl,
  formatDateShort,
} from '../../constants/functions';
import {
  TribeIcon,
  KidsIcon,
  LanguageIcon,
  WorkIcon,
  CigrateIcon,
  HomeWorkOutlineIcon,
  HeartIcon2,
  DegreeIcon,
  EducationIcon2,
} from '../svg/SvgIcons';
import AppChip from '../AppChip';
import NameComponent from '../NameComponent';
import { CalendarIcon2, ReportIcon } from '../svg/SvgIcons2';
import TagPill from '../chips/TagPill';
import AppButton from '../AppButton';

export interface ProfileCardProps {
  name: string;
  age: number;
  gender: string;
  height: string;
  religion: string;
  caste: string;
  districtName: string;
  stateName: string;
  bio: string;
  image: any;
  isLoading: boolean;
  maritalStatus: string;
  dob: any;
  motherTongue: string;
  annualIncome: string;
  partnerExpectation: string;
  employedIn: string;
  occupation: string;
  organizationName: string;
  settlingTime: string;
  highestQualification: string;
  college: string;
  eatingHabits: string;
  drinkingHabits: string;
  smokingHabits: string;
  kids: string;
  interests: string;
  galleryImageList: any;
  isVerified: boolean;
  isPremium: boolean;
  isNameLoading?: boolean;
  openReport: () => void;
  report?: boolean;
  isButtonVisible?: boolean;
  handleSendProposal?: any;
  freeConnect: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  age,
  gender,
  height,
  religion,
  caste,
  districtName,
  stateName,
  bio,
  image,
  organizationName,
  dob,
  motherTongue,
  annualIncome,
  partnerExpectation,
  maritalStatus,
  employedIn,
  occupation,
  highestQualification,
  college,
  eatingHabits,
  drinkingHabits,
  smokingHabits,
  kids,
  interests,
  settlingTime,
  galleryImageList,
  isVerified,
  isPremium,
  isNameLoading = false,
  openReport,
  report = true,
  isButtonVisible = false,
  handleSendProposal,
  freeConnect,
}) => {
  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      nestedScrollEnabled={true}
      scrollEnabled={true}
      horizontal={false}
      directionalLockEnabled={true}
      scrollEventThrottle={16}
    >
      <View style={styles.imageContainer}>
        <ImageBackground
          source={{ uri: `${imageUrl + image}` }}
          style={styles.profileImage}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.imageOverlay}
          />
          <NameComponent
            freeConnect={gender !== 'Male' ? freeConnect : ''}
            name={name}
            age={age}
            isVerified={isVerified}
            isPremium={isPremium}
            height={height}
            religion={religion}
            caste={caste}
            districtName={districtName}
            stateName={stateName}
            isNameLoading={isNameLoading}
          />
        </ImageBackground>
      </View>
      <View style={styles.bioSection}>
        {/* <View style={styles.horizontalLine} /> */}
        {
          bio &&
          <AppText text={bio} textStyle={styles.bio} />
        }
        {/* <View style={styles.horizontalLine} /> */}
        <View style={styles.horizontalLine} />
        <View style={styles.detailRow}>
          <TagPill icon={<Image source={require('../../assets/images/pray.png')} style={styles.tagPillImage} />}
            label={religion} />
          <TagPill icon={<TribeIcon />} label={caste} />
          <TagPill
            icon={<Image source={require('../../assets/images/height.png')} style={styles.tagPillImage} />}
            label={convertCmToReadableHeight(height)}
          />
          <TagPill icon={<HeartIcon2 />} label={maritalStatus} />
          <TagPill icon={<Image source={require('../../assets/images/calendern.png')} style={styles.tagPillImage} />} label={formatDateShort(dob)} />
          <TagPill icon={<LanguageIcon />} label={motherTongue} />
          <TagPill icon={<Image source={require('../../assets/images/rupees.png')} style={styles.tagPillImage} />} label={annualIncome || "Not Applicable"} />
        </View>
      </View>

      <View style={styles.horizontalLine} />
      {galleryImageList && galleryImageList[0]?.imageUrl && (
        <Image
          key={galleryImageList[0]?.id}
          source={{ uri: imageUrl + galleryImageList[0]?.imageUrl }}
          style={styles.galleryImage}
          resizeMode="cover"
          onError={(error) => console.log('Image 0 load error:', error)}
        />
      )}
      {/* <View style={styles.horizontalLine} /> */}
      {highestQualification &&
        <View style={styles.section}>
          <>
            <AppText text="Education" textStyle={styles.sectionTitle} />
            <TagPill icon={<DegreeIcon />} label={highestQualification} />
          </>
          {college && <TagPill icon={<EducationIcon2 />} label={college} />}
        </View>
      }
      <View style={styles.section}>
        <AppText text="Career" textStyle={styles.sectionTitle} />
        {employedIn && <TagPill icon={<Image source={require('../../assets/images/employe.png')} style={styles.tagPillImage} />}
          label={employedIn} />}
        {
          occupation &&
          <TagPill icon={<WorkIcon />} label={occupation} />
        }
        <TagPill
          icon={<HomeWorkOutlineIcon />}
          label={organizationName || 'Not applicable'}
        />
      </View>
      <View style={styles.section}>
        <View style={styles.banner}>
          <AppText
            text="matters most in a Life Partner!"
            textStyle={styles.bannerSubtitle}
          />
          <AppText text={partnerExpectation} textStyle={styles.bannerTitle} />
        </View>
      </View>
      <View style={styles.horizontalLine} />
      {galleryImageList && galleryImageList[1]?.imageUrl && (
        <View style={styles.imageWrapper}>
          <Image
            key={galleryImageList[1]?.id}
            source={{ uri: imageUrl + galleryImageList[1]?.imageUrl }}
            style={styles.galleryImage}
            resizeMode="cover"
            onError={(error) => console.log('Image 1 load error:', error)}
          />
        </View>
      )}
      <View style={styles.horizontalLine} />
      <View style={styles.section}>
        <AppText text="Life Style" textStyle={styles.sectionTitle} />
        <View style={styles.detailRow}>
          <TagPill
            icon={<Image source={require('../../assets/images/eating.png')} style={styles.tagPillImage} />}
            label={eatingHabits}
            containerStyle={{ width: '48%' }}
          />
          <TagPill
            icon={<Image source={require('../../assets/images/drink.png')} style={styles.tagPillImage} />}
            label={drinkingHabits}
            containerStyle={{ width: '48%' }}
          />
          <TagPill
            icon={<CigrateIcon />}
            label={smokingHabits}
            containerStyle={{ width: '48%' }}
          />
          <TagPill
            icon={<KidsIcon />}
            label={kids}
            containerStyle={{ width: '48%' }}
          />
        </View>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.section}>
        <AppText text="Interests & Hobbies" textStyle={styles.sectionTitle} />
        <View style={styles.interestsContainer}>
          {interests?.split(',')?.map((interest: string, index: number) => (
            <AppChip
              key={index}
              title={interest}
              style={styles.interestChip}
              onPress={() => { }}
            />
          ))}
        </View>
        <View style={styles.horizontalLine} />
        <View style={styles.banner}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarTextContainer}>
              <AppText
                text={`${name} is ${maritalStatus} and want to settle down ${settlingTime}`}
                textStyle={{ fontSize: fontSize18 }}
              />
            </View>
            <View style={{ width: '10%', justifyContent: 'center' }}>
              <CalendarIcon2 />
            </View>
          </View>
        </View>
        {report && (
          <Pressable onPress={openReport} style={styles.reportButtonContainer}>
            <ReportIcon />
            <AppText text="Report" textStyle={styles.reportButtonText} />
          </Pressable>
        )}
        {isButtonVisible && (
          <AppButton
            title="Connect"
            onPress={handleSendProposal}
            textStyle={styles.connectButtonText}
            buttonStyle={styles.connectButton}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default React.memo(ProfileCard);

const styles = StyleSheet.create({
  calendarTextContainer: {
    width: '85%',
  },
  calendarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Size8,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: SIZES.height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  imageOverlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bio: {
    fontSize: fontSize16,
    color: COLORS.secondaryText,
  },
  bioSection: {
    padding: SIZES.padding,
    width: '100%',
  },
  horizontalLine: {
    height: Size10,
    width: '100%',
    alignSelf: 'center',
  },
  section: {
    padding: SIZES.padding,
    gap: SIZES.padding,
  },
  sectionTitle: {
    fontSize: fontSize16,
    fontWeight: fontWeight700,
    color: COLORS.secondaryText,
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.padding,
  },
  banner: {
    backgroundColor: COLORS.cardBg,
    padding: SIZES.padding,
    paddingHorizontal: SIZES.h4,
    alignItems: 'flex-start',
    gap: SIZES.base / 2,
    borderRadius: Size8,
  },
  bannerTitle: {
    fontSize: fontSize24,
    fontWeight: fontWeight700,
  },
  bannerSubtitle: {
    fontSize: fontSize14,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 200,
  },
  galleryImage: {
    width: '100%',
    height: SIZES.height * 0.7,
  },
  imageWrapper: {
    backgroundColor: COLORS.divider,
  },
  interestChip: {
    paddingHorizontal: Size14,
    paddingVertical: Size4,
    borderRadius: Size14,
    backgroundColor: COLORS.chipBg,
    borderWidth: 0,
  },
  reportButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.base,
    paddingVertical: SIZES.base,
  },
  reportButtonText: {
    color: COLORS.red,
    fontSize: SIZES.font,
    fontWeight: 'bold',
  },
  actionsContainer: {
    gap: SIZES.padding * 3,
    paddingVertical: SIZES.padding * 3,
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
  tagPillImage: {
    width: 15, height: 15,
    resizeMode: "contain"
  }
});
