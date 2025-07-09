import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { COLORS } from '../../constants/AppColors';
import { fontSize14, fontSize16, Size4, Size8, Size12, Size16, fontSize12 } from '../../constants/Sizes';
import AppText from '../AppText';
import { imageUrl } from '../../constants/functions';

interface SentCardProps {
  item: {
    name?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    religionName?: string;
    location?: string;
    image?: any;
    stateName?: string;
  };
  onPress?: () => void;
}

const SentCard: React.FC<SentCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image  source={{ uri: `${imageUrl + item.image}` }} style={styles.profileImage} />
      <View style={styles.infoContainer}>
        <AppText
          text={`${item.firstName || ''} ${item.lastName || ''}, ${item.age || ''}`}
          textStyle={styles.nameAndAge}
        />
        <View style={styles.detailRow}>
          <AppText text="\u26EA" textStyle={styles.icon} />
          <AppText
            text={item.religionName || ''}
            textStyle={styles.detailText}
          />
        </View>
        <View style={styles.detailRow}>
           <AppText
            text={item.stateName || ''}
            textStyle={styles.detailText}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SentCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: Size12,
    padding: Size16,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
    gap: Size16,
    borderWidth: .7,
    borderColor: COLORS.borderBottom2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: Size8,
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: Size4,
  },
  nameAndAge: {
    fontSize: fontSize16,
    fontWeight: 'bold',
    color: COLORS.textBlack,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Size8,
  },
  icon: {
    fontSize: fontSize12,
    color: COLORS.textGrey,
  },
  detailText: {
    fontSize: fontSize14,
    color: COLORS.textGrey,
    flexShrink: 1,
  },
});