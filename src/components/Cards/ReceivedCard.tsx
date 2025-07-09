import {
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
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
} from '../../constants/Sizes';
import { convertCmToReadableHeight, imageUrl } from '../../constants/functions';
import { HomeIcon2 } from '../svg/SvgIcons';
import AppLinearButton from '../AppLinearButton';

const ReceivedCard = ({
  item,
  onDecline,
  onConnect,
}: {
  item: any;
  onDecline: () => void;
  onConnect: () => void;
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={{ uri: `${imageUrl + item.image}` }}
          style={styles.profileImage}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.imageOverlay}
          />
          <View style={styles.cardContent}>
            <AppText
              text={`${item.name}, ${item.age}`}
              textStyle={styles.name}
            />
            <AppText
              text={`${convertCmToReadableHeight(item.height)} · ${
                item.religion
              } · ${item.caste}`}
              textStyle={styles.details}
            />
            <View style={styles.homeIconContainer}>
              <HomeIcon2 color={COLORS.white} />
              <AppText
                text={`${item.districtName}, ${item.stateName}`}
                textStyle={styles.location}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.bioSection}>
        <AppText text="Bio" textStyle={styles.bioLabel} />
        <AppText text={item.aboutMe} textStyle={styles.bio} />
      </View>
      {/* Button Row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.declineButton} onPress={onDecline}>
          <AppText text="Decline" textStyle={styles.declineText} />
        </TouchableOpacity>
        <AppLinearButton
          title="Accept"
          onPress={onConnect}
          isButtonDisabled={false}
          isLoading={false}
        />
      </View>
    </View>
  );
};

export default ReceivedCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    paddingBottom: SIZES.padding,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: SIZES.height * 0.5,
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
    paddingVertical: SIZES.padding,
    alignItems: 'center',
    elevation: 3,
    paddingBottom: SIZES.padding,
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
});
