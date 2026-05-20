import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import {
  fontSize16,
  fontSize24,
  lignHeight24,
  lignHeight72,
  lignHeight20,
  Size8,
  Size12,
  Size16,
  Size18,
  fontSize12,
  Size10,
  SIZES,
  Size20,
  lignHeight53,
  Size14,
} from '../constants/Sizes';
import { COLORS } from '../constants/AppColors';
import HeaderBack from '../components/HeaderBack';
import AppButton from '../components/AppButton';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import AppText from '../components/AppText';
import GradientLoader from '../components/GradientLoader';
import { CloseIcon } from '../components/svg/SvgIcons';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserDetailsApi,
  getUserImageListApi,
  navigateToLastScreen,
  uploadImage,
} from '../constants/functions';
import { getUserDetailsUrl } from '../constants/functions';
import AppToast from '../components/AppToast';
import AlertBottomSheet from '../components/BottomSheets/AlertBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { ASYNC_VARIBLES, ROUTES } from '../constants/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../constants/globalStyles';
import { usePostHog } from 'posthog-react-native';

const UploadImageScreen = () => {
  const [selectedImages, setSelectedImages] = useState<
    { uri: string; base64: string }[]
  >([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [isAIViewing, setIsAIViewing] = useState(false);
  const [isImageValid, setIsImageValid] = useState(true);
  const [isImageValid2, setIsImageValid2] = useState(true);
  const [userImageList, setUserImageList] = useState<any[]>([]);

  const { user, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const posthog = usePostHog();

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      bottomSheetRef.current?.close();
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    getUserImageListApi(user.id, setUserImageList);
  }, []);

  const handleImageUpload = async (index: number) => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 1,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        AppToast('Failed to select image. Please try again.');
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri && asset.base64) {
          // Update the selected images first
          const newImages = [...selectedImages];
          newImages[index] = { uri: asset.uri, base64: asset.base64 };
          setSelectedImages(newImages);
          try {
            setUploadingIndex(index);
            let requestBody;

            if (index === 0) {
              setIsAIViewing(true);
              // First image format
              requestBody = {
                id: user.id,
                image: `data:image/jpeg;base64,${asset.base64}`,
              };
              console.log(requestBody, 'requestBody for first image');
              await uploadImage(
                { ...requestBody, imageIndex: index },   // 👈 PASS FAILED INDEX
                dispatch,
                true,
                setIsImageValid,
                setIsAIViewing,
                handleRemoveImage,
              );

            } else {
              // Second and third image format - upload the current image
              // Gallery images: selectedImages[1] maps to userImageList[0], selectedImages[2] maps to userImageList[1]
              const galleryIndex = index - 1;

              requestBody = {
                userId: user.id,
                image: `data:image/jpeg;base64,${asset.base64}`,
              } as any;

              // Only include operationImageId if editing an existing image
              if (userImageList[galleryIndex]?.id) {
                requestBody.operationImageId = userImageList[galleryIndex].id;
              }

              console.log(requestBody, `requestBody for gallery image at index ${index}`);
              setIsAIViewing(true);
              await uploadImage(
                { ...requestBody, imageIndex: index },   // 👈 PASS INDEX 1 or 2
                dispatch,
                false,
                setIsImageValid2,
                setIsAIViewing,
                handleRemoveImage,   // 👈 use single-image remover
                setUserImageList as any,
              )

            }
          } catch (error) {
            console.log('NETWORK ERROR:', error);
            AppToast('Failed to upload image. Please try again.');
            // Remove the image from state if upload failed
            const failedImages = [...selectedImages];
            failedImages[index] = { uri: '', base64: '' };
            setSelectedImages(failedImages);
          } finally {
            setUploadingIndex(null);
          }
        }
      }
    });
  };
  const handleRemoveImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages[index] = { uri: '', base64: '' };
    setSelectedImages(newImages);
  };
  const handleContinue = async () => {
    try {
      posthog.capture('photos_uploaded')
      await getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      await AsyncStorage.setItem(ASYNC_VARIBLES.ALL_IMAGES_UPLOADED, 'true');
    } catch (error) {
      console.log('NETWORK ERROR:', error);
      AppToast('Failed to update user details. Please try again.');
    } finally {
      navigateToLastScreen(navigation, ROUTES.SELECT_INTERESTS);
    }
  };

  // Helper function to count valid images
  const getValidImageCount = () => {
    return selectedImages.filter(img => img?.uri && img.uri !== '').length;
  };

  const renderImageSlot = (index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.imageSlot,
        selectedImages[index]?.uri
          ? styles.imageSlotWithImage
          : styles.imageSlotEmpty,
        uploadingIndex === index && styles.imageSlotUploading,
      ]}
      onPress={() => handleImageUpload(index)}
      disabled={uploadingIndex === index}
    >
      {selectedImages[index]?.uri ? (
        <>
          <ImageBackground
            source={{ uri: selectedImages[index].uri }}
            style={styles.uploadedImage}
            resizeMode="cover"
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => handleRemoveImage(index)}
            >
              <CloseIcon />
            </TouchableOpacity>
            {uploadingIndex === index && (
              <View style={styles.uploadingOverlay}>
                <GradientLoader size={20} />
              </View>
            )}
          </ImageBackground>
        </>
      ) : (
        <View style={styles.cameraIcon}>
          <Image
            source={require('../assets/images/plus.png')}
            style={styles.cameraIconImage}
          />
          {uploadingIndex === index && (
            <View style={styles.uploadingOverlay}>
              <GradientLoader size={20} />
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
  const isButtonDisabled = !isImageValid || !isImageValid2 || getValidImageCount() !== 3;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <HeaderBack
          onPress={() => navigateToLastScreen(navigation, ROUTES.ABOUT_PARTNER)}
        />

        <View style={globalStyles.headerSection}>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <AppText
              text="Pick your best moments"
              textStyle={globalStyles.title}
            />
            <AppText
              text="Please upload a clear photo of your face, looking at the camera"
              textStyle={globalStyles.subtitle}
            />
          </View>
        </View>

        {/* Image Upload Section */}
        <View style={styles.imageSection}>
          <View style={styles.imageGrid}>
            {[0, 1, 2].map(index => renderImageSlot(index))}
          </View>
        </View>

        {/* Photo Verification Warning */}
        <View style={styles.descriptionBox}>
          <Image
            source={require('../assets/images/Group.png')}
            style={styles.sheidImage}
          />
          <View style={styles.descriptionTextContainer}>
            <AppText
              text="Read Guidelines"
              onPress={() => bottomSheetRef.current?.snapToIndex(0)}
              textStyle={styles.boldText}
            />
          </View>
        </View>
        {isAIViewing && (
          <>
            {/* Loading Indicator */}
            <View style={styles.loaderContainer}>
              <GradientLoader size={lignHeight53} />
            </View>
            <Image
              source={require('../assets/images/aireview.png')}
              style={styles.warningImage}
            />
          </>
        )}
        {/* Spacer */}
        <View style={styles.spacer} />
        {(!isImageValid || !isImageValid2) && (
          <Image
            source={require('../assets/images/imagevalid.png')}
            style={styles.image}
          />
        )}
        {/* Continue Button */}
        <AppButton
          title="Continue"
          onPress={handleContinue}
          isLoading={loader}
          isButtonDisabled={isButtonDisabled}
          buttonStyle={[
            globalStyles.continueButton,
            isButtonDisabled
              ? globalStyles.continueButtonInactive
              : globalStyles.continueButtonActive,
          ]}
          textStyle={[
            globalStyles.continueButtonText,
            isButtonDisabled
              ? globalStyles.continueButtonTextInactive
              : globalStyles.continueButtonTextActive,
          ]}
        />
      </View>
      <AlertBottomSheet bottomSheetRef={bottomSheetRef} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: lignHeight24,
    paddingVertical: lignHeight24,
    gap: lignHeight20,
    paddingTop: lignHeight72,
  },
  titleSection: {
    gap: Size8,
  },
  title: {
    fontSize: fontSize24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: fontSize16,
    color: COLORS.textGrey,
    lineHeight: Size20,
  },
  imageSection: {
    alignItems: 'center',
  },
  imageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  imageSlot: {
    width: SIZES.width * 0.26,
    height: SIZES.width * 0.26,
    borderRadius: Size12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGreyBackground,
    overflow: 'visible',
  },
  imageSlotWithImage: {
    borderWidth: 0,
  },
  imageSlotEmpty: {
    borderWidth: 0,
  },
  imageSlotUploading: {
    opacity: 0.5,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: Size12,
    alignItems: 'flex-end',
    opacity: 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 18,
    padding: 2,
  },
  cameraIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  spacer: {
    flex: 1,
  },
  descriptionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Size12,
    gap: Size8,
    alignSelf: 'center',
  },
  sheidImage: {
    width: Size14,
    height: Size14,
    resizeMode: 'contain',
  },
  descriptionTextContainer: {
    // flex: 1,
    // width: '100%',
  },
  descriptionText: {
    fontSize: fontSize12,
    color: COLORS.violet,
    textAlign: 'left',
    lineHeight: Size16,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Size10,
  },
  warningImage: {
    width: '100%',
    height: SIZES.height * 0.07,
    resizeMode: 'contain',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: SIZES.height * 0.14,
    resizeMode: 'contain',
  },
  boldText: {
    fontSize: fontSize12,
    fontWeight: '600',
    color: COLORS.violet,
  },
  cameraIconImage: {
    width: Size18 * 2,
    height: Size18 * 2,
    resizeMode: 'contain',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 50,
    height: 20,
    opacity: 0.9,
  },
});

export default UploadImageScreen;
