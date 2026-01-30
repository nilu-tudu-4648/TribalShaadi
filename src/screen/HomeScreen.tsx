import { StyleSheet, View, Image, Dimensions } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
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
  getHeightUrl,
  getDietUrl,
  getPassedUsersUrl,
  getStatesUrl,
  getGalleryImageListUrl,
  getPackageByUserIdUrl,
  insertUserNotificationsUrl,
  getProposalsGotByMeUrl,
  getChatHistoryByUserId,
  getAcceptedProposalByIdUrl,
  getPackageListUrl,
} from '../constants/functions';
import { useDispatch, useSelector } from 'react-redux';
import AppText from '../components/AppText';
import ProfileCardShimmer from '../components/ProfileCardShimmer';
import {
  cancelProposalRequestApi,
  getCurrentMatchedApi,
  getCurrentMatchedUserGalleryImageListApi,
  getPassedUsersApi,
  getProposalsGotByMeApi,
  getProposalsSendByMeApi,
  sentProposalApi,
} from '../store/reducers/userReducer';
import AppButton from '../components/AppButton';
import {
  getDiet,
  getHeight,
  getMaritalStatus,
  getReligion,
  getStates,
} from '../store/reducers/authReducer';
import { getCurrentUserPackageApi, getPackageListApi } from '../store/reducers/paymentReducer';
import {
  getAcceptedProposalByIdApi,
  insertUserNotificationsApi,
} from '../store/reducers/chatReducer';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_VARIBLES, NOTIFICATION_MESSAGES } from '../constants/data';
import ReportBottomSheet from '../components/BottomSheets/ReportBottomSheet';
import SelfieBottomSheet from '../components/BottomSheets/SelfieBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';

