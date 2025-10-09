// import { StyleSheet, View, Image, Dimensions } from 'react-native';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   runOnJS,
//   Easing,
// } from 'react-native-reanimated';
// import { COLORS } from '../constants/AppColors';
// import { SIZES, fontSize16, fontSize20, Size10 } from '../constants/Sizes';
// import AppSafeView from '../components/AppSafeView';
// import ProfileCard from '../components/Cards/ProfileCard';
// import {
//   baseUrl,
//   passUserUrl,
//   getMatchedUsersUrl,
//   getProposalsSendByMeUrl,
//   getUserDetailsUrl,
//   sendProposalUrl,
//   getReligionUrl,
//   getMaritalStatusUrl,
//   getCommunityUrl,
//   getHeightUrl,
//   getDietUrl,
//   getPassedUsersUrl,
//   getStatesUrl,
//   getGalleryImageListUrl,
//   getPackageByUserIdUrl,
//   insertUserNotificationsUrl,
//   getProposalsGotByMeUrl,
//   getChatHistoryByUserId,
//   getAcceptedProposalByIdUrl,
// } from '../constants/functions';
// import { useDispatch, useSelector } from 'react-redux';
// import AppText from '../components/AppText';
// import ProfileCardShimmer from '../components/ProfileCardShimmer';
// import {
//   cancelProposalRequestApi,
//   getCurrentMatchedApi,
//   getCurrentMatchedUserGalleryImageListApi,
//   getPassedUsersApi,
//   getProposalsGotByMeApi,
//   getProposalsSendByMeApi,
//   sentProposalApi,
//   setMatchedUserApi,
// } from '../store/reducers/userReducer';
// import AppButton from '../components/AppButton';
// import {
//   getCommunity,
//   getDiet,
//   getHeight,
//   getMaritalStatus,
//   getReligion,
//   getStates,
// } from '../store/reducers/authReducer';
// import { getCurrentUserPackageApi } from '../store/reducers/paymentReducer';
// import {
//   getAcceptedProposalByIdApi,
//   insertUserNotificationsApi,
// } from '../store/reducers/chatReducer';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ASYNC_VARIBLES } from '../constants/data';

// // keep for reference: full-screen card uses width/height percentages
// const HomeScreen = () => {
//   const {
//     matchedUsers,
//     currentMatchedUser,
//     currentMatchedUserGalleryImageList,
//   } = useSelector((state: any) => state.entities.userReducer);
//   const { currentUserPackage } = useSelector(
//     (state: any) => state.entities.paymentReducer,
//   );
//   console.log(matchedUsers, 'matchedUsers ');
//   const { user } = useSelector((state: any) => state.entities.authReducer);
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [hasRequestedMatches, setHasRequestedMatches] = useState(false);
//   const [actionInProgress, setActionInProgress] = useState(false);
//   const [detailsCache, setDetailsCache] = useState<Record<number, any>>({});
//   const [galleryCache, setGalleryCache] = useState<Record<number, any[]>>({});
//   const [packageCache, setPackageCache] = useState<Record<number, any[]>>({});

//   /* 1️⃣  keep a stable screen-width value */
//   const screenWidth = useRef(Dimensions.get('window').width).current;

//   // double-buffered cards for seamless transitions
//   const card1X = useSharedValue(0);
//   const card2X = useSharedValue(screenWidth);
//   const [activeCard, setActiveCard] = useState<1 | 2>(1);

//   const card1Style = useAnimatedStyle(() => ({
//     transform: [{ translateX: card1X.value }],
//   }));
//   const card2Style = useAnimatedStyle(() => ({
//     transform: [{ translateX: card2X.value }],
//   }));

//   const startTransition = (direction: 'left' | 'right') => {
//     const nextIdx = currentIndex + 1;
//     // If there are no more matched users, reset to 0 or stop incrementing
//     if (!matchedUsers || matchedUsers.length === 0) {
//       // No matched users, so no transition is possible
//       console.log('No matched users available for transition');
//       return;
//     }
    
//     const targetIdx = nextIdx < matchedUsers.length ? nextIdx : 0; // Loop back to 0 if out of bounds
//     console.log(`startTransition: currentIndex=${currentIndex}, nextIdx=${nextIdx}, targetIdx=${targetIdx}, matchedUsers.length=${matchedUsers.length}, direction=${direction}`);

