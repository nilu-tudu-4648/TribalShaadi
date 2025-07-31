import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { COLORS } from '../constants/AppColors';
import { fontSize14, Size10 } from '../constants/Sizes';

const NetworkAlert: React.FC = () => {
  const { isOffline, isConnected } = useNetworkStatus();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const [showAlert, setShowAlert] = React.useState(false);

  useEffect(() => {
    if (isOffline) {
      // Show native alert for immediate user awareness
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.',
        [{ text: 'OK' }],
        { cancelable: true }
      );
      
      // Also show the persistent banner
      setShowAlert(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (isConnected && showAlert) {
      // Hide the banner when connection is restored
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowAlert(false);
      });
    }
  }, [isOffline, isConnected, slideAnim, showAlert]);

  if (!showAlert) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.text}>
        ⚠️ No Internet Connection
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: StatusBar.currentHeight || 0,
    left: 0,
    right: 0,
    backgroundColor: '#ff4444',
    paddingVertical: Size10,
    paddingHorizontal: 16,
    zIndex: 9999,
    elevation: 10,
  },
  text: {
    color: COLORS.white,
    fontSize: fontSize14,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default NetworkAlert;