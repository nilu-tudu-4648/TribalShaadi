import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppSafeView from '../components/AppSafeView';
import AppText from '../components/AppText';
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
  SIZES,
} from '../constants/Sizes';
import { ROUTES } from '../constants/data';
import { useDispatch, useSelector } from 'react-redux';
import GradientLoader from '../components/GradientLoader';
import AppButton from '../components/AppButton';
import { setSelfieVerify } from '../store/reducers/paymentReducer';
import { delay } from '../constants/functions';

const SelfieVerifyScreen = () => {
  const navigation = useNavigation();
  const { loader, selfieVerify } = useSelector(
    (state: any) => state.entities.paymentReducer,
  );
  const dispatch = useDispatch();
  const handleTakePhoto = () => {
    (navigation as any).navigate(ROUTES.STACK, {
      screen: ROUTES.CAMERA,
    });
  };

  const handleMaybeLater = () => {
    (navigation.navigate as any)(ROUTES.MAIN_TABS, {
      screen: ROUTES.ACCOUNT_TAB,
    });
    delay(1000).then(() => {
      dispatch(setSelfieVerify(true));
    });
  };
  return (
    <>
      {loader ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: SIZES.padding,
          }}
        >
          <GradientLoader size={SIZES.h1} />
          <Image
            source={require('../assets/images/verifytext.png')}
            style={styles.verifyImage}
          />
        </View>
      ) : (
        <AppSafeView style={styles.container}>
          {!selfieVerify ? (
            <View
              style={[
                styles.content,
                {
                  justifyContent: 'space-between',
                  paddingVertical: lignHeight72,
                },
              ]}
            >
              <View style={{ gap: Size20 * 3, alignItems: 'center' }}>
                <Image
                  source={require('../assets/images/unverify.png')}
                  style={[styles.verifyImage, { height: '20%' }]}
                />
                <Image
                  source={require('../assets/images/notyou.png')}
                  style={styles.verifyImage}
                />
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <AppButton
                    title="Retry"
                    onPress={handleTakePhoto}
                    buttonStyle={[
                      styles.takePhotoButton,
                      { marginBottom: Size20 },
                    ]}
                    textStyle={styles.takePhotoButtonText}
                  />
                  <Pressable onPress={handleMaybeLater}>
                    <AppText
                      text="Maybe Later "
                      textStyle={styles.maybeLaterText}
                    />
                  </Pressable>
                </View>
              </View>
              <Image
                source={require('../assets/images/keepinmind.png')}
                style={styles.verifyImage}
              />
            </View>
          ) : (
            <View style={styles.content}>
              {/* Selfie Image */}
              <View style={styles.imageContainer}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={require('../assets/images/selfieImage.png')}
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
              <AppButton
                title="Take photo"
                onPress={handleTakePhoto}
                buttonStyle={styles.takePhotoButton}
                textStyle={styles.takePhotoButtonText}
              />

              {/* Maybe Later Link */}
              <TouchableOpacity
                onPress={handleMaybeLater}
                style={styles.maybeLaterContainer}
              >
                <AppText
                  text="May be later"
                  textStyle={styles.maybeLaterText}
                />
              </TouchableOpacity>
            </View>
          )}
        </AppSafeView>
      )}
    </>
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
    flex: 1,
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
    color: COLORS.black,
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
    borderRadius: Size20 * 5,
    width: '50%',
    alignSelf: 'center',
    backgroundColor: COLORS.violet,
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
    color: COLORS.black,
    textAlign: 'center',
  },
  verifyImage: {
    width: '95%',
    height: 100,
    resizeMode: 'contain',
  },
});
