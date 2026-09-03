import { StyleSheet, View, ImageBackground, Pressable } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
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
import AppButton from '../AppButton';
import NameComponent from '../NameComponent';

const ReceivedCard = ({
  item,
  onDecline,
  onConnect,
  onPress,
  planPurchased,
}: {
  item: any;
  onDecline?: () => void;
  onConnect?: (item: any) => void;
  onPress: () => void;
  planPurchased: boolean;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={{ uri: `${item.profileImage || item.image}` }}
          style={styles.profileImage}
          blurRadius={planPurchased ? 0 : 50}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.imageOverlay}
          />
          {planPurchased ? (
            <NameComponent
              name={`${item.firstName} ${item.lastName ?? ''}`}
              age={item.age}
              isVerified={item.isVerified}
              isPremium={item.isPremium}
              height={item.height ?? item.heightName ?? ''}
              religion={item.religion}
              caste={item.community}
              districtName={(item.districts || item.district) ?? ''}
              stateName={item.state ?? ''}
              freeConnect={item.freeConnect}
            />
          ) : (
            <NameComponent
              name={`${item.firstName} ${item.lastName ?? ''}`}
              age={item.age}
              isVerified={false}
              isPremium={false}
              height={item.height ?? item.heightName ?? ''}
              religion={""}
              caste={""}
              districtName={(item.districts || item.district) ?? ''}
              stateName={item.state ?? ''}
              freeConnect={item.freeConnect}
            />
          )}
        </ImageBackground>
      </View>
      {planPurchased && (
        <View style={styles.buttonRow}>
          <AppButton
            title="Decline"
            onPress={onDecline ?? (() => {})}
            isButtonDisabled={false}
            isLoading={false}
            buttonStyle={styles.declineButton}
            textStyle={styles.declineButtonText}
          />
          <AppButton
            title="Accept"
            onPress={() => onConnect?.(item)}
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

export default React.memo(ReceivedCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
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