//      const inFrom = direction === 'right' ? screenWidth : -screenWidth;
//      const outTo = direction === 'right' ? -screenWidth : screenWidth;
 
//      if (activeCard === 1) {
//       card2X.value = inFrom;
//       card1X.value = withTiming(outTo, {
//         duration: 300,
//         easing: Easing.out(Easing.cubic),
//       });
//       card2X.value = withTiming(
//         0,
//         {
//           duration: 300,
//           easing: Easing.out(Easing.cubic),
//         },
//         () => {
//           runOnJS(() => {
//             setActiveCard(2);
//             setCurrentIndex(targetIdx);
//             // Reset the other card's position instantly after it goes off-screen
//             card1X.value = screenWidth;
//           })();
//         },
//       );
//     } else {
//       card1X.value = inFrom;
//       card2X.value = withTiming(outTo, {
//         duration: 300,
//         easing: Easing.out(Easing.cubic),
//       });
//       card1X.value = withTiming(
//         0,
//         {
//           duration: 300,
//           easing: Easing.out(Easing.cubic),
//         },
//         () => {
//           runOnJS(() => {
//             setActiveCard(1);
//             setCurrentIndex(targetIdx);
//             // Reset the other card's position instantly after it goes off-screen
//             card2X.value = screenWidth;
//           })();
//         },
//       );
//     }
//   };

//   const handleSendProposal = async (id: string) => {
//     try {
//       setActionInProgress(true);
//       // Guard: if list is empty, do nothing
//       if (!matchedUsers || matchedUsers.length === 0) {
//         console.log('handleSendProposal: matchedUsers empty, aborting');
//         setActionInProgress(false);
//         return;
//       }
//       // Guard: ensure we have a current user to act on
//       const currentUserId = matchedUsers && matchedUsers[currentIndex] ? matchedUsers[currentIndex].id : id;
//       if (!currentUserId) {
//         console.log('handleSendProposal: no current user id');
//         setActionInProgress(false);
//         return;
//       }
//       // Animate immediately to avoid race with list updates
//       startTransition('right');
//       // Fire requests in background (no global loading)
//       dispatch(
//         sentProposalApi(`${baseUrl}/${sendProposalUrl}`, {
//           proposalUserId: currentUserId,
//         }),
//       );
//       dispatch(
//         getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`),
//       );
//       dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
//       dispatch(
//         insertUserNotificationsApi(`${baseUrl}/${insertUserNotificationsUrl}`, {
//           title: 'Congrats 🎉 new request received!',
//           message: `${user.firstName} ${
//             user.lastName ?? ''
//           } wants to connect with you.`,
//           receiverUserId: currentUserId,
//         }),
//       );
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setActionInProgress(false);
//       console.log('handleSendProposal: action completed, matchedUsers:', matchedUsers.length, 'currentIndex:', currentIndex);
//     }
//   };

