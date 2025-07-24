import React, { useState } from 'react';
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
  fontSize14,
  lignHeight24,
  lignHeight72,
  lignHeight20,
  Size8,
  Size12,
  Size16,
  Size40,
  Size18,
  fontSize12,
  lignHeight43,
  Size14,
  Size10,
  SIZES,
  Size20,
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
import { getUserDetailsApi, uploadImage } from '../constants/functions';
import { getUserDetailsUrl } from '../constants/functions';
import AppToast from '../components/AppToast';

const UploadImageScreen = () => {
  const [selectedImages, setSelectedImages] = useState<
    { uri: string; base64: string }[]
  >([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const { user, loader } = useSelector(
    (state: any) => state.entities.authReducer,
  );
  const dispatch = useDispatch();

  const handleImageUpload = async (index: number) => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
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
          // const resp = await validateImage(asset.base64);
          // console.log('resp: ', resp);
          // Upload the image immediately
          try {
            setUploadingIndex(index);
            let requestBody;

            if (index === 0) {
              // First image format
              requestBody = {
                id: user.id,
                image: `data:image/jpeg;base64,${asset.base64}`,
              };
              console.log(requestBody, 'requestBody for first image');
              await uploadImage(requestBody, dispatch, true);
            } else {
              // Second and third image format - only call API when both images are selected
              const updatedImages = [...newImages];

              // Check if both second and third images are now selected
              const hasSecondImage = updatedImages[1]?.base64;
              const hasThirdImage = updatedImages[2]?.base64;

              if (hasSecondImage && hasThirdImage) {
                // Both images are selected, make the API call
                requestBody = {
                  userId: user.id,
                  id: user.id,
                  images: [
                    `data:image/jpeg;base64,${updatedImages[1].base64}`,
                    `data:image/jpeg;base64,${updatedImages[2].base64}`,
                  ],
                };
                console.log(
                  requestBody,
                  'requestBody for both additional images',
                );
                await uploadImage(requestBody, dispatch);
              } else {
                // Only one image selected, don't make API call yet
                console.log(
                  'Waiting for both additional images to be selected',
                );
              }
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
      // Call update user API to refresh user details
      await getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      // Navigate to next screen
    } catch (error) {
      console.log('NETWORK ERROR:', error);
      AppToast('Failed to update user details. Please try again.');
    }
  };

  // Helper function to count valid images
  const getValidImageCount = () => {
    return selectedImages.filter(img => img?.uri && img.uri !== '').length;
  };

  const renderImageSlot = (index: number) => (
    <TouchableOpacity
      key={index}
      style={{
        ...styles.imageSlot,
        borderWidth: selectedImages[index]?.uri ? 0 : 1,
        opacity: uploadingIndex === index ? 0.5 : 1,
      }}
      onPress={() => handleImageUpload(index)}
      disabled={uploadingIndex === index}
    >
      {selectedImages[index]?.uri ? (
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
      ) : (
        <View style={styles.cameraIcon}>
          <AppText text="📷" textStyle={styles.cameraIconText} />
          {uploadingIndex === index && (
            <View style={styles.uploadingOverlay}>
              <GradientLoader size={20} />
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <HeaderBack />

        {/* Title Section */}
        <View style={styles.titleSection}>
          <AppText text="Add your best photos" textStyle={styles.title} />
          <AppText
            text="You can change photos later in Edit Profile"
            textStyle={styles.subtitle}
          />
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
              text="Upload a clear photo of your face to enhance profile verification. This may also be needed for AI-powered selfie verification."
              textStyle={styles.descriptionText}
            />
          </View>
        </View>

        {/* Loading Indicator */}
        {/* <View style={styles.loaderContainer}>
          <GradientLoader size={lignHeight53} />
        </View> */}

        {/* AI Review Section */}
        {/* <View style={styles.warningContainer}>
          <Image
            source={require('../assets/images/shield.png')}
            style={styles.warningImage}
          />
          <View style={styles.warningTextContainer}>
            <AppText
              text="Our AI is reviewing your photos..."
              textStyle={styles.warningText}
            />
            <AppText
              text="Please wait while we ensure your profile meets our guidelines"
              textStyle={styles.warningSubText}
            />
          </View>
        </View> */}
        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Continue Button */}
        <AppButton
          title="Continue"
          onPress={handleContinue}
          isLoading={loader}
          isButtonDisabled={getValidImageCount() < 3}
          buttonStyle={[
            styles.continueButton,
            getValidImageCount() < 3
              ? styles.continueButtonDisabled
              : styles.continueButtonActive,
          ]}
          textStyle={[
            styles.continueButtonText,
            getValidImageCount() < 3
              ? styles.continueButtonTextDisabled
              : styles.continueButtonTextActive,
          ]}
        />
      </View>
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
    gap: Size16,
  },
  imageSlot: {
    width: '30%',
    height: SIZES.height * 0.14,
    borderRadius: Size12,
    borderColor: COLORS.violet,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGreyBackground,
    overflow: 'hidden',
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
    borderRadius: 12,
    padding: 4,
  },
  cameraIcon: {
    width: Size40,
    height: Size40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconText: {
    fontSize: fontSize24,
    opacity: 0.6,
  },
  warningContainer: {
    flexDirection: 'row',
    paddingHorizontal: Size16,
    paddingVertical: Size12 * 3,
    borderRadius: Size8,
    gap: Size12,
    alignItems: 'center',
  },
  warningTextContainer: {
    width: '85%',
  },
  warningText: {
    fontSize: fontSize14,
    color: COLORS.textBlack,
    lineHeight: lignHeight20,
    fontWeight: '600',
  },
  warningSubText: {
    fontSize: fontSize12,
    color: COLORS.grey,
    lineHeight: Size14,
  },
  spacer: {
    flex: 1,
  },
  continueButton: {
    borderRadius: Size8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.disabledBG,
  },
  continueButtonActive: {
    backgroundColor: COLORS.black,
  },
  continueButtonText: {
    fontSize: fontSize16,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: COLORS.grey,
  },
  continueButtonTextActive: {
    color: COLORS.white,
  },
  descriptionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightgreen,
    borderRadius: Size12,
    padding: Size16,
    gap: Size8,
  },
  sheidImage: {
    width: Size18,
    height: Size18,
    resizeMode: 'contain',
  },
  descriptionTextContainer: {
    flex: 1,
  },
  descriptionText: {
    fontSize: fontSize12,
    color: COLORS.black,
    textAlign: 'left',
    lineHeight: Size16,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Size10,
  },
  warningImage: {
    width: lignHeight43,
    height: lignHeight43,
    resizeMode: 'contain',
  },
  loader: {
    fontSize: fontSize16 * 5,
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
});

export default UploadImageScreen;
