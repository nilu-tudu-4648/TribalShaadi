import { StyleSheet, View, Image, Dimensions } from 'react-native';
import EmptyStateHomeScreen from '../assets/images/EmptyStateHomeScreen.svg';
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
  getPackageByUserIdUrl,
  insertUserNotificationsUrl,
  getProposalsGotByMeUrl,
  getChatHistoryByUserId,
  getAcceptedProposalByIdUrl,
  getPackageListUrl,
  getPopupContent,
} from '../constants/functions';
import { useDispatch, useSelector } from 'react-redux';
import ProfileCardShimmer from '../components/ProfileCardShimmer';
import AnimatedToast from '../components/AnimatedToast';
import {
  cancelProposalRequestApi,
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
import { getPackageByUserIdApi, getPackageListApi } from '../store/reducers/paymentReducer';
import {
  getAcceptedProposalByIdApi,
  insertUserNotificationsApi,
} from '../store/reducers/chatReducer';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_VARIBLES, NOTIFICATION_MESSAGES, ROUTES } from '../constants/data';
import ReportBottomSheet from '../components/BottomSheets/ReportBottomSheet';
import SelfieBottomSheet from '../components/BottomSheets/SelfieBottomSheet';
import TwoConnectsBottomSheet from '../components/BottomSheets/TwoConnectsBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import NotificationEnableDialog from '../components/dialogs/NotificationEnableDialog';
import {
  checkNotificationPermission,
  openAppSettings,
  requestAndroidNotificationPermission,
  requestUserPermission,
} from '../notification/notifications';
import PreferenceDialog from '../components/dialogs/PreferenceDialog';
import { isPreferencesSetByUser } from '../constants/functions';
import { usePostHog } from 'posthog-react-native';