//   const handleCancelProposal = async (id: string) => {
//     try {
//       setActionInProgress(true);
//       // Guard: if list is empty, do nothing
//       if (!matchedUsers || matchedUsers.length === 0) {
//         console.log('handleCancelProposal: matchedUsers empty, aborting');
//         setActionInProgress(false);
//         return;
//       }
//       const currentUserId = matchedUsers && matchedUsers[currentIndex] ? matchedUsers[currentIndex].id : id;
//       if (!currentUserId) {
//         console.log('handleCancelProposal: no current user id');
//         setActionInProgress(false);
//         return;
//       }
//       // Animate immediately to avoid race with list updates
//       startTransition('left');
//       // Fire requests in background
//       dispatch(
//         cancelProposalRequestApi(`${baseUrl}/${passUserUrl}`, {
//           proposalUserId: currentUserId,
//         }),
//       );
//       dispatch(getPassedUsersApi(`${baseUrl}/${getPassedUsersUrl}`));
//       dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setActionInProgress(false);
//       console.log('handleCancelProposal: action completed, matchedUsers:', matchedUsers.length, 'currentIndex:', currentIndex);
//     }
//   };
//   // Helper: fetch user details silently (no redux)
//   const fetchDetailSilently = useCallback(
//     async (userId: number) => {
//       try {
//         if (!userId || detailsCache[userId]) return;
//         const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
//         if (!token) return;
//         const resp = await axios.get(
//           `${baseUrl}/${getUserDetailsUrl}id=${userId}`,
//           { headers: { Authorization: `Bearer ${token}` } },
//         );
//         const record = resp?.data?.recordList?.[0];
//         if (record) setDetailsCache(prev => ({ ...prev, [userId]: record }));
//       } catch (e) {}
//     },
//     [detailsCache],
//   );
//   // Helper: fetch gallery silently
//   const fetchGallerySilently = useCallback(
//     async (userId: number) => {
//       try {
//         if (!userId || galleryCache[userId]) return;
//         const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
//         if (!token) return;
//         const resp = await axios.post(
//           `${baseUrl}/${getGalleryImageListUrl}`,
//           { userId },
//           { headers: { Authorization: `Bearer ${token}` } },
//         );
//         const list = resp?.data?.recordList ?? [];
//         setGalleryCache(prev => ({ ...prev, [userId]: list }));
//       } catch (e) {}
//     },
//     [galleryCache],
//   );
//   // Helper: fetch package silently
//   const fetchPackageSilently = useCallback(
//     async (userId: number) => {
//       try {
//         if (!userId || packageCache[userId]) return;
//         const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
//         if (!token) return;
//         const resp = await axios.post(
//           `${baseUrl}/${getPackageByUserIdUrl}`,
//           { userId },
//           { headers: { Authorization: `Bearer ${token}` } },
//         );
//         const list = resp?.data?.recordList ?? [];
//         setPackageCache(prev => ({ ...prev, [userId]: list }));
//       } catch (e) {}
//     },
//     [packageCache],
//   );
//   useEffect(() => {
//     dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
//     const id =
//       user?.pReligionId !== 'any' && user?.pReligionId?.[0]
//         ? user?.pReligionId?.[0]
//         : user?.religionId;
//     dispatch(getCommunity(`${getCommunityUrl}religionId=${id}`));
//     setHasRequestedMatches(true);
//   }, [dispatch, user?.pReligionId, user?.religionId]);

//   useEffect(() => {
//     if (matchedUsers.length > 0 && currentIndex >= matchedUsers.length) {
//       setCurrentIndex(0);
//     }
//   }, [matchedUsers.length, currentIndex]);

//   useEffect(() => {
//     dispatch(getMaritalStatus(getMaritalStatusUrl));
//     dispatch(getReligion(getReligionUrl));
//     dispatch(getHeight(getHeightUrl));
//     dispatch(getDiet(getDietUrl));
//     dispatch(getStates(getStatesUrl));
//   }, [dispatch]);
//   useEffect(() => {
//     const fetchChatHistory = async () => {
//       try {
//         dispatch(
//           getAcceptedProposalByIdApi(
//             `${getAcceptedProposalByIdUrl}/${user?.id}`,
//           ),
//         );
//         await getChatHistoryByUserId(user.id, dispatch);
//       } catch (error) {
//         console.log(error, 'error');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchChatHistory();
//   }, [user?.id, dispatch]);

//   useEffect(() => {
//     dispatch(getProposalsGotByMeApi(`${baseUrl}/${getProposalsGotByMeUrl}`));
//     if (matchedUsers && matchedUsers.length > currentIndex) {
//       const currentUserId = matchedUsers[currentIndex].id;
//       // Only fetch current user data - remove the problematic next user prefetch
//       dispatch(
//         getCurrentMatchedApi(
//           `${baseUrl}/${getUserDetailsUrl}id=${currentUserId}`,
//         ),
//       );
//       dispatch(
//         getCurrentUserPackageApi(`${baseUrl}/${getPackageByUserIdUrl}`, {
//           userId: currentUserId,
//         }),
//       );