// keep for reference: full-screen card uses width/height percentages
const HomeScreen = () => {
  const navigation = useNavigation();
  const { currentMatchedUser, currentMatchedUserGalleryImageList } =
    useSelector((state: any) => state.entities.userReducer);
  const { currentUserPackage } = useSelector(
    (state: any) => state.entities.paymentReducer,
  );
  const [matchedUsers, setMatchedUsers] = useState<any[]>([]);
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasRequestedMatches, setHasRequestedMatches] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [detailsCache, setDetailsCache] = useState<Record<number, any>>({});
  const [galleryCache, setGalleryCache] = useState<Record<number, any[]>>({});
  const [packageCache, setPackageCache] = useState<Record<number, any[]>>({});
  const [currentProfileId, setCurrentProfileId] = useState<number | null>(null);
  const [lockedNextProfileId, setLockedNextProfileId] = useState<number | null>(
    null,
  );
  const [processedCount, setProcessedCount] = useState(0);
  const latestMatchedUsersRef = useRef(matchedUsers);
  const reportBottomSheetRef = useRef<BottomSheet | null>(null);
  const selfieBottomSheetRef = useRef<BottomSheet | null>(null);
  const nextVisualIndex = React.useMemo(() => {
    if (!matchedUsers || matchedUsers.length === 0) {
      return -1;
    }
    if (matchedUsers.length === 1) {
      return 0;
    }
    const next = currentIndex + 1;
    return next < matchedUsers.length ? next : 0;
  }, [matchedUsers, currentIndex]);

  /* 1️⃣  keep a stable screen-width value */
  const screenWidth = useRef(Dimensions.get('window').width).current;
  const openReport = () => {
    reportBottomSheetRef?.current?.expand();
  };
  const openSelfie = () => {
    selfieBottomSheetRef?.current?.expand();
  };
  // double-buffered cards for seamless transitions
  const card1X = useSharedValue(0);
  const card2X = useSharedValue(screenWidth);
  const [activeCard, setActiveCard] = useState<1 | 2>(1);

  const card1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: card1X.value }],
  }));
  const card2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: card2X.value }],
  }));

  useEffect(() => {
    latestMatchedUsersRef.current = matchedUsers;
  }, [matchedUsers]);

  const handleTransitionComplete = useCallback(
    (nextActive: 1 | 2, targetIdx: number) => {
      setActiveCard(nextActive);
      setCurrentIndex(targetIdx);
      const targetUser = latestMatchedUsersRef.current?.[targetIdx];
      if (targetUser?.id) {
        setCurrentProfileId(targetUser.id);
      }
      setLockedNextProfileId(null);
    },
    [],
  );
  const startTransition = (direction: 'left' | 'right') => {
    const hasMatches = matchedUsers && matchedUsers.length > 0;
    const resolvedNext =
      nextVisualIndex === -1 || !hasMatches ? currentIndex : nextVisualIndex;

    if (!matchedUsers || matchedUsers.length === 0) {
      console.log('No matched users available for transition');
      return;
    }

    const targetIdx = resolvedNext < matchedUsers.length ? resolvedNext : 0;
    const targetId = matchedUsers[targetIdx]?.id ?? null;
    setLockedNextProfileId(targetId);

    const inFrom = direction === 'right' ? screenWidth : -screenWidth;
    const outTo = direction === 'right' ? -screenWidth : screenWidth;

    if (activeCard === 1) {
      // Position card 2 off-screen
      card2X.value = inFrom;

      // Animate both cards simultaneously for smoother transition
      card1X.value = withTiming(outTo, {
        duration: 400, // Slightly longer for smoother feel
        easing: Easing.inOut(Easing.cubic),
      });

      card2X.value = withTiming(
        0,
        {
          duration: 400,
          easing: Easing.inOut(Easing.cubic),
        },
        () => {
          // Reset card 1 position after animation completes
          card1X.value = screenWidth;
          runOnJS(handleTransitionComplete)(2, targetIdx);
        },
      );
    } else {
      // Position card 1 off-screen
      card1X.value = inFrom;

      // Animate both cards simultaneously
      card2X.value = withTiming(outTo, {
        duration: 400,
        easing: Easing.inOut(Easing.cubic),
      });

      card1X.value = withTiming(
        0,
        {
          duration: 400,
          easing: Easing.inOut(Easing.cubic),
        },
        () => {
          // Reset card 2 position after animation completes
          card2X.value = screenWidth;
          runOnJS(handleTransitionComplete)(1, targetIdx);
        },
      );
    }
  };

  const handleSendProposal = async (id: string) => {
    try {
      setActionInProgress(true);

      if (!matchedUsers || matchedUsers.length === 0) {
        setActionInProgress(false);
        return;
      }

      const currentUserId =
        matchedUsers && matchedUsers[currentIndex]
          ? matchedUsers[currentIndex].id
          : id;
      if (!currentUserId) {
        setActionInProgress(false);
        return;
      }

      dispatch(
        sentProposalApi(`${baseUrl}/${sendProposalUrl}`, {
          proposalUserId: currentUserId,
        }),
      ),
        dispatch(
          getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`),
        ),
        dispatch(
          insertUserNotificationsApi(`${baseUrl}/${insertUserNotificationsUrl}`, {
            title: NOTIFICATION_MESSAGES.NEW_PROPOSAL.title,
            message: `${user.firstName} ${user.lastName ?? ''} ${NOTIFICATION_MESSAGES.NEW_PROPOSAL.message
              }`,
            receiverUserId: currentUserId,
          }),
        )
      startTransition('left');
      setProcessedCount(prev => prev + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleCancelProposal = async (id: string) => {
    try {
      setActionInProgress(true);

      if (!matchedUsers || matchedUsers.length === 0) {
        setActionInProgress(false);
        return;
      }

      const currentUserId =
        matchedUsers && matchedUsers[currentIndex]
          ? matchedUsers[currentIndex].id
          : id;
      if (!currentUserId) {
        setActionInProgress(false);
        return;
      }

      startTransition('right');
      dispatch(
        cancelProposalRequestApi(`${baseUrl}/${passUserUrl}`, {
          proposalUserId: currentUserId,
        }),
      ),
        dispatch(getPassedUsersApi(`${baseUrl}/${getPassedUsersUrl}`)),
        setProcessedCount(prev => prev + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setActionInProgress(false);
    }
  };
  // Helper: fetch user details silently (no redux)
  const fetchDetailSilently = useCallback(
    async (userId: number) => {
      try {
        if (!userId || detailsCache[userId]) return;
        const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
        if (!token) return;
        const resp = await axios.get(
          `${baseUrl}/${getUserDetailsUrl}id=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const record = resp?.data?.recordList?.[0];
        if (record) setDetailsCache(prev => ({ ...prev, [userId]: record }));
      } catch (e) { }
    },
    [detailsCache],
  );
  // Helper: fetch gallery silently
  const fetchGallerySilently = useCallback(
    async (userId: number) => {
      try {
        if (!userId || galleryCache[userId]) return;
        const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
        if (!token) return;
        const resp = await axios.post(
          `${baseUrl}/${getGalleryImageListUrl}`,
          { userId },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const list = resp?.data?.recordList ?? [];
        setGalleryCache(prev => ({ ...prev, [userId]: list }));
      } catch (e) { }
    },
    [galleryCache],
  );
  const fetchMatchedUsers = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
      if (!token) return;

      const { data } = await axios.get(`${baseUrl}/${getMatchedUsersUrl}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Use map + filter only once for better perf
      const list = Array.isArray(data?.recordList) ? data.recordList : [];
      const filtered = list.length
        ? list.filter((item: any) => !item?.message)
        : [];

      setMatchedUsers(filtered);
      setProcessedCount(0);
    } catch (e) {
      console.log(e, 'error');
    }
  }, []);
  useEffect(() => {
    fetchMatchedUsers();
  }, [fetchMatchedUsers]);

  // Refetch current user's data when screen is focused to fix gallery mismatch
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (matchedUsers && matchedUsers.length > 0 && matchedUsers[currentIndex]) {
        const currentUserId = matchedUsers[currentIndex].id;
        // Refetch gallery for the current user
        dispatch(
          getCurrentMatchedUserGalleryImageListApi(
            `${baseUrl}/${getGalleryImageListUrl}`,
            {
              userId: currentUserId,
            },
          ),
        );
      }
    });
    return unsubscribe;
  }, [navigation, matchedUsers, currentIndex, dispatch]);
  // Helper: fetch package silently
  const fetchPackageSilently = useCallback(
    async (userId: number) => {
      try {
        if (!userId || packageCache[userId]) return;
        const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
        if (!token) return;
        const resp = await axios.post(
          `${baseUrl}/${getPackageByUserIdUrl}`,
          { userId },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const list = resp?.data?.recordList ?? [];
        setPackageCache(prev => ({ ...prev, [userId]: list }));
      } catch (e) { }
    },
    [packageCache],
  );

  useEffect(() => {
    setHasRequestedMatches(true);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getMaritalStatus(getMaritalStatusUrl));
    dispatch(getReligion(getReligionUrl));
    dispatch(getHeight(getHeightUrl));
    dispatch(getDiet(getDietUrl));
    dispatch(getStates(getStatesUrl));
    dispatch(getPackageListApi(getPackageListUrl));
  }, [dispatch]);
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        dispatch(
          getAcceptedProposalByIdApi(
            `${getAcceptedProposalByIdUrl}/${user?.id}`,
          ),
        );
        await getChatHistoryByUserId(user.id, dispatch);
      } catch (error) {
        console.log(error, 'error');
      } finally {
        setIsLoading(false);
      }
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
  // Cache redux-fetched current data into local caches keyed by user id
  useEffect(() => {
    const curId = currentMatchedUser?.id;
    if (!curId) return;
    // Only update cache if the details belong to the current matched user
    if (matchedUsers && matchedUsers.length > 0 && matchedUsers[currentIndex]?.id === curId) {
      setDetailsCache(prev => ({ ...prev, [curId]: currentMatchedUser }));
    }
  }, [currentMatchedUser, matchedUsers, currentIndex]);

  useEffect(() => {
    const curId = currentMatchedUser?.id;
    if (!curId) return;
    if (!Array.isArray(currentMatchedUserGalleryImageList)) return;
    // Only update cache if the gallery belongs to the current matched user
    if (matchedUsers && matchedUsers.length > 0 && matchedUsers[currentIndex]?.id === curId) {
      setGalleryCache(prev => ({
        ...prev,
        [curId]: currentMatchedUserGalleryImageList,
      }));
    }
  }, [currentMatchedUser?.id, currentMatchedUserGalleryImageList, matchedUsers, currentIndex]);

  useEffect(() => {
    const curId = currentMatchedUser?.id;
    if (!curId) return;
    if (!Array.isArray(currentUserPackage)) return;
    // Only update cache if the package belongs to the current matched user
    if (matchedUsers && matchedUsers.length > 0 && matchedUsers[currentIndex]?.id === curId) {
      setPackageCache(prev => ({ ...prev, [curId]: currentUserPackage }));
    }
  }, [currentMatchedUser?.id, currentUserPackage, matchedUsers, currentIndex]);
  // Prefetch previous, current, and next-next users in background for smoothness
  useEffect(() => {
    if (!matchedUsers || matchedUsers.length === 0) return;
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : -1;
    const nextIdx =
      currentIndex + 1 < matchedUsers.length ? currentIndex + 1 : -1;
    const nextNextIdx =
      currentIndex + 2 < matchedUsers.length ? currentIndex + 2 : -1;
    const prevId = prevIdx >= 0 ? matchedUsers[prevIdx]?.id : undefined;
    const nextId = nextIdx >= 0 ? matchedUsers[nextIdx]?.id : undefined;
    const nextNextId =
      nextNextIdx >= 0 ? matchedUsers[nextNextIdx]?.id : undefined;

    const currentCardImageUrl = matchedUsers[currentIndex]?.imageUrl;
    if (currentCardImageUrl) Image.prefetch(currentCardImageUrl);
    const prevCardImageUrl = matchedUsers[prevIdx]?.imageUrl;
    if (prevCardImageUrl) Image.prefetch(prevCardImageUrl);
    const nextCardImageUrl = matchedUsers[nextIdx]?.imageUrl;
    if (nextCardImageUrl) Image.prefetch(nextCardImageUrl);
    const nextNextCardImageUrl = matchedUsers[nextNextIdx]?.imageUrl;
    if (nextNextCardImageUrl) Image.prefetch(nextNextCardImageUrl);

    if (prevId) {
      fetchDetailSilently(prevId);
      fetchGallerySilently(prevId);
      fetchPackageSilently(prevId);
    }
    if (nextId) {
      fetchDetailSilently(nextId);
      fetchGallerySilently(nextId);
      fetchPackageSilently(nextId);
    }
    if (nextNextId) {
      fetchDetailSilently(nextNextId);
      fetchGallerySilently(nextNextId);
      fetchPackageSilently(nextNextId);
    }
  }, [
    matchedUsers,
    currentIndex,
    fetchDetailSilently,
    fetchGallerySilently,
    fetchPackageSilently,
  ]);
  // Keep carousel index aligned with the currently visible user even if the list updates
  useEffect(() => {
    if (!matchedUsers || matchedUsers.length === 0) {
      if (currentIndex !== 0) {
        setCurrentIndex(0);
      }
      if (currentProfileId !== null) {
        setCurrentProfileId(null);
      }
      if (lockedNextProfileId !== null) {
        setLockedNextProfileId(null);
      }
      setActiveCard(1);
      card1X.value = 0;
      card2X.value = screenWidth;
      return;
    }

    const safeIndex =
      currentIndex < matchedUsers.length
        ? currentIndex
        : matchedUsers.length - 1;
    if (safeIndex !== currentIndex) {
      setCurrentIndex(safeIndex);
      return;
    }

    const desiredId =
      currentProfileId ?? matchedUsers[safeIndex]?.id ?? matchedUsers[0]?.id;
    if (!desiredId) {
      return;
    }

    const alignedIndex = matchedUsers.findIndex(
      (matchedUser: { id?: number }) => matchedUser?.id === desiredId,
    );
    if (alignedIndex === -1) {
      const fallbackId = matchedUsers[0]?.id ?? null;
      if (fallbackId !== currentProfileId) {
        setCurrentProfileId(fallbackId);
      }
      if (lockedNextProfileId !== null) {
        setLockedNextProfileId(null);
      }
      if (currentIndex !== 0) {
        setCurrentIndex(0);
      }
      return;
    }

    if (alignedIndex !== currentIndex) {
      setCurrentIndex(alignedIndex);
      return;
    }

    const actualId = matchedUsers[alignedIndex]?.id ?? null;
    if (actualId !== currentProfileId) {
      setCurrentProfileId(actualId);
    }
  }, [
    matchedUsers,
    currentIndex,
    currentProfileId,
    lockedNextProfileId,
    setCurrentIndex,
    setCurrentProfileId,
    card1X,
    card2X,
    screenWidth,
  ]);

  const resolvedNextIndex = React.useMemo(() => {
    if (!matchedUsers || matchedUsers.length === 0) {
      return -1;
    }
    if (lockedNextProfileId) {
      const lockedIdx = matchedUsers.findIndex(
        (matchedUser: { id?: number }) =>
          matchedUser?.id === lockedNextProfileId,
      );
      if (lockedIdx !== -1) {
        return lockedIdx;
      }
    }
    return nextVisualIndex;
  }, [matchedUsers, lockedNextProfileId, nextVisualIndex]);
  const renderCardContent = (cardIndex: number) => {
    if (
      !matchedUsers ||
      matchedUsers.length === 0 ||
      cardIndex === -1 ||
      !matchedUsers[cardIndex]
    ) {
      return null;
    }

    const curId = matchedUsers[cardIndex]?.id;
    const cachedDetail = curId ? detailsCache[curId] : null;
    const cachedGallery = curId ? galleryCache[curId] : null;
    const cachedPackage = curId ? packageCache[curId] : null;

    const baseUser = matchedUsers[cardIndex] || {};
    const finalDetail = { ...baseUser, ...cachedDetail };
    const galleryList =
      (cachedGallery as any)?.length > 0
        ? cachedGallery
        : baseUser.galleryImageList || [];
    const isPremium = (cachedPackage?.length ?? 0) > 0;
    return (
      <ProfileCard
        name={`${finalDetail?.firstName ?? ''} ${finalDetail?.lastName ?? ''}`}
        isNameLoading={false}
        age={finalDetail?.age}
        height={finalDetail?.height}
        religion={finalDetail?.religion}
        caste={finalDetail?.community}
        districtName={finalDetail?.districtName}
        stateName={finalDetail?.stateName}
        bio={finalDetail?.aboutMe}
        image={finalDetail?.imageUrl || ''}
        galleryImageList={galleryList}
        isLoading={false}
        maritalStatus={finalDetail?.maritalStatus}
        dob={finalDetail?.birthDate}
        motherTongue={finalDetail?.motherTongue}
        annualIncome={finalDetail?.annualIncome}
        partnerExpectation={finalDetail?.about_lifepartener}
        employedIn={finalDetail?.employmentType}
        occupation={finalDetail?.occupationCategoryName ? finalDetail?.occupationCategoryName : finalDetail?.occupation}
        organizationName={finalDetail?.companyName}
        settlingTime={finalDetail?.planingto_settle}
        highestQualification={finalDetail?.education}
        college={finalDetail?.college_name}
        eatingHabits={finalDetail?.diet}
        drinkingHabits={finalDetail?.drinking}
        smokingHabits={finalDetail?.smoking}
        kids={finalDetail?.kids}
        interests={finalDetail?.intrests}
        isVerified={finalDetail?.isVerified}
        isPremium={isPremium}
        openReport={openReport}
      />
    );
  };
  return (
    <GestureHandlerRootView style={styles.container}>
      <AppSafeView style={styles.container}>
        <>
          {/* show shimmer only on first load */}
          {!hasRequestedMatches || (isLoading && matchedUsers.length === 0) ? (
            <ProfileCardShimmer />
          ) : matchedUsers.length > 0 &&
            processedCount < matchedUsers.length ? (
            <>
              <View style={styles.carouselContainer}>
                <Animated.View style={styles.cardsWrapper}>
                  {/* Card 1 */}
                  <Animated.View
                    style={[styles.profileCardContainer, card1Style]}
                  >
                    {renderCardContent(
                      activeCard === 1 ? currentIndex : resolvedNextIndex,
                    )}
                  </Animated.View>

                  {/* Card 2 */}
                  <Animated.View
                    style={[styles.profileCardContainer, card2Style]}
                  >
                    {renderCardContent(
                      activeCard === 2 ? currentIndex : resolvedNextIndex,
                    )}
                  </Animated.View>
                </Animated.View>
              </View>

              {/* Buttons */}
              <View style={styles.floatingButtonContainer}>
                <AppButton
                  title="Decline"
                  onPress={() =>
                    handleCancelProposal(matchedUsers[currentIndex].id)
                  }
                  buttonStyle={styles.declineButton}
                  textStyle={styles.declineButtonText}
                  isButtonDisabled={actionInProgress}
                  pressable={true}
                />
                <AppButton
                  title="Connect"
                  onPress={() =>
                    user.isVerified
                      ? handleSendProposal(matchedUsers[currentIndex].id)
                      : openSelfie()
                  }
                  buttonStyle={styles.connectButton}
                  textStyle={styles.connectButtonText}
                  isButtonDisabled={actionInProgress}
                  pressable={true}
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
      <ReportBottomSheet
        bottomSheetRef={reportBottomSheetRef}
        onReport={(reportReason: string) => {
          console.log('Profile reported for:', reportReason);
        }}
      />
      <SelfieBottomSheet bottomSheetRef={selfieBottomSheetRef} />
    </GestureHandlerRootView>
  );
};

export default React.memo(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 0,
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
    position: 'relative',
    overflow: 'hidden',
  },
  cardsWrapper: {
    flex: 1,
    position: 'relative',
  },
  profileCardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
