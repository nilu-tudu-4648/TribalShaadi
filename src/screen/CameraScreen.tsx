import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  launchCamera,
  ImageLibraryOptions,
  MediaType,
} from 'react-native-image-picker';
import { COLORS } from '../constants/AppColors';
import { Size20, Size25, SIZES } from '../constants/Sizes';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { getUserDetailsApi, getUserDetailsUrl, verifySelfieApi } from '../constants/functions';
import { useDispatch, useSelector } from 'react-redux';
import { setLoaderPayment, setSelfieVerify } from '../store/reducers/paymentReducer';
import { ROUTES } from '../constants/data';
import AppToast from '../components/AppToast';

const CameraScreen = () => {
  const navigation = useNavigation();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const base64Image = useRef<string | null>(null); // Store base64 image
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    // Auto launch camera when component mounts
    const options: ImageLibraryOptions = {
      mediaType: 'photo' as MediaType,
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    launchCamera(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
        navigation.goBack();
      } else if (response.errorMessage) {
        console.log('Camera Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to open camera. Please try again.');
        // navigation.goBack();
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          setCapturedImage(asset.uri);
          base64Image.current = asset.base64 || null;
          setShowConfirmation(true);
        }
      }
    });
  }, [navigation, user.id]);

  const handleRetake = () => {
    setCapturedImage(null);
    setShowConfirmation(false);

    // Launch camera again
    const options: ImageLibraryOptions = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
        navigation.goBack();
      } else if (response.errorMessage) {
        console.log('Camera Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to open camera. Please try again.');
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          setCapturedImage(asset.uri);
          setShowConfirmation(true);
          console.log('Photo captured:', asset.uri);
        }
      }
    });
  };

  const handleSubmit = async () => {
    dispatch(setLoaderPayment(true));
    navigation.goBack();
    try {
      const requestBody = {
        userId: user.id,
        selfieBase64: `${base64Image.current}`,
      };
      const response = await verifySelfieApi(requestBody, dispatch);
      if (response.verified) {
        (navigation.navigate as any)(ROUTES.MAIN_TABS, {
          screen: ROUTES.ACCOUNT_TAB,
        });
        await getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
        AppToast('Selfie verified successfully');
        dispatch(setSelfieVerify(response.verified));
      }
    } catch (error) {
      console.log(error, 'error handleSubmit');
    }
  };

  if (showConfirmation && capturedImage) {
    return (
      <View style={styles.confirmationContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

        {/* Captured Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        </View>

        {/* Confirmation Content */}
        <View style={styles.confirmationContent}>
          <AppText
            text="Happy with your photo?"
            textStyle={styles.confirmationTitle}
          />
          <AppText
            text="Remember, to verify yourself successfully, Your face must be clearly visible"
            textStyle={styles.confirmationSubtitle}
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <AppButton
              title="Submit"
              onPress={handleSubmit}
              buttonStyle={styles.submitButton}
              textStyle={styles.submitButtonText}
            />

            <TouchableOpacity
              onPress={handleRetake}
              style={styles.retakeButton}
              activeOpacity={0.8}
            >
              <AppText text="Retake" textStyle={styles.retakeButtonText} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  cameraViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Size25,
    gap: Size20,
  },
  cameraIcon: {
    fontSize: 80,
  },
  instructionText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  capturedImageContainer: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: COLORS.white,
  },
  capturedImage: {
    width: '90%',
    height: SIZES.height * 0.5,
    resizeMode: 'cover',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: Size25 * 2,
    left: Size25,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  // Confirmation Screen Styles
  confirmationContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  confirmationHeader: {
    paddingTop: Size25 + 20,
    paddingHorizontal: Size25,
    paddingBottom: Size20,
  },
  confirmationBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: Size25,
  },
  confirmationContent: {
    flex: 1,
    paddingHorizontal: Size25,
    alignItems: 'center',
    gap: Size25,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'center',
    paddingTop: Size25,
  },
  confirmationSubtitle: {
    fontSize: 16,
    color: COLORS.textGrey,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Size20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: Size20,
    paddingTop: Size25,
  },
  submitButton: {
    backgroundColor: COLORS.violet,
    width: '100%',
    borderRadius: 25,
    paddingVertical: 15,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  retakeButton: {
    paddingVertical: 15,
  },
  retakeButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '500',
  },
});