//       dispatch(
//         getCurrentMatchedUserGalleryImageListApi(
//           `${baseUrl}/${getGalleryImageListUrl}`,
//           {
//             userId: currentUserId,
//           },
//         ),
//       );
//     }
//   }, [dispatch, matchedUsers, currentIndex]);
//   // Cache redux-fetched current data into local caches keyed by user id
//   useEffect(() => {
//     if (!matchedUsers || matchedUsers.length === 0) return;
//     if (currentIndex >= matchedUsers.length) return;
//     const curId = matchedUsers[currentIndex]?.id;
//     if (!curId) return;
//     if (currentMatchedUser) {
//       setDetailsCache(prev => ({ ...prev, [curId]: currentMatchedUser }));
//     }
//     if (Array.isArray(currentMatchedUserGalleryImageList)) {
//       setGalleryCache(prev => ({
//         ...prev,
//         [curId]: currentMatchedUserGalleryImageList,
//       }));
//     }
//     if (Array.isArray(currentUserPackage)) {
//       setPackageCache(prev => ({ ...prev, [curId]: currentUserPackage }));
//     }
//   }, [
//     currentMatchedUser,
//     currentMatchedUserGalleryImageList,
//     currentUserPackage,
//     currentIndex,
//     matchedUsers,
//   ]);
//   // Prefetch previous, current, and next-next users in background for smoothness
//   useEffect(() => {
//     if (!matchedUsers || matchedUsers.length === 0) return;
//     const prevIdx = currentIndex > 0 ? currentIndex - 1 : -1;
//     const nextIdx =
//       currentIndex + 1 < matchedUsers.length ? currentIndex + 1 : -1;
//     const nextNextIdx =
//       currentIndex + 2 < matchedUsers.length ? currentIndex + 2 : -1;
//     const prevId = prevIdx >= 0 ? matchedUsers[prevIdx]?.id : undefined;
//     const nextId = nextIdx >= 0 ? matchedUsers[nextIdx]?.id : undefined;
//     const nextNextId =
//       nextNextIdx >= 0 ? matchedUsers[nextNextIdx]?.id : undefined;

//     const currentCardImageUrl = matchedUsers[currentIndex]?.imageUrl;
//     if (currentCardImageUrl) Image.prefetch(currentCardImageUrl);
//     const prevCardImageUrl = matchedUsers[prevIdx]?.imageUrl;
//     if (prevCardImageUrl) Image.prefetch(prevCardImageUrl);
//     const nextCardImageUrl = matchedUsers[nextIdx]?.imageUrl;
//     if (nextCardImageUrl) Image.prefetch(nextCardImageUrl);
//     const nextNextCardImageUrl = matchedUsers[nextNextIdx]?.imageUrl;
//     if (nextNextCardImageUrl) Image.prefetch(nextNextCardImageUrl);

//     if (prevId) {
//       fetchDetailSilently(prevId);
//       fetchGallerySilently(prevId);
//       fetchPackageSilently(prevId);
//     }
//     if (nextId) {
//       fetchDetailSilently(nextId);
//       fetchGallerySilently(nextId);
//       fetchPackageSilently(nextId);
//     }
//     if (nextNextId) {
//       fetchDetailSilently(nextNextId);
//       fetchGallerySilently(nextNextId);
//       fetchPackageSilently(nextNextId);
//     }
//   }, [
//     matchedUsers,
//     currentIndex,
//     fetchDetailSilently,
//     fetchGallerySilently,
//     fetchPackageSilently,
//   ]);
//   // Reset when list becomes empty to avoid any out-of-bounds access
//   useEffect(() => {
//     if (!matchedUsers || matchedUsers.length === 0) {
//       setCurrentIndex(0);
//       setActiveCard(1);
//       card1X.value = 0;
//       card2X.value = screenWidth;
//     }
//   }, [matchedUsers, screenWidth, card1X, card2X]);
//   // console.log(matchedUsers, 'matchedUsers');
//   return (
//     <View style={styles.container}>
//       <AppSafeView style={styles.container}>
//         <>
//           {/* show shimmer only on first load */}
//           {!hasRequestedMatches || (isLoading && matchedUsers.length === 0) ? (
//             <ProfileCardShimmer />
//           ) : matchedUsers.length > 0 && currentIndex < matchedUsers.length ? (
//             <>
//               <View style={styles.carouselContainer}>
//                 {/* Card 1 */}
//                 <Animated.View
//                   style={[styles.profileCardContainer, card1Style]}
//                 >
//                   {(() => {
//                     if (!matchedUsers || matchedUsers.length === 0 || currentIndex >= matchedUsers.length) {
//                       return null;
//                     }
//                     const curId = matchedUsers[currentIndex]?.id;
//                     const cachedDetail = curId ? detailsCache[curId] : null;
//                     const cachedGallery = curId ? galleryCache[curId] : null;
//                     const cachedPackage = curId ? packageCache[curId] : null;
//                     // Prioritize matchedUsers data, then enrich with cachedDetail
//                     const baseUser = matchedUsers[currentIndex] || {};
//                     const finalDetail = { ...baseUser, ...cachedDetail };
//                     const galleryList =
//                       (cachedGallery as any)?.length > 0
//                         ? cachedGallery
//                         : baseUser.galleryImageList || [];
//                     const isPremium = (cachedPackage?.length ?? 0) > 0;

//                     console.log('Rendering Card 1:', {
//                       currentIndex,
//                       finalDetail: finalDetail?.id, // log id for brevity
//                       galleryListLength: galleryList.length,
//                       isPremium,
//                     });
//                     return (
//                       <ProfileCard
//                         name={finalDetail?.firstName + ' ' + (finalDetail?.lastName ?? '')}
//                         isNameLoading={false}
//                         age={finalDetail?.age}
//                         height={finalDetail?.height}
//                         religion={finalDetail?.religion}
//                         caste={finalDetail?.community}
//                         districtName={finalDetail?.districtName}
//                         stateName={finalDetail?.stateName}
//                         bio={finalDetail?.aboutMe}
//                         image={finalDetail?.imageUrl || ''}
//                         galleryImageList={galleryList}
//                         isLoading={false}
//                         maritalStatus={finalDetail?.maritalStatus}
//                         dob={finalDetail?.birthDate}
//                         motherTongue={finalDetail?.motherTongue}
//                         annualIncome={finalDetail?.annualIncome}
//                         partnerExpectation={finalDetail?.about_lifepartener}
//                         employedIn={finalDetail?.employmentType}
//                         occupation={finalDetail?.occupation}
//                         organizationName={finalDetail?.companyName}
//                         settlingTime={finalDetail?.planingto_settle}
//                         highestQualification={finalDetail?.educationType}
//                         college={finalDetail?.college_name}
//                         eatingHabits={finalDetail?.diet}
//                         drinkingHabits={finalDetail?.drinking}
//                         smokingHabits={finalDetail?.smoking}
//                         kids={finalDetail?.kids}
//                         interests={finalDetail?.intrests}
//                         isVerified={finalDetail?.isVerified}
//                         isPremium={isPremium}
//                       />
//                     );
//                   })()}
//                 </Animated.View>
//                 {/* Card 2: always render the next profile off-screen */}
//                 <Animated.View
//                   style={[styles.profileCardContainer, card2Style]}
//                 >
//                   {(() => {
//                     if (!matchedUsers || matchedUsers.length === 0) {
//                       return null;
//                     }
//                     const nextIndex =
//                       currentIndex + 1 < matchedUsers.length
//                         ? currentIndex + 1
//                         : 0;
//                     const nextId = matchedUsers[nextIndex]?.id;
//                     const cachedDetail = nextId ? detailsCache[nextId] : null;
//                     const cachedGallery = nextId ? galleryCache[nextId] : null;
//                     const cachedPackage = nextId ? packageCache[nextId] : null;
                    
//                     // Prioritize matchedUsers data, then enrich with cachedDetail
//                     const baseUser = matchedUsers[nextIndex] || {};
//                     const finalDetail = { ...baseUser, ...cachedDetail };
//                     const galleryList = (cachedGallery as any)?.length > 0 ? cachedGallery : baseUser.galleryImageList || [];
//                     const isPremium = (cachedPackage?.length ?? 0) > 0;