const HomeScreen = () => {
  const posthog = usePostHog();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.entities.authReducer.user);
  const proposalsSendByMe = useSelector(
    (state: any) => state.entities.userReducer.proposalsSendByMe,
  );
  const passedUsers = useSelector(
    (state: any) => state.entities.userReducer.passedUsers,
  );
  const [matchedUsers, setMatchedUsers] = useState<any[]>([]);
  const packageByUserId = useSelector(
    (state: any) => state.entities.paymentReducer.packageByUserId,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasRequestedMatches, setHasRequestedMatches] = useState(false);
  const [showInterestToast, setShowInterestToast] = useState(false);
  const [detailsCache, setDetailsCache] = useState<Record<number, any>>({});
  const [packageCache, setPackageCache] = useState<Record<number, any[]>>({});
  const [popupContent, setPopupContent] = useState<any>(null);
  const [currentProfileId, setCurrentProfileId] = useState<number | null>(null);
  const [processedCount, setProcessedCount] = useState(0);
  const latestMatchedUsersRef = useRef(matchedUsers);
  const actionInProgressRef = useRef(false);
  const pendingInterestToastRef = useRef(false);
  const pendingRefreshRef = useRef<'sent' | 'passed' | null>(null);
  const detailsCacheRef = useRef<Record<number, any>>({});
  const packageCacheRef = useRef<Record<number, any[]>>({});
  const detailRequestsRef = useRef(new Set<number>());
  const packageRequestsRef = useRef(new Set<number>());
  const isAnimatingRef = useRef(false);
  const pendingCacheRenderRef = useRef(false);
  const reportBottomSheetRef = useRef<BottomSheet | null>(null);
  const selfieBottomSheetRef = useRef<BottomSheet | null>(null);
  const twoConnectsBottomSheetRef = useRef<BottomSheet | null>(null);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showPreferenceDialog, setShowPreferenceDialog] = useState(false);
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

  const handleEnableNotification = async () => {
    try {
      await requestAndroidNotificationPermission();
      await requestUserPermission();
      openAppSettings();
      setShowNotificationDialog(false);
    } catch (error) {
    }
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
      setProcessedCount(prev => prev + 1);
      isAnimatingRef.current = false;
      if (pendingCacheRenderRef.current) {
        pendingCacheRenderRef.current = false;
        setDetailsCache({ ...detailsCacheRef.current });
        setPackageCache({ ...packageCacheRef.current });
      }
      const targetUser = latestMatchedUsersRef.current?.[targetIdx];
      if (targetUser?.id) {
        setCurrentProfileId(targetUser.id);
      }
      actionInProgressRef.current = false;

      if (pendingInterestToastRef.current) {
        pendingInterestToastRef.current = false;
        setShowInterestToast(true);
      }

      const refreshType = pendingRefreshRef.current;
      pendingRefreshRef.current = null;
      if (refreshType === 'sent') {
        dispatch(
          getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`),
        );
      } else if (refreshType === 'passed') {
        dispatch(getPassedUsersApi(`${baseUrl}/${getPassedUsersUrl}`));
      }
    },
    [dispatch],
  );
  const startTransition = (direction: 'left' | 'right') => {
    const hasMatches = matchedUsers && matchedUsers.length > 0;
    const resolvedNext =
      nextVisualIndex === -1 || !hasMatches ? currentIndex : nextVisualIndex;

    if (!matchedUsers || matchedUsers.length === 0) {
      return;
    }

    const targetIdx = resolvedNext < matchedUsers.length ? resolvedNext : 0;
    isAnimatingRef.current = true;

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
  const handleSendProposal = (id: string) => {
    if (actionInProgressRef.current) return;

    const hasActivePlan = Array.isArray(packageByUserId) && packageByUserId.length > 0;
    const isFemale = user?.gender === 'Female';
    const totalUsed = (proposalsSendByMe?.length ?? 0) + (passedUsers?.length ?? 0);
    if (totalUsed >= 5 && !hasActivePlan && !isFemale) {
      twoConnectsBottomSheetRef?.current?.expand();
      return;
    }

    const currentUserId = matchedUsers[currentIndex]?.id ?? id;
    if (!currentUserId) return;

    actionInProgressRef.current = true;
    pendingInterestToastRef.current = true;
    pendingRefreshRef.current = 'sent';
    startTransition('left');

    requestAnimationFrame(() => {
      posthog.capture('Sent_Interest');
      (async () => {
        try {
          await dispatch(
            sentProposalApi(`${baseUrl}/${sendProposalUrl}`, {
              proposalUserId: currentUserId,
            }),
          );
          dispatch(
            insertUserNotificationsApi(
              `${baseUrl}/${insertUserNotificationsUrl}`,
              {
                title: NOTIFICATION_MESSAGES.NEW_PROPOSAL.title,
                message: `${user.firstName} ${user.lastName ?? ''} ${
                  NOTIFICATION_MESSAGES.NEW_PROPOSAL.message
                }`,
                receiverUserId: currentUserId,
              },
            ),
          );
        } catch (error) {
        }
      })();
    });
  };

  const handleCancelProposal = (id: string) => {
    if (actionInProgressRef.current) return;

    const currentUserId = matchedUsers[currentIndex]?.id ?? id;
    if (!currentUserId) return;

    actionInProgressRef.current = true;
    pendingRefreshRef.current = 'passed';
    startTransition('right');

    requestAnimationFrame(() => {
      posthog.capture('declined_match');
      (async () => {
        try {
          await dispatch(
            cancelProposalRequestApi(`${baseUrl}/${passUserUrl}`, {
              proposalUserId: currentUserId,
            }),
          );
        } catch (error) {
        }
      })();
    });
  };
  // Helper: fetch user details silently (no redux)
  const fetchDetailSilently = useCallback(
    async (userId: number) => {
      if (
        !userId ||
        detailsCacheRef.current[userId] ||
        detailRequestsRef.current.has(userId)
      ) {
        return;
      }
      detailRequestsRef.current.add(userId);
      try {
        const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
        if (!token) return;
        const resp = await axios.get(
          `${baseUrl}/${getUserDetailsUrl}id=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const record = resp?.data?.recordList?.[0];
        if (record) {
          detailsCacheRef.current[userId] = record;
          if (isAnimatingRef.current) {
            pendingCacheRenderRef.current = true;
          } else {
            setDetailsCache(prev => ({ ...prev, [userId]: record }));
          }
        }
      } catch (e) {
      } finally {
        detailRequestsRef.current.delete(userId);
      }
    },
    [],
  );

  const fetchMatchedUsers = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
      if (!token) return;

      const { data } = await axios.get(`${baseUrl}/${getMatchedUsersUrl}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedPopupContent = await getPopupContent();
      setPopupContent(fetchedPopupContent);
      // Use map + filter only once for better perf
      const list = Array.isArray(data?.recordList) ? data.recordList : [];
      const filtered = list.length
        ? list.filter((item: any) => !item?.message)
        : [];

      setMatchedUsers(filtered);
      setProcessedCount(0);
      dispatch(getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`));
      dispatch(getPassedUsersApi(`${baseUrl}/${getPassedUsersUrl}`));
    } catch (e) {
    }
  }, [dispatch]);
  useEffect(() => {
    fetchMatchedUsers();
  }, [fetchMatchedUsers]);

  // Refetch current user's data when screen is focused to fix gallery mismatch
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Check notification permission and show dialog if not enabled
      checkNotificationPermission().then((enabled) => {
        if (!enabled) {
          setShowNotificationDialog(true);
        }
      });
      // Show preference dialog only when user has not set mandatory preferences; hide it when they have
      if (isPreferencesSetByUser(user)) {
        setShowPreferenceDialog(false);
      } else {
        setShowPreferenceDialog(true);
      }
    });
    return unsubscribe;
  }, [navigation, user]);
  // Helper: fetch package silently
  const fetchPackageSilently = useCallback(
    async (userId: number) => {
      if (
        !userId ||
        packageCacheRef.current[userId] ||
        packageRequestsRef.current.has(userId)
      ) {
        return;
      }
      packageRequestsRef.current.add(userId);
      try {
        const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
        if (!token) return;
        const resp = await axios.post(
          `${baseUrl}/${getPackageByUserIdUrl}`,
          { userId },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const list = resp?.data?.recordList ?? [];
        packageCacheRef.current[userId] = list;
        if (isAnimatingRef.current) {
          pendingCacheRenderRef.current = true;
        } else {
          setPackageCache(prev => ({ ...prev, [userId]: list }));
        }
      } catch (e) {
      } finally {
        packageRequestsRef.current.delete(userId);
      }
    },
    [],
  );

  useEffect(() => {
    setHasRequestedMatches(true);
  }, []);

  useEffect(() => {
    dispatch(getMaritalStatus(getMaritalStatusUrl));
    dispatch(getReligion(getReligionUrl));
    dispatch(getHeight(getHeightUrl));
    dispatch(getDiet(getDietUrl));
    dispatch(getStates(getStatesUrl));
    dispatch(getPackageListApi(getPackageListUrl));
    if (user?.id) {
      dispatch(getPackageByUserIdApi(`${baseUrl}/${getPackageByUserIdUrl}`, { userId: user.id }));
    }
  }, [dispatch, user?.id]);
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchChatHistory();
  }, [user?.id, dispatch]);

  useEffect(() => {
    dispatch(getProposalsGotByMeApi(`${baseUrl}/${getProposalsGotByMeUrl}`));
  }, [dispatch]);

  useEffect(() => {
    const currentUserId = matchedUsers[currentIndex]?.id;
    if (!currentUserId) return;
    fetchDetailSilently(currentUserId);
    fetchPackageSilently(currentUserId);
  }, [
    matchedUsers,
    currentIndex,
    fetchDetailSilently,
    fetchPackageSilently,
  ]);
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
      fetchPackageSilently(prevId);
    }
    if (nextId) {
      fetchDetailSilently(nextId);
      fetchPackageSilently(nextId);
    }
    if (nextNextId) {
      fetchDetailSilently(nextNextId);
      fetchPackageSilently(nextNextId);
    }
  }, [
    matchedUsers,
    currentIndex,
    fetchDetailSilently,
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
    setCurrentIndex,
    setCurrentProfileId,
    card1X,
    card2X,
    screenWidth,
  ]);

  const resolvedNextIndex = nextVisualIndex;
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
    const cachedPackage = curId ? packageCache[curId] : null;

    const baseUser = matchedUsers[cardIndex] || {};
    const finalDetail = { ...baseUser, ...cachedDetail };
    const hasPaidPackage = (cachedPackage?.length ?? 0) > 0;
    const isPremium = hasPaidPackage || finalDetail?.gender === 'Female';
    return (
      <ProfileCard
        name={`${finalDetail?.firstName ?? ''} ${finalDetail?.lastName ?? ''}`}
        isNameLoading={false}
        freeConnect={
          Array.isArray(packageByUserId) && packageByUserId.length === 0 && user?.gender !== 'Female'
            ? `${Math.min((proposalsSendByMe?.length ?? 0) + (passedUsers?.length ?? 0), 5)}/5`
            : ''
        }
        age={finalDetail?.age}
        gender={user?.gender}
        height={finalDetail?.height}
        religion={finalDetail?.religion}
        caste={finalDetail?.community}
        districtName={finalDetail?.districtName}
        stateName={finalDetail?.stateName}
        bio={finalDetail?.aboutMe}
        image={finalDetail?.imageUrl || ''}
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
        <AnimatedToast
          visible={showInterestToast}
          message="Interest Sent Successfully"
          duration={2000}
          onHide={() => setShowInterestToast(false)}
        />
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
                  title="Skip"
                  onPress={() =>
                    handleCancelProposal(matchedUsers[currentIndex].id)
                  }
                  buttonStyle={styles.declineButton}
                  textStyle={styles.declineButtonText}
                  isButtonDisabled={false}
                />
                <AppButton
                  title="Send Interest"
                  onPress={() =>
                    user.isVerified
                      ? handleSendProposal(matchedUsers[currentIndex].id)
                      : openSelfie()
                  }
                  buttonStyle={styles.connectButton}
                  textStyle={styles.connectButtonText}
                  isButtonDisabled={false}
                />
              </View>
            </>
          ) : (
            <View style={styles.exhaustedContainer}>
              <EmptyStateHomeScreen width={SIZES.width} height={SIZES.height * 0.75} />
            </View>
          )}
        </>
      </AppSafeView>
      <ReportBottomSheet
        bottomSheetRef={reportBottomSheetRef}
        onReport={(reportReason: string) => {
        }}
      />
      <SelfieBottomSheet bottomSheetRef={selfieBottomSheetRef} />
      <TwoConnectsBottomSheet 
        bottomSheetRef={twoConnectsBottomSheetRef} 
        popupContent={popupContent} 
        matchedUser={matchedUsers} 
      />
      <NotificationEnableDialog
        isVisible={showNotificationDialog}
        onDismiss={() => setShowNotificationDialog(false)}
        onEnable={handleEnableNotification}
      />
      <PreferenceDialog
        isVisible={showPreferenceDialog}
        onDismiss={() => setShowPreferenceDialog(false)}
        onSetPreference={() => {
          setShowPreferenceDialog(false);
          (navigation as any).navigate(ROUTES.STACK, {
            screen: ROUTES.PREFERENCE,
          });
        }}
      />
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
