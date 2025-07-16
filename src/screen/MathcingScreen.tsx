import {
  ImageBackground,
  Image,
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { COLORS } from '../constants/AppColors';
import AppText from '../components/AppText';
import { fontSize34, Size12, Size25, SIZES } from '../constants/Sizes';
import AppButton from '../components/AppButton';
import { CloseIcon } from '../components/svg/SvgIcons2';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../constants/data';
import { useSelector } from 'react-redux';
import { imageUrl } from '../constants/functions';

const MathcingScreen = () => {
  // Animation values
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(50)).current;
  const buttonTranslateY = useRef(new Animated.Value(100)).current;
  const closeTranslateY = useRef(new Animated.Value(100)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageScale = useRef(new Animated.Value(0.8)).current;
  const navigation = useNavigation();
  const { acceptedUser } = useSelector((state: any) => state.entities.userReducer);
  console.log(acceptedUser, 'acceptedUser');
  useEffect(() => {
    // Animation sequence
    const animateSequence = () => {
      // 1. Text animation
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 2. Button and close button slide up
        Animated.parallel([
          Animated.timing(buttonTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(closeTranslateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // 3. Image appears last
          Animated.parallel([
            Animated.timing(imageOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(imageScale, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]).start();
        });
      });
    };

    // Start animation after component mounts
    const timer = setTimeout(animateSequence, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/Matchbanner.png')}
      style={styles.image}
    >
      <View />
      <View style={{ gap: Size25, alignItems: 'center' }}>
        <Animated.View
          style={[
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <AppText text="Its Match" textStyle={styles.text} />
        </Animated.View>

        <Animated.View
          style={[
            styles.matchContainer,
            {
              opacity: imageOpacity,
              transform: [{ scale: imageScale }],
            },
          ]}
        >
          <Image
            source={{ uri: `${imageUrl + acceptedUser.profileImage}` }}
            style={styles.matchImage}
            resizeMode="cover"
          />
        </Animated.View>

        <Animated.View
          style={[
            {
              transform: [{ translateY: buttonTranslateY }],
            },
          ]}
        >
          <AppButton
            title="Start Conversation"
            onPress={() => {
              // Navigate back to the main tab navigator and then to Chat tab
              (navigation as any).navigate(ROUTES.MAIN_TABS, {
                screen: ROUTES.CHAT,
              });
            }}
            buttonStyle={styles.connectButton}
            textStyle={styles.connectButtonText}
          />
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[
          styles.closeContainer,
          {
            transform: [{ translateY: closeTranslateY }],
          },
        ]}
        onPress={() => {
          (navigation as any).navigate(ROUTES.MAIN_TABS);
        }}
      >
        <CloseIcon width={20} height={20} color={COLORS.black} />
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default MathcingScreen;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.matchBg,
  },
  text: {
    color: COLORS.white,
    fontSize: fontSize34,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  matchContainer: {
    width: SIZES.width * 0.6,
    height: SIZES.height * 0.3,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  matchImage: {
    width: SIZES.width * 0.6,
    height: SIZES.height * 0.3,
  },
  connectButton: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    width: SIZES.width * 0.8,
  },
  connectButtonText: {
    color: COLORS.black,
  },
  closeContainer: {
    backgroundColor: COLORS.white,
    padding: Size12,
    borderRadius: SIZES.radius,
  },
});
