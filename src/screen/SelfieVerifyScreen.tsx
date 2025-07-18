import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppSafeView from '../components/AppSafeView';
import AppText from '../components/AppText';
import AppLinearButton from '../components/AppLinearButton';
import { COLORS } from '../constants/AppColors';
import {
  fontSize16,
  fontSize24,
  fontSize14,
  Size8,
  Size12,
  Size16,
  Size20,
  lignHeight20,
  lignHeight24,
  lignHeight72,
  screenWidth,
} from '../constants/Sizes';
import { ROUTES } from '../constants/data';

const SelfieVerifyScreen = () => {
  const navigation = useNavigation();

  const handleTakePhoto = () => {
    (navigation as any).navigate(ROUTES.STACK, {
      screen: ROUTES.CAMERA,
    });
  };

  const handleMaybeLater = () => {
    (navigation.navigate as any)(ROUTES.MAIN_TABS, {
      screen: ROUTES.ACCOUNT_TAB,
    });
  };

  return (
    <AppSafeView style={styles.container}>
      <View style={styles.content}>

        {/* Selfie Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
              }}
              style={styles.selfieImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Title */}
        <AppText text="How it works?" textStyle={styles.title} />

        {/* Description */}
        <AppText 
          text="We use your photo to confirm you're you. If you match, boom you're verified." 
          textStyle={styles.description} 
        />

        {/* Requirements List */}
        <View style={styles.requirementsContainer}>
          <View style={styles.requirementItem}>
            <View style={styles.bulletPoint} />
            <AppText 
              text="We use facial recognition to match your selfie with your profile photo" 
              textStyle={styles.requirementText} 
            />
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.bulletPoint} />
            <AppText 
              text="Your face is clearly visible with good lighting" 
              textStyle={styles.requirementText} 
            />
          </View>

          <View style={styles.requirementItem}>
            <View style={styles.bulletPoint} />
            <AppText 
              text="Landscapes, celebrities, baby or animal pictures aren't added to your profile" 
              textStyle={styles.requirementText} 
            />
          </View>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Take Photo Button */}
        <AppLinearButton
          title="Take photo"
          onPress={handleTakePhoto}
          buttonStyle={styles.takePhotoButton}
          textStyle={styles.takePhotoButtonText}
          linearGradientColors={[COLORS.violet, '#9B5DE5']}
        />

        {/* Maybe Later Link */}
        <TouchableOpacity 
          onPress={handleMaybeLater}
          style={styles.maybeLaterContainer}
        >
          <AppText text="May be later" textStyle={styles.maybeLaterText} />
        </TouchableOpacity>
      </View>
    </AppSafeView>
  );
};

export default SelfieVerifyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: lignHeight24,
    paddingTop: lignHeight72,
    gap: Size20,
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageWrapper: {
    width: screenWidth('60%'),
    height: screenWidth('75%'),
    borderRadius: Size20,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  selfieImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: fontSize24,
    fontWeight: 'bold',
    color: COLORS.textBlack,
    textAlign: 'left',
  },
  description: {
    fontSize: fontSize16,
    color: COLORS.textGrey,
    lineHeight: lignHeight20,
    textAlign: 'left',
  },
  requirementsContainer: {
    gap: Size16,
    paddingVertical: Size8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Size12,
  },
  bulletPoint: {
    width: Size8,
    height: Size8,
    borderRadius: Size8 / 2,
    backgroundColor: COLORS.textBlack,
    top: Size8,
  },
  requirementText: {
    flex: 1,
    fontSize: fontSize14,
    color: COLORS.textBlack,
    lineHeight: lignHeight20,
  },
  spacer: {
    // flex: 1,
  },
  takePhotoButton: {
  },
  takePhotoButtonText: {
    fontSize: fontSize16,
    fontWeight: '600',
    color: COLORS.white,
  },
  maybeLaterContainer: {
    alignItems: 'center',
  },
  maybeLaterText: {
    fontSize: fontSize16,
    color: COLORS.textGrey,
    textAlign: 'center',
  },
});