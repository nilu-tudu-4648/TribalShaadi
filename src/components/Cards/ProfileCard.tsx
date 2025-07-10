import { StyleSheet, View, ImageBackground, ScrollView } from 'react-native';
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
  Size25,
} from '../../constants/Sizes';
import { convertCmToReadableHeight, imageUrl } from '../../constants/functions';
import {
  CalendarIcon,
  HeartIcon,
  HomeIcon2,
  ReligionIcon,
  TribeIcon,
  EatingIcon,
  KidsIcon,
  HeightIcon,
  LanguageIcon,
  RupeesIcon,
  PublicSectorIcon,
  WorkIcon,
  DrinkingIcon,
  CigrateIcon,
  HomeWorkOutlineIcon,
} from '../svg/SvgIcons';
import AppChip from '../AppChip';
import FONT_FAMILY from '../../constants/Fonts';

export interface ProfileCardProps {
  name: string;
  age: number;
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
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  age,
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
  }) => {
      return (
      <View style={styles.card}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
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
            <View style={styles.cardContent}>
              <AppText text={`${name}, ${age}`} textStyle={styles.name} />
              <AppText
                text={`${convertCmToReadableHeight(
                  height,
                )} · ${religion} · ${caste}`}
                textStyle={styles.details}
              />
              <View style={styles.homeIconContainer}>
                <HomeIcon2 color={COLORS.white} />
                <AppText
                  text={`${districtName}, ${stateName}`}
                  textStyle={styles.location}
                />
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.bioSection}>
          <AppText text="Bio" textStyle={styles.bioLabel} />
          <AppText text={bio} textStyle={styles.bio} />
        </View>
        <View style={styles.horizontalLine} />

        <View style={styles.row}>
          <View style={styles.column}>
            <ReligionIcon />
            <AppText
              text={religion}
              textStyle={styles.value}
            />
            <AppText text={'Religion'} textStyle={styles.label} />
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.column}>
            <TribeIcon />
            <AppText text={caste} textStyle={styles.value} />
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
                text={convertCmToReadableHeight(height)}
                textStyle={styles.value}
              />
            </View>
          </View>
          <View style={styles.detailRow}>
            <HeartIcon color={COLORS.black} />
            <View style={styles.detailText}>
              <AppText text="Marital Status" textStyle={styles.label} />
              <AppText text={maritalStatus} textStyle={styles.value} />
            </View>
          </View>
          <View style={styles.detailRow}>
            <CalendarIcon color={COLORS.black} />
            <View style={styles.detailText}>
              <AppText text="Date of Birth" textStyle={styles.label} />
              <AppText text={dob} textStyle={styles.value} />
            </View>
          </View>
          <View style={styles.detailRow}>
            <LanguageIcon color={COLORS.black} />
            <View style={styles.detailText}>
              <AppText text="Mother Tongue" textStyle={styles.label} />
              <AppText text={motherTongue} textStyle={styles.value} />
            </View>
          </View>
          <View style={styles.detailRow}>
            <RupeesIcon color={COLORS.black} />
            <View style={styles.detailText}>
              <AppText text="Annual Income" textStyle={styles.label} />
              <AppText text={annualIncome} textStyle={styles.value} />
            </View>
          </View>
        </View>

        <View style={styles.banner}>
          <AppText
            text="matters most in a Life Partner!"
            textStyle={styles.bannerSubtitle}
          />
          <AppText text={partnerExpectation} textStyle={styles.bannerTitle} />
        </View>

        <View style={{ height: 200, backgroundColor: COLORS.divider }}>
          <ImageBackground
            source={{ uri: `${imageUrl + image}` }}
            style={{ width: '100%', height: '100%' }}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.detailRow2}>
            <View style={styles.detailText}>
              <AppText text="Employed in" textStyle={styles.label} />
              <AppText text={employedIn} textStyle={styles.value} />
            </View>
            <PublicSectorIcon />
          </View>
          <View style={styles.thinLine} />
          <View style={styles.detailRow2}>
            <View style={styles.detailText}>
              <AppText text="Occupation" textStyle={styles.label} />
              <AppText text={occupation} textStyle={styles.value} />
            </View>
            <WorkIcon />
          </View>
          <View style={styles.thinLine} />
          <View style={styles.detailRow2}>
            <View style={styles.detailText}>
              <AppText text="Organisation Name" textStyle={styles.label} />
              <AppText text={organizationName} textStyle={styles.value} />
            </View>
            <HomeWorkOutlineIcon />
          </View>
        </View>

        <View style={styles.banner}>
          <AppText
            text="planning to settle down"
            textStyle={styles.bannerSubtitle}
          />
          <AppText text={settlingTime} textStyle={styles.bannerTitle} />
        </View>

        <View style={{ height: 200, backgroundColor: COLORS.divider }}>
          <ImageBackground
            source={{ uri: `${imageUrl + image}` }}
            style={{ width: '100%', height: '100%' }}
          />
        </View>

        <View style={styles.section}>
          <AppText text="Education" textStyle={styles.sectionTitle} />
          <View style={styles.detailRow}>
            <View style={styles.detailText}>
              <AppText text="Highest Qualification" textStyle={styles.label} />
              <AppText text={highestQualification} textStyle={styles.value} />
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailText}>
              <AppText text="College/University" textStyle={styles.label} />
              <AppText text={college} textStyle={styles.value} />
            </View>
          </View>
        </View>
        <View style={styles.horizontalLine} />
        <View style={styles.row}>
          <View style={styles.column}>
            <EatingIcon />
            <AppText text={eatingHabits} textStyle={styles.value} />
            <AppText text={'Eating Habits'} textStyle={styles.label} />
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.column}>
            <DrinkingIcon />
            <AppText text={drinkingHabits} textStyle={styles.value} />
            <AppText text={'Drinking Habits'} textStyle={styles.label} />
          </View>
        </View>
        <View style={{
          height: 1,
          backgroundColor: COLORS.borderViolet,
          width: '100%',
        }} />
        <View style={styles.row}>
          <View style={styles.column}>
            <CigrateIcon />
            <AppText text={smokingHabits} textStyle={styles.value} />
            <AppText text={'Smoking Habits'} textStyle={styles.label} />
          </View>
          <View style={styles.verticalLine} />
          <View style={styles.column}>
            <KidsIcon />
            <AppText text={kids} textStyle={styles.value} />
            <AppText text={'Kids'} textStyle={styles.label} />
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
                style={{
                  backgroundColor: COLORS.transparent,
                  borderColor: COLORS.borderBottom2,
                  borderWidth: 1,
                  borderRadius: Size8,
                }}
                onPress={() => {}}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: Size25*2,
    gap: SIZES.padding,
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
  homeIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base / 2,
  },
  cardContent: {
    padding: SIZES.padding,
    gap: SIZES.base / 2,
    paddingBottom: SIZES.largeTitle,
  },
  name: {
    fontSize: fontSize24,
    fontWeight: '700',
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    zIndex: 1,
  },
  age: {
    fontWeight: '400',
  },
  details: {
    fontSize: fontSize14,
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    zIndex: 1,
  },
  location: {
    fontSize: fontSize14,
    color: COLORS.white,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    zIndex: 1,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    gap: SIZES.padding,
  },
  declineButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    elevation: 3,
  },
  connectButtonWrapper: {
    flex: 1,
    borderRadius: SIZES.radius,
    shadowColor: '#5167FC',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  connectButton: {
    flex: 1,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineText: {
    color: COLORS.textInactive,
    fontWeight: '700',
    fontSize: fontSize16,
  },
  connectText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: fontSize16,
  },
  bioSection: {
    padding: SIZES.padding,
    gap: SIZES.base,
  },
  horizontalLine: {
    height: Size10,
    backgroundColor: COLORS.divider,
    width: '100%',
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
    paddingBottom: SIZES.padding,
  },
  thinLine: {
    height: 1,
    backgroundColor: COLORS.borderViolet,
    width: '100%',
  },
});
