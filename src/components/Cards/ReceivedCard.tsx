import {
  StyleSheet,
  View,
  ImageBackground,
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
  Size14,
  Size40,
  Size20,
  Size25,
} from '../../constants/Sizes';
import { convertCmToReadableHeight, imageUrl } from '../../constants/functions';
import { HomeIcon2 } from '../svg/SvgIcons';
import AppButton from '../AppButton';

const ReceivedCard = ({
  item,
  onDecline,
  onConnect,
  onPress,
  planPurchased,
}: {
  item: any;
  onDecline: () => void;
  onConnect: (item: any) => void;
  onPress: () => void;
  planPurchased: boolean;
}) => {

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={{ uri: `${imageUrl + item.profileImage}` }}
          style={styles.profileImage}
          blurRadius={planPurchased ? 0 : 50}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.imageOverlay}
          />
          {planPurchased  ? (
            <View style={styles.cardContent}>
              <AppText
                text={`${item.firstName} ${(item.lastName??"")}, ${item.age}`}
                textStyle={styles.name}
              />
              <AppText
                text={`${convertCmToReadableHeight(item.height)} · ${
                  item.religion
                } · ${item.community}`}
                textStyle={styles.details}
              />
              <View style={styles.homeIconContainer}>
                <HomeIcon2 color={COLORS.white} />
                <AppText
                  text={`${item.city ? item.city : ''}, ${item.state}`}
                  textStyle={styles.location}
                />
              </View>
            </View>
          ) : (
            <View style={styles.whiteLineContainer}>
              <View style={{ ...styles.whiteLine, width: '60%' }} />
              <View style={styles.whiteLine} />
            </View>
          )}
        </ImageBackground>
      </View>
      {planPurchased && (
        <View style={styles.buttonRow}>
          <AppButton
            title="Decline"
            onPress={onDecline}
            isButtonDisabled={false}
            isLoading={false}
            buttonStyle={styles.declineButton}
            textStyle={styles.declineButtonText}
          />
          <AppButton
            title="Accept"
            onPress={() => onConnect(item)}
            isButtonDisabled={false}
            isLoading={false}
            buttonStyle={styles.connectButton}
            textStyle={styles.connectButtonText}
          />
        </View>
      )}
    </Pressable>
  );
};

export default ReceivedCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    paddingBottom: SIZES.padding,
  },
  imageContainer: {
    width: '100%',
    height: SIZES.height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Size14,
    overflow: 'hidden',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    gap: SIZES.padding,
    bottom: Size25,
  },
  connectButton: {
    backgroundColor: COLORS.violet,
    width: '47%',
    elevation: 2,
    borderRadius: Size10,
  },
  connectButtonText: {
    color: COLORS.white,
  },
  declineButton: {
    backgroundColor: COLORS.white,
    width: '47%',
    elevation: 2,
    borderRadius: Size10,
  },
  declineButtonText: {
    color: COLORS.declineButton,
    fontSize: fontSize16,
    fontWeight: '600',
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
  whiteLine: {
    backgroundColor: COLORS.white,
    height: Size20,
    width: '100%',
    borderRadius: Size10,
  },
  whiteLineContainer: {
    height: Size40,
    width: '60%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Size10,
    bottom: Size40,
    gap: Size10,
  },
});
