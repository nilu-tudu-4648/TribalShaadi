import { StyleSheet, View, Image, Pressable } from 'react-native';
import React from 'react';
import {
  fontSize14,
  Size16,
  Size4,
  screenHeight,
  fontSize12,
} from '../../constants/Sizes';
import AppText from '../AppText';
import LinearGradient from 'react-native-linear-gradient';
import { imageUrl } from '../../constants/functions';

const RecentCard = ({ item, onPress }: { item: any; onPress: () => void }) => {
  return (
    <Pressable onPress={onPress} style={styles.profileCard}>
      <Image source={{uri: imageUrl + item.image}} style={styles.profileImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.imageOverlay}
      />
      <View style={styles.profileInfo}>
        <AppText
          text={item.firstName + ' ' +  `${item.lastName ?? ''}`}
          textStyle={styles.profileName}
        />
        <AppText
          text={item.district + ', ' + item.state}
          textStyle={styles.profileLocation}
      />
      </View>
    </Pressable>
  );
};

export default React.memo(RecentCard);

const styles = StyleSheet.create({
  profileCard: {
    width: '48%',
    borderRadius: Size16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageOverlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    bottom: 0,
  },
  profileImage: {
    width: '100%',
    height: screenHeight('25%'),
    resizeMode: 'cover',
  },
  profileInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Size16,
    gap: Size4,
  },
  profileName: {
    color: '#fff',
    fontSize: fontSize14,
    fontWeight: 'bold',
  },
  profileLocation: {
    color: '#fff',
    fontSize: fontSize12,
    opacity: 0.9,
  },
});
