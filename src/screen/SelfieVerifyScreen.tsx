import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
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
import { usePostHog } from 'posthog-react-native';

const SelfieVerifyScreen = () => {
  const navigation = useNavigation();
  const posthog = usePostHog();
  const { loader, selfieVerify } = useSelector(
    (state: any) => state.entities.paymentReducer,
  );
  const dispatch = useDispatch();
  const handleTakePhoto = () => {
    posthog.capture('retry_verification');
    (navigation as any).navigate(ROUTES.STACK, {
      screen: ROUTES.CAMERA,
    });
    delay(1000).then(() => {
      dispatch(setSelfieVerify(true));
    });
  };

  const handleMaybeLater = () => {
    posthog.capture('discarded_verification');
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
        <View style={styles.loaderContainer}>
          <GradientLoader size={SIZES.h1} />
          <Image
            source={require('../assets/images/verifytext.png')}
            style={styles.verifyImage}
          />
        </View>
      ) : (
        <AppSafeView style={styles.container}>
          {!selfieVerify ? (
            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={styles.unverifiedScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.unverifiedImageContainer}>
                <Image
                  source={require('../assets/images/unverify.png')}
                  style={[styles.verifyImage, styles.unverifiedImageHeight]}
                />
                <Image
                  source={require('../assets/images/notyou.png')}
                  style={styles.verifyImage}
                />
                <View style={styles.buttonContainer}>
                  <AppButton
                    title="Retry"
                    onPress={handleTakePhoto}
                    buttonStyle={[styles.takePhotoButton, styles.retryButton]}
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
              <View style={styles.errorImagesContainer}>
                <Image
                  source={require('../assets/images/photoerror1.png')}
                  style={styles.photoError1}
                />
                <Image
                  source={require('../assets/images/photoerror2.png')}
                  style={styles.photoError2}
                />
              </View>
            </ScrollView>
          ) : (
            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
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

              {/* Spacer for flexible spacing */}
              <View style={styles.flexSpacer} />

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
            </ScrollView>
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: lignHeight24,
    paddingTop: lignHeight24,
    gap: Size20,
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageWrapper: {
    width: screenWidth('55%'),
    height: screenWidth('65%'),
    maxHeight: 300,
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
  flexSpacer: {
    minHeight: Size20 * 2,
  },
  takePhotoButton: {
    borderRadius: Size20 * 5,
    width: '70%',
    maxWidth: 280,
    alignSelf: 'center',
    backgroundColor: COLORS.violet,
    // marginTop: Size12,
  },
  takePhotoButtonText: {
    fontSize: fontSize16,
    fontWeight: '600',
    color: COLORS.white,
  },
  maybeLaterContainer: {
    alignItems: 'center',
    paddingVertical: Size12,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  unverifiedScrollContent: {
    flexGrow: 1,
    paddingHorizontal: lignHeight24,
    paddingTop: lignHeight24,
    paddingBottom: lignHeight24,
    justifyContent: 'space-between',
    gap: Size20,
  },
  unverifiedImageContainer: {
    gap: Size20 * 1.5,
    alignItems: 'center',
    paddingTop:lignHeight24*3
  },
  unverifiedImageHeight: {
    height: 120,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  retryButton: {
    marginBottom: Size20,
  },
  errorImagesContainer: {
    width: '100%',
    gap: Size12,
    alignItems: 'center',
  },
  photoError1: {
    width: screenWidth('100%'),
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
  photoError2: {
    width: screenWidth('85%'),
    height: 70,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
