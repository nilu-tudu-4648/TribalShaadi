import React, { useState, useEffect } from 'react';
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

const CameraScreen = () => {
  const navigation = useNavigation();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // Auto launch camera when component mounts
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
        // navigation.goBack();
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          setCapturedImage(asset.uri);
          setShowConfirmation(true);
          // You can handle the captured image here
          console.log('Photo captured:', asset.uri);
          
          // Navigate back after a brief preview
          // setTimeout(() => {
          //   navigation.goBack();
          // }, 2000);
        }
      }
    });
  }, [navigation]);

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

  const handleSubmit = () => {
    // Handle photo submission logic here
    console.log('Photo submitted:', capturedImage);
    // You can pass the image back to the previous screen or handle upload
    navigation.goBack();
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
              <AppText 
                text="Retake" 
                textStyle={styles.retakeButtonText} 
              />
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