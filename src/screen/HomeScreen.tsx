import { StyleSheet, View, Image, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
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
  getPackageByUserIdUrl,
  insertUserNotificationsUrl,
  delay,
  getProposalsGotByMeUrl,
  getChatHistoryByUserId,
} from '../constants/functions';
import { useDispatch, useSelector } from 'react-redux';
import AppText from '../components/AppText';
import Loader from '../components/loader/Loader';
import {
  cancelProposalRequestApi,
  getCurrentMatchedApi,
  getCurrentMatchedUserGalleryImageListApi,
  getPassedUsersApi,
  getProposalsGotByMeApi,
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
import { getCurrentUserPackageApi } from '../store/reducers/paymentReducer';
import {
  insertUserNotificationsApi,
  setUnreadChatHistory,
} from '../store/reducers/chatReducer';

const { width } = Dimensions.get('window');
const HomeScreen = () => {
  const {
    matchedUsers,
    loader,
    currentMatchedUser,
    currentMatchedUserGalleryImageList,
  } = useSelector((state: any) => state.entities.userReducer);
  const { currentUserPackage } = useSelector(
    (state: any) => state.entities.paymentReducer,
  );
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nameLoading, setNameLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [hasRequestedMatches, setHasRequestedMatches] = useState(false);

  const translateX = useSharedValue(0);

  /* 1️⃣  keep a stable screen-width value */
  const screenWidth = useRef(Dimensions.get('window').width).current;

  const opacity = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));
  
  const animateToNext = (direction: 'left' | 'right', callback: () => void) => {
    // Slide + fade out
    translateX.value = withTiming(direction === 'left' ? -screenWidth : screenWidth, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(callback)();
  
      // Prepare new card off-screen and hidden
      translateX.value = direction === 'left' ? screenWidth : -screenWidth;
      opacity.value = 0;
  
      // Slide + fade in new card
      translateX.value = withTiming(0, {
        duration: 350,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(1, { duration: 300 });
    });
  };
  
  

  const handleSendProposal = async (id: string) => {
    try {
      setIsLoading(true);
      dispatch(
        sentProposalApi(`${baseUrl}/${sendProposalUrl}`, {
          proposalUserId: id,
        }),
      );
      await delay();
      dispatch(
        getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`),
      );
      dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
      dispatch(
        insertUserNotificationsApi(`${baseUrl}/${insertUserNotificationsUrl}`, {
          title: 'Congrats 🎉 new request received!',
          message: `${user.firstName} ${
            user.lastName ?? ''
          } wants to connect with you.`,
          receiverUserId: id,
        }),
      );

      animateToNext('right', () => {
        setCurrentIndex(0);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelProposal = async (id: string) => {
    try {
      setIsLoading(true);
      dispatch(
        cancelProposalRequestApi(`${baseUrl}/${passUserUrl}`, {
          proposalUserId: id,
        }),
      );
      await delay();
      dispatch(getPassedUsersApi(`${baseUrl}/${getPassedUsersUrl}`));
      dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));

      animateToNext('left', () => {
        setCurrentIndex(0);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
      const id = user.pReligionId !== "any" && user.pReligionId?.[0] ? user.pReligionId?.[0] : user.religionId;
      dispatch(getCommunity(`${getCommunityUrl}religionId=${id}`));
      setHasRequestedMatches(true);
  }, [dispatch, user?.pReligionId, user?.religionId]);

  useEffect(() => {
    if (matchedUsers.length > 0 && currentIndex >= matchedUsers.length) {
      setCurrentIndex(0);
    }
  }, [matchedUsers.length, currentIndex]);

  // Handle name loading delay
  useEffect(() => {
    if (
      matchedUsers &&
      matchedUsers.length > 0 &&
      currentIndex < matchedUsers.length
    ) {
      setNameLoading(true);
      setDisplayName('');

      const timer = setTimeout(() => {
        const currentUser = matchedUsers[currentIndex];
        const fullName =
          currentUser?.firstName + ' ' + (currentUser?.lastName ?? '');
        setDisplayName(fullName);
        setNameLoading(false);
      }, 1500); // 1.5 second delay

      return () => clearTimeout(timer);
    }
  }, [matchedUsers, currentIndex]);

  useEffect(() => {
    dispatch(getMaritalStatus(getMaritalStatusUrl));
    dispatch(getReligion(getReligionUrl));
    dispatch(getHeight(getHeightUrl));
    dispatch(getDiet(getDietUrl));
    dispatch(getStates(getStatesUrl));
  }, [dispatch]);
  useEffect(() => {
    const fetchChatHistory = async () => {
      const chatHistory = await getChatHistoryByUserId(user.id);
      const filteredChat = chatHistory.filter((chat: any) => {
        return chat.userId !== user.id && chat.isRead === 0;
      });
      dispatch(setUnreadChatHistory(filteredChat));
    };
    fetchChatHistory();
  }, [user?.id, dispatch]);

  useEffect(() => {
    dispatch(getProposalsGotByMeApi(`${baseUrl}/${getProposalsGotByMeUrl}`));
    if (matchedUsers && matchedUsers.length > currentIndex) {
      const currentUserId = matchedUsers[currentIndex].id;
      // Only fetch current user data - remove the problematic next user prefetch
      dispatch(
        getCurrentMatchedApi(
          `${baseUrl}/${getUserDetailsUrl}id=${currentUserId}`,
        ),
      );
      dispatch(
        getCurrentUserPackageApi(`${baseUrl}/${getPackageByUserIdUrl}`, {
          userId: currentUserId,
        }),
      );

      dispatch(
        getCurrentMatchedUserGalleryImageListApi(
          `${baseUrl}/${getGalleryImageListUrl}`,
          {
            userId: currentUserId,
          },
        ),
      );
    }
  }, [dispatch, matchedUsers, currentIndex]);

  return (
        <View style={styles.container}>
          <AppSafeView style={styles.container}>
            <>
              {/* show loader on first render and while fetching */}
              {!hasRequestedMatches || loader ? (
                <Loader />
              ) : matchedUsers.length > 0 && currentIndex < matchedUsers.length ? (
                <>
                  <View style={styles.carouselContainer}>
                    <Animated.View
                      style={[styles.profileCardContainer, animatedCardStyle]}
                    >
                      <ProfileCard
                        name={nameLoading ? 'Loading...' : displayName}
                        isNameLoading={nameLoading}
                        age={matchedUsers[currentIndex]?.age}
                        height={currentMatchedUser?.height}
                        religion={currentMatchedUser?.religion}
                        caste={currentMatchedUser?.community}
                        districtName={currentMatchedUser?.districtName}
                        stateName={currentMatchedUser?.stateName}
                        bio={matchedUsers[currentIndex]?.aboutMe}
                        image={matchedUsers[currentIndex]?.imageUrl || ''}
                        galleryImageList={
                          currentMatchedUserGalleryImageList ||
                          matchedUsers[currentIndex]?.galleryImageList ||
                          []
                        }
                        isLoading={loader}
                        maritalStatus={currentMatchedUser?.maritalStatus}
                        dob={currentMatchedUser?.birthDate}
                        motherTongue={currentMatchedUser?.motherTongue}
                        annualIncome={currentMatchedUser?.annualIncome}
                        partnerExpectation={
                          currentMatchedUser?.about_lifepartener
                        }
                        employedIn={currentMatchedUser?.employedIn}
                        occupation={currentMatchedUser?.occupation}
                        organizationName={currentMatchedUser?.companyName}
                        settlingTime={currentMatchedUser?.planingto_settle}
                        highestQualification={
                          currentMatchedUser?.highestQualification
                        }
                        college={currentMatchedUser?.college_name}
                        eatingHabits={currentMatchedUser?.diet}
                        drinkingHabits={currentMatchedUser?.drinking}
                        smokingHabits={currentMatchedUser?.smoking}
                        kids={currentMatchedUser?.kids}
                        interests={currentMatchedUser?.intrests}
                        isVerified={currentMatchedUser?.isVerified}
                        isPremium={currentUserPackage.length > 0}
                      />
                    </Animated.View>
                  </View>
                  {/* Optional: Keep buttons for users who prefer tapping */}
                  <View style={styles.floatingButtonContainer}>
                    <AppButton
                      title="Decline"
                      onPress={() =>
                        handleCancelProposal(matchedUsers[currentIndex].id)
                      }
                      buttonStyle={styles.declineButton}
                      textStyle={styles.declineButtonText}
                      isButtonDisabled={isLoading}
                    />
                    <AppButton
                      title="Connect"
                      onPress={() =>
                        handleSendProposal(matchedUsers[currentIndex].id)
                      }
                      buttonStyle={styles.connectButton}
                      textStyle={styles.connectButtonText}
                      isButtonDisabled={isLoading}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.exhaustedContainer}>
                  <Image
                    source={require('../assets/images/ExhaustedImage.png')}
                    style={styles.exhaustedImage}
                  />
                  <AppText
                    text="All matches exhausted"
                    textStyle={styles.exhaustedTitle}
                  />
                  <AppText
                    text="Come back and check tomorrow for more matches"
                    textStyle={styles.exhaustedSubtitle}
                  />
                </View>
              )}
            </>
          </AppSafeView>
        </View>
  );
};

export default React.memo(HomeScreen);

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
    overflow: 'hidden',
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
  },
  exhaustedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exhaustedImage: {
    width: SIZES.width * 0.2,
    height: SIZES.height * 0.1,
    resizeMode: 'contain',
  },
  exhaustedTitle: {
    fontSize: fontSize20,
    textAlign: 'center',
    fontWeight: '700',
  },
  exhaustedSubtitle: {
    fontSize: fontSize16,
    color: COLORS.textInactive,
    textAlign: 'center',
    fontWeight: '600',
  },
});
