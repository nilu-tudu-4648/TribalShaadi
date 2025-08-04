import { StyleSheet, View, Image, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
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
import { getCurrentUserPackageApi } from '../store/reducers/paymentReducer';
import { insertUserNotificationsApi } from '../store/reducers/chatReducer';
import Loader from '../components/loader/Loader';

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

  /* 1️⃣  keep a stable screen-width value */
  const screenWidth = useRef(Dimensions.get('window').width).current;

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
          message: `${
            user.firstName + ' ' + (user.lastName ?? '')
          } wants to connect with you. See if this could be your perfect tribal match!`,
          receiverUserId: id,
        }),
      );
      // Don't increment index here - let the useEffect handle it when matchedUsers updates
    } catch (error) {
      console.log(error, 'error');
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
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
  }, [dispatch]);

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
    dispatch(getCommunity(getCommunityUrl));
    dispatch(getMaritalStatus(getMaritalStatusUrl));
    dispatch(getReligion(getReligionUrl));
    dispatch(getHeight(getHeightUrl));
    dispatch(getDiet(getDietUrl));
    dispatch(getStates(getStatesUrl));
  }, [dispatch]);

  useEffect(() => {
    if (matchedUsers && matchedUsers.length > currentIndex) {
      const currentUserId = matchedUsers[currentIndex].id;
      const nextUserId =
        matchedUsers[(currentIndex + 1) % matchedUsers.length].id;
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
      // Pre-fetch data for the next user

      dispatch(
        getCurrentMatchedApi(`${baseUrl}/${getUserDetailsUrl}id=${nextUserId}`),
      );
      dispatch(
        getCurrentUserPackageApi(`${baseUrl}/${getPackageByUserIdUrl}`, {
          userId: nextUserId,
        }),
      );
      dispatch(
        getCurrentMatchedUserGalleryImageListApi(
          `${baseUrl}/${getGalleryImageListUrl}`,
          {
            userId: nextUserId,
          },
        ),
      );
    }
  }, [dispatch, matchedUsers, currentIndex]);

  // const currentUser = currentMatchedUser || matchedUsers[currentIndex];
  // console.log(matchedUsers, 'matchedUsers');
  // console.log(currentMatchedUser, 'currentMatchedUser');

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Only activate when horizontal movement is significant
    .failOffsetY([-5, 5]) // Don't interfere with vertical scrolling
    .onEnd(event => {
      'worklet';
      const threshold = screenWidth * 0.25;
      const shouldSnapToNext = Math.abs(event.translationX) > threshold;

      if (shouldSnapToNext) {
        const direction = event.translationX > 0 ? -1 : 1; // Swipe right = previous, swipe left = next
        const nextIndex = Math.max(
          0,
          Math.min(matchedUsers.length - 1, currentIndex + direction),
        );
        runOnJS(setCurrentIndex)(nextIndex);
      }
    });

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <GestureHandlerRootView style={styles.container}>
          <AppSafeView style={styles.container}>
            <>
              {/* Profile Card */}
              {matchedUsers.length > 0 && currentIndex < matchedUsers.length ? (
                <>
                  <View style={styles.carouselContainer}>
                    <GestureDetector gesture={panGesture}>
                      <View style={styles.profileCardContainer}>
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
                          isVerified={false}
                          isPremium={currentUserPackage.length > 0}
                        />
                      </View>
                    </GestureDetector>
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
        </GestureHandlerRootView>
      )}
    </>
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
