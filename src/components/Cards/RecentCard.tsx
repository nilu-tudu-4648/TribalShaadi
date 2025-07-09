import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { fontSize14, fontSize16, Size16, Size4, screenHeight } from '../../constants/Sizes';
import AppText from '../AppText';

const RecentCard = ({ item, onPress }: { item: any, onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.profileCard}>
      <Image source={item.image} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <AppText text={item.name} textStyle={styles.profileName} />
        <AppText text={item.location} textStyle={styles.profileLocation} />
      </View>
    </TouchableOpacity>
  );
};

export default RecentCard;

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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    gap: Size4,
  },
  profileName: {
    color: '#fff',
    fontSize: fontSize16,
    fontWeight: 'bold',
  },
  profileLocation: {
    color: '#fff',
    fontSize: fontSize14,
    opacity: 0.9,
  },
});