//                     console.log('Rendering Card 2 (next):', {
//                       nextIndex,
//                       finalDetail: finalDetail?.id, // log id for brevity
//                       galleryListLength: galleryList.length,
//                       isPremium,
//                     });
//                     return (
//                       <ProfileCard
//                         name={finalDetail?.firstName + ' ' + (finalDetail?.lastName ?? '')}
//                         isNameLoading={false}
//                         age={finalDetail?.age}
//                         height={finalDetail?.height}
//                         religion={finalDetail?.religion}
//                         caste={finalDetail?.community}
//                         districtName={finalDetail?.districtName}
//                         stateName={finalDetail?.stateName}
//                         bio={finalDetail?.aboutMe}
//                         image={finalDetail?.imageUrl || ''}
//                         galleryImageList={galleryList}
//                         isLoading={false}
//                         maritalStatus={finalDetail?.maritalStatus}
//                         dob={finalDetail?.birthDate}
//                         motherTongue={finalDetail?.motherTongue}
//                         annualIncome={finalDetail?.annualIncome}
//                         partnerExpectation={finalDetail?.about_lifepartener}
//                         employedIn={finalDetail?.employmentType}
//                         occupation={finalDetail?.occupation}
//                         organizationName={finalDetail?.companyName}
//                         settlingTime={finalDetail?.planingto_settle}
//                         highestQualification={finalDetail?.educationType}
//                         college={finalDetail?.college_name}
//                         eatingHabits={finalDetail?.diet}
//                         drinkingHabits={finalDetail?.drinking}
//                         smokingHabits={finalDetail?.smoking}
//                         kids={finalDetail?.kids}
//                         interests={finalDetail?.intrests}
//                         isVerified={finalDetail?.isVerified}
//                         isPremium={isPremium}

//                       />
//                     );
//                   })()}
//                 </Animated.View>
//               </View>
//               {/* Optional: Keep buttons for users who prefer tapping */}
//               <View style={styles.floatingButtonContainer}>
//                 <AppButton
//                   title="Decline"
//                   onPress={() =>
//                     handleCancelProposal(matchedUsers[currentIndex].id)
//                   }
//                   buttonStyle={styles.declineButton}
//                   textStyle={styles.declineButtonText}
//                   isButtonDisabled={actionInProgress}
//                   pressable={true}
//                 />
//                 <AppButton
//                   title="Connect"
//                   onPress={() =>
//                     handleSendProposal(matchedUsers[currentIndex].id)
//                   }
//                   buttonStyle={styles.connectButton}
//                   textStyle={styles.connectButtonText}
//                   isButtonDisabled={actionInProgress}
//                   pressable={true}
//                 />
//               </View>
//             </>
//           ) : (
//             <View style={styles.exhaustedContainer}>
//               <Image
//                 source={require('../assets/images/ExhaustedImage.png')}
//                 style={styles.exhaustedImage}
//               />
//               <AppText
//                 text="All matches exhausted"
//                 textStyle={styles.exhaustedTitle}
//               />
//               <AppText
//                 text="Come back and check tomorrow for more matches"
//                 textStyle={styles.exhaustedSubtitle}
//               />
//             </View>
//           )}
//         </>
//       </AppSafeView>
//     </View>
//   );
// };

// export default React.memo(HomeScreen);

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     padding: 0,
//   },
//   topBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.divider,
//     paddingVertical: SIZES.padding,
//     paddingHorizontal: SIZES.padding,
//     gap: SIZES.base,
//   },
//   logo: {
//     width: SIZES.h4,
//     height: SIZES.h4,
//     resizeMode: 'contain',
//   },
//   topBarTitle: {
//     fontSize: fontSize20,
//     fontWeight: '700',
//     color: COLORS.textBlack,
//   },
//   floatingButtonContainer: {
//     position: 'absolute',
//     bottom: Size10,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     paddingHorizontal: SIZES.padding,
//   },
//   declineButton: {
//     backgroundColor: COLORS.white,
//     width: '45%',
//     elevation: 2,
//     borderRadius: Size10,
//   },
//   declineButtonText: {
//     color: COLORS.declineButton,
//     fontSize: fontSize16,
//     fontWeight: '600',
//   },
//   connectButton: {
//     backgroundColor: COLORS.violet,
//     width: '45%',
//     elevation: 2,
//     borderRadius: Size10,
//   },
//   connectButtonText: {
//     color: COLORS.white,
//   },
//   carouselContainer: {
//     flex: 1,
//     overflow: 'hidden',
//   },
//   flexContainer: {
//     flex: 1,
//   },
//   profileCardContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     width: '100%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   exhaustedContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   exhaustedImage: {
//     width: SIZES.width * 0.2,
//     height: SIZES.height * 0.1,
//     resizeMode: 'contain',
//   },
//   exhaustedTitle: {
//     fontSize: fontSize20,
//     textAlign: 'center',
//     fontWeight: '700',
//   },
//   exhaustedSubtitle: {
//     fontSize: fontSize16,
//     color: COLORS.textInactive,
//     textAlign: 'center',
//     fontWeight: '600',
//   },
// });
