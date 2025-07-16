import { StyleSheet, View, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '../constants/AppColors';
import {
  SIZES,
  fontSize16,
  fontSize20,
  Size10,
} from '../constants/Sizes';
import AppSafeView from '../components/AppSafeView';
import ProfileCard from '../components/Cards/ProfileCard';
import {
  baseUrl,
  passUserUrl,
  getMatchedUsersUrl,
  getProposalsSendByMeUrl,
  getUserDetailsUrl,
  sendProposalUrl,
  getReligionUrl,
  getMaritalStatusUrl,
  getCommunityUrl,
  getHeightUrl,
  getDietUrl,
  getPassedUsersUrl,
  getStatesUrl,
} from '../constants/functions';
import { useDispatch, useSelector } from 'react-redux';
import AppText from '../components/AppText';
import {
  cancelProposalRequestApi,
  getCurrentMatchedApi,
  getPassedUsersApi,
  getProposalsSendByMeApi,
  sentProposalApi,
  setMatchedUserApi,
} from '../store/reducers/userReducer';
import AppButton from '../components/AppButton';
import {
  getCommunity,
  getDiet,
  getHeight,
  getMaritalStatus,
  getReligion,
  getStates,
} from '../store/reducers/authReducer';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { matchedUsers, loader, currentMatchedUser } = useSelector(
    (state: any) => state.entities.userReducer,
  );
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Swipe animation values
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Reset animation values when index changes
  const resetAnimation = () => {
    translateX.value = withTiming(0);
    opacity.value = withTiming(1);
  };

  const handleSwipeRight = () => {
    if (matchedUsers && matchedUsers.length > 0) {
      if (currentIndex < matchedUsers.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Loop back to start when reaching the end
        setCurrentIndex(0);
      }
      setTimeout(resetAnimation, 100);
    }
  };

  const handleSwipeLeft = () => {
    if (matchedUsers && matchedUsers.length > 0) {
      if (currentIndex < matchedUsers.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Loop back to start when reaching the end
        setCurrentIndex(0);
      }
      setTimeout(resetAnimation, 100);
    }
  };

  // Gesture handler for swipe functionality
  const gestureHandler = Gesture.Pan()
    .activeOffsetX([-10, 10]) // <--- NEW  (horizontal only)
    .failOffsetY([-10, 10])
    .onStart(() => {
      // Optional: Add haptic feedback here
    })
    .onUpdate(event => {
      translateX.value = event.translationX;

      // Change opacity based on swipe distance
      const swipeThreshold = width * 0.3;
      if (Math.abs(event.translationX) > swipeThreshold) {
        opacity.value = 0.7;
      } else {
        opacity.value = 1;
      }
    })
    .onEnd(event => {
      const swipeThreshold = width * 0.3;

      if (event.translationX > swipeThreshold) {
        // Swipe right - Connect
        translateX.value = withTiming(width);
        runOnJS(handleSwipeRight)();
      } else if (event.translationX < -swipeThreshold) {
        // Swipe left - Decline
        translateX.value = withTiming(-width);
        runOnJS(handleSwipeLeft)();
      } else {
        // Reset if swipe wasn't far enough
        translateX.value = withTiming(0);
        opacity.value = withTiming(1);
      }
    });

  // Animated style for the profile card
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
  }, [dispatch]);
  useEffect(() => {
    dispatch(getCommunity(getCommunityUrl));
    dispatch(getMaritalStatus(getMaritalStatusUrl));
    dispatch(getReligion(getReligionUrl));
    dispatch(getHeight(getHeightUrl));
    dispatch(getDiet(getDietUrl));
    dispatch(getStates(getStatesUrl));
  }, [dispatch]);
  useEffect(() => {
    if (matchedUsers && matchedUsers.length > currentIndex) {
      dispatch(
        getCurrentMatchedApi(
          `${baseUrl}/${getUserDetailsUrl}id=${matchedUsers[currentIndex].id}`,
        ),
      );
    }
  }, [dispatch, matchedUsers, currentIndex]);

  const handleSendProposal = (id: string) => {
    try {
      dispatch(
        sentProposalApi(`${baseUrl}/${sendProposalUrl}`, { proposalUserId: id }),
      );
      dispatch(getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`));
      if (currentIndex < matchedUsers.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const handleCancelProposal = (id: string) => {
   try {
    dispatch(
      cancelProposalRequestApi(`${baseUrl}/${passUserUrl}`, {
        proposalUserId: id,
      }),
    );
    dispatch(getPassedUsersApi(`${baseUrl}/${getPassedUsersUrl}`));
    dispatch(getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`));
    if (currentIndex < matchedUsers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
    dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
   } catch (error) {
    console.log(error, 'error');
   }
  };

  return (
    <AppSafeView style={styles.container}>
        <>
          {/* Profile Card */}
          {currentMatchedUser && currentIndex < matchedUsers.length ? (
            <>
              <View style={styles.carouselContainer}>
                <GestureDetector gesture={gestureHandler}>
                  <Animated.View
                    style={[
                      styles.flexContainer,
                      styles.profileCardContainer,
                      animatedStyle,
                    ]}
                  >
                    <ProfileCard
                      name={
                        currentMatchedUser.firstName +
                        ' ' +
                        currentMatchedUser.lastName
                      }
                      age={currentMatchedUser.age}
                      height={currentMatchedUser.height}
                      religion={currentMatchedUser.religion}
                      caste={currentMatchedUser.community}
                      districtName={currentMatchedUser.districtName}
                      stateName={currentMatchedUser.stateName}
                      bio={currentMatchedUser.aboutMe}
                      image={currentMatchedUser.image}
                      isLoading={loader}
                      maritalStatus={currentMatchedUser.maritalStatus}
                      dob={currentMatchedUser.birthDate}
                      motherTongue={currentMatchedUser.motherTongue}
                      annualIncome={currentMatchedUser.annualIncome}
                      partnerExpectation={currentMatchedUser.about_lifepartener}
                      employedIn={currentMatchedUser.employedIn}
                      occupation={currentMatchedUser.occupation}
                      organizationName={currentMatchedUser.companyName}
                      settlingTime={currentMatchedUser.planingto_settle}
                      highestQualification={
                        currentMatchedUser.highestQualification
                      }
                      college={currentMatchedUser.college_name}
                      eatingHabits={currentMatchedUser.diet}
                      drinkingHabits={currentMatchedUser.drinking}
                      smokingHabits={currentMatchedUser.smoking}
                      kids={currentMatchedUser.kids}
                      interests={currentMatchedUser.intrests}
                    />
                  </Animated.View>
                </GestureDetector>
              </View>
              <View style={styles.floatingButtonContainer}>
                <AppButton
                  title="Decline"
                  onPress={() =>
                    handleCancelProposal(matchedUsers[currentIndex].id)
                  }
                  buttonStyle={styles.declineButton}
                  textStyle={styles.declineButtonText}
                />
                <AppButton
                  title="Connect"
                  onPress={() =>
                    handleSendProposal(matchedUsers[currentIndex].id)
                  }
                  buttonStyle={styles.connectButton}
                  textStyle={styles.connectButtonText}
                />
              </View>
            </>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../assets/images/ExhaustedImage.png')}
                style={{
                  width: SIZES.width * 0.2,
                  height: SIZES.height * 0.1,
                  resizeMode: 'contain',
                }}
              />
              <AppText
                text="All matches exhausted"
                textStyle={{
                  fontSize: fontSize20,
                  textAlign: 'center',
                  fontWeight: '700',
                }}
              />
              <AppText
                text="Come back and check tomorrow for more matches"
                textStyle={{
                  fontSize: fontSize16,
                  color: COLORS.textInactive,
                  textAlign: 'center',
                  fontWeight: '600',
                }}
              />
            </View>
          )}
        </>
    </AppSafeView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    gap: SIZES.base,
  },
  logo: {
    width: SIZES.h4,
    height: SIZES.h4,
    resizeMode: 'contain',
  },
  topBarTitle: {
    fontSize: fontSize20,
    fontWeight: '700',
    color: COLORS.textBlack,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: Size10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: SIZES.padding,
  },
  declineButton: {
    backgroundColor: COLORS.white,
    width: '45%',
    elevation: 2,
    borderRadius: Size10,
  },
  declineButtonText: {
    color: COLORS.declineButton,
    fontSize: fontSize16,
    fontWeight: '600',
  },
  connectButton: {
    backgroundColor: COLORS.violet,
    width: '45%',
    elevation: 2,
    borderRadius: Size10,
  },
  connectButtonText: {
    color: COLORS.white,
  },
  carouselContainer: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
  },
  profileCardContainer: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
