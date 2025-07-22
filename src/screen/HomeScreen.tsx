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
import { SIZES, fontSize16, fontSize20, Size10 } from '../constants/Sizes';
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
  getGalleryImageListUrl,
} from '../constants/functions';
import { useDispatch, useSelector } from 'react-redux';
import AppText from '../components/AppText';
import {
  cancelProposalRequestApi,
  getCurrentMatchedApi,
  getCurrentMatchedUserGalleryImageListApi,
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
import AppLoader from '../components/AppLoader';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const {
    matchedUsers,
    loader,
    currentMatchedUser,
    currentMatchedUserGalleryImageList,
  } = useSelector((state: any) => state.entities.userReducer);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  // Swipe animation values
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const entryX = useSharedValue(0);
  // Reset animation values when index changes
  const handleSwipeRight = () => {
    if (matchedUsers.length === 0 || matchedUsers.length === 1) return;
    setCurrentIndex(prev => (prev + 1) % matchedUsers.length);
  };

  const handleSwipeLeft = () => {
    if (matchedUsers.length === 0 || matchedUsers.length === 1) return;
    setCurrentIndex(prev => (prev + 1) % matchedUsers.length);
  };

  // Gesture handler for swipe functionality
  const gestureHandler = Gesture.Pan()
    .activeOffsetX([-10, 10]) // <--- NEW  (horizontal only)
    .failOffsetY([-10, 10])
    .onStart(() => {
      // Optional: Add haptic feedback here
    })
    .onUpdate(event => {
      // Don't allow swipe visual feedback if there's only one user
      if (matchedUsers.length <= 1) return;
      
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
      // Don't allow swipe actions if there's only one user
      if (matchedUsers.length <= 1) {
        translateX.value = withTiming(0);
        opacity.value = withTiming(1);
        return;
      }

      const swipeThreshold = width * 0.3;

      if (event.translationX > swipeThreshold) {
        // ACCEPT  – next card must come from LEFT
        entryX.value = -width; // start off-screen left
        translateX.value = withTiming(width, { duration: 250 }); // current card exits right
        opacity.value = withTiming(0, { duration: 250 });
        runOnJS(handleSwipeRight)(); // your original function
      } else if (event.translationX < -swipeThreshold) {
        // DECLINE – next card must come from RIGHT
        entryX.value = width; // start off-screen right
        translateX.value = withTiming(-width, { duration: 250 }); // current card exits left
        opacity.value = withTiming(0, { duration: 250 });
        runOnJS(handleSwipeLeft)(); // your original function
      } else {
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
  // 3.  whenever currentIndex changes -> animate in
  useEffect(() => {
    // Ensure proper animation sequence
    translateX.value = entryX.value; // off-screen direction
    opacity.value = 0;
    
    // Animate to center position
    translateX.value = withTiming(0, { duration: 250 });
    opacity.value = withTiming(1, { duration: 250 });
    
    // Reset entryX to 0 after animation to prevent gaps
    setTimeout(() => {
      entryX.value = 0;
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);
  useEffect(() => {
    dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
  }, [dispatch]);
  // Reset currentIndex if it goes out of bounds when matchedUsers array changes
  useEffect(() => {
    if (matchedUsers.length > 0 && currentIndex >= matchedUsers.length) {
      setCurrentIndex(0);
    }
  }, [matchedUsers.length, currentIndex]);

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
      dispatch(
        getCurrentMatchedUserGalleryImageListApi(
          `${baseUrl}/${getGalleryImageListUrl}`,
          {
            userId: matchedUsers[currentIndex].id,
          },
        ),
      );
    }
  }, [dispatch, matchedUsers, currentIndex]);

  const handleSendProposal = async (id: string) => {
    try {
      dispatch(
        sentProposalApi(`${baseUrl}/${sendProposalUrl}`, {
          proposalUserId: id,
        }),
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch(
        getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`),
      );
      // Reset currentIndex to 0 to avoid out of bounds issues
      setCurrentIndex(0);
    } catch (error) {
      console.log(error, 'error');
    } finally {
      dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
    }
  };

  const handleCancelProposal = async (id: string) => {
    try {
      dispatch(
        cancelProposalRequestApi(`${baseUrl}/${passUserUrl}`, {
          proposalUserId: id,
        }),
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch(getPassedUsersApi(`${baseUrl}/${getPassedUsersUrl}`));
      dispatch(
        getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`),
      );
      // Reset currentIndex to 0 to avoid out of bounds issues
      setCurrentIndex(0);
    } catch (error) {
      console.log(error, 'error');
    } finally {
      dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
    }
  };
  // console.log(currentMatchedUser, 'currentMatchedUser');
  // console.log(matchedUsers, 'matchedUsers');
  return (
    <AppSafeView style={styles.container}>
      {loader ? (
        <AppLoader />
      ) : (
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
                          (currentMatchedUser.lastName ?? '')
                      }
                      age={currentMatchedUser.age}
                      height={currentMatchedUser.height}
                      religion={currentMatchedUser.religion}
                      caste={currentMatchedUser.community}
                      districtName={currentMatchedUser.districtName}
                      stateName={currentMatchedUser.stateName}
                      bio={currentMatchedUser.aboutMe}
                      image={currentMatchedUser.image}
                      galleryImageList={currentMatchedUserGalleryImageList}
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
      )}
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
    overflow: 'hidden', // Prevent content from showing outside bounds
  },
  flexContainer: {
    flex: 1,
  },
  profileCardContainer: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    left: 0, // Ensure no left offset
  },
});
