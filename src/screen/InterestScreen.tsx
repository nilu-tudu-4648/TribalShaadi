import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { fontSize14, fontSize16, SIZES } from '../constants/Sizes';
import AppText from '../components/AppText';
import { COLORS } from '../constants/AppColors';
import { INTEREST_TABS, ROUTES } from '../constants/data';
import RecentCard from '../components/Cards/RecentCard';
import SentCard from '../components/Cards/SentCard';
import ReceivedCard from '../components/Cards/ReceivedCard';
import ProfileBottomSheet from '../components/BottomSheets/ProfileBottomSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProposalsGotByMeApi,
  getProposalsSendByMeApi,
  acceptRejectProposalApi,
  getPassedUsersApi,
  getSelectedUserApi,
  setAcceptedUser,
  getCurrentMatchedUserGalleryImageListApi,
  getSelectedUserPackageApi,
} from '../store/reducers/userReducer';
import {
  acceptRejectProposalUrl,
  baseUrl,
  getGalleryImageListUrl,
  getPackageByUserIdUrl,
  getPassedUsersUrl,
  getProposalsGotByMeUrl,
  getSelectedUserUrl,
  insertUserNotificationsUrl,
} from '../constants/functions';
import { getProposalsSendByMeUrl } from '../constants/functions';
import { useNavigation } from '@react-navigation/native';
import AppSafeView from '../components/AppSafeView';
import { insertUserNotificationsApi } from '../store/reducers/chatReducer';
import Loader from '../components/loader/Loader';

const InterestScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0); // Set "Recent Passes" as default
  const [refreshing, setRefreshing] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { packageByUserId } = useSelector(
    (state: any) => state.entities.paymentReducer,
  );
  const { user } = useSelector((state: any) => state.entities.authReducer);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {
    proposalsSendByMe,
    proposalsGotByMe,
    loader,
    passedUsers,
    currentUserPackage,
  } = useSelector((state: any) => state.entities.userReducer);
  const fetchData = useCallback(() => {
    dispatch(getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`));
    dispatch(getProposalsGotByMeApi(`${baseUrl}/${getProposalsGotByMeUrl}`));
    dispatch(getPassedUsersApi(`${baseUrl}/${getPassedUsersUrl}`));
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      bottomSheetRef.current?.close();
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refreshing && !loader) {
      setRefreshing(false);
    }
  }, [loader, refreshing]);

  const handleCardPress = async (id: string) => {
    try {
      dispatch(getSelectedUserApi(`${baseUrl}/${getSelectedUserUrl}?id=${id}`));
      dispatch(
        getSelectedUserPackageApi(`${baseUrl}/${getPackageByUserIdUrl}`, {
          userId: id,
        }),
      );
      dispatch(
        getCurrentMatchedUserGalleryImageListApi(
          `${baseUrl}/${getGalleryImageListUrl}`,
          {
            userId: id,
          },
        ),
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
      bottomSheetRef.current?.snapToIndex(0); // Open the bottom sheet at 50%
    } catch (error) {
      console.log(error, 'error');
    }
  };
  const handleRejectProposal = async (id: string) => {
    try {
      dispatch(
        acceptRejectProposalApi(`${baseUrl}/${acceptRejectProposalUrl}`, {
          proposalUserId: id,
          status: 0,
        }),
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch(getProposalsGotByMeApi(`${baseUrl}/${getProposalsGotByMeUrl}`));
    } catch (error) {
      console.log(error);
    }
  };
  const handleAcceptProposal = (item: any) => {
    console.log('handleAcceptProposal', item.senderUserId);
    try {
      dispatch(
        acceptRejectProposalApi(`${baseUrl}/${acceptRejectProposalUrl}`, {
          proposalUserId: item.senderUserId,
          status: 1,
        }),
      );
      dispatch(
        insertUserNotificationsApi(`${baseUrl}/${insertUserNotificationsUrl}`, {
          title: "You've Got a Match! 🎉",
          message: `Great news! ${
            user.firstName + ' ' + (user.lastName ?? '')
          } has accepted your interest. It's time to start a conversation and get to know each other better.`,
          receiverUserId: item.senderUserId,
        }),
      );
      dispatch(getProposalsGotByMeApi(`${baseUrl}/${getProposalsGotByMeUrl}`));
      dispatch(setAcceptedUser(item));
      (navigation as any).navigate(ROUTES.STACK, {
        screen: ROUTES.MATCHING,
      });
    } catch (error) {
      console.log(error, 'error');
    }
  };

  return (
    <>
      <AppSafeView style={styles.container}>
        <AppText text="Interests" textStyle={styles.title} />
        <View style={styles.tabsContainer}>
          {INTEREST_TABS.map((tab, idx) => (
            <TouchableOpacity
              key={tab.label}
              style={[styles.tab, selectedTab === idx && styles.tabSelected]}
              onPress={() => setSelectedTab(idx)}
              activeOpacity={0.8}
            >
              <AppText
                text={tab.label}
                textStyle={[
                  styles.tabText,
                  selectedTab === idx && styles.tabTextSelected,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
        {selectedTab === 0 && (
          <FlatList
            data={proposalsGotByMe}
            renderItem={({ item }) => (
              <ReceivedCard
                item={item}
                onDecline={() => handleRejectProposal(item.senderUserId)}
                onConnect={() => handleAcceptProposal(item)}
                onPress={() => {
                  if (packageByUserId.length > 0) {
                    handleCardPress(item.senderUserId);
                  } else {
                    (navigation as any).navigate(ROUTES.STACK, {
                      screen: ROUTES.UPGRADE,
                    });
                  }
                }}
                planPurchased={packageByUserId.length > 0}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyStateContainer}>
                <Image
                  source={require('../assets/images/lonely.png')}
                  style={styles.heartImage}
                />
              </View>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
        {selectedTab === 1 && (
          <FlatList
            data={passedUsers}
            renderItem={({ item }) => (
              <RecentCard
                item={item}
                onPress={() => handleCardPress(item.id)}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
        {selectedTab === 2 && (
          <FlatList
            data={proposalsSendByMe}
            renderItem={({ item }) => (
              <SentCard
                item={item}
                onPress={() => handleCardPress(item.proposalUserId)}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyStateContainer}>
                <AppText
                  text="Oops. No interests sent!"
                  textStyle={styles.emptyText}
                />
                <AppText
                  text="We know it’s hard. Be patient. Keep exploring & don’t shy away from sending your interersts"
                  textStyle={styles.emptySubText}
                />
              </View>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
        <ProfileBottomSheet
          bottomSheetRef={bottomSheetRef}
          isButtonVisible={selectedTab === 1}
          user={user}
          currentUserPackage={currentUserPackage}
        />
      </AppSafeView>
      {loader && (
        <View style={styles.loaderOverlay}>
          <Loader />
        </View>
      )}
    </>
  );
};

export default InterestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: SIZES.base * 4, // Approximately 48
    paddingHorizontal: SIZES.padding2,
    gap: SIZES.padding,
  },
  title: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    fontFamily: 'System',
    letterSpacing: -1,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: SIZES.base,
  },
  tab: {
    paddingVertical: SIZES.base1,
    paddingHorizontal: SIZES.base,
    borderRadius: SIZES.radius * 0.4,
    backgroundColor: '#F4F3F8',
  },
  tabSelected: {
    backgroundColor: '#000',
  },
  tabText: {
    color: COLORS.textInactive,
    fontSize: fontSize14,
    letterSpacing: 1,
  },
  tabTextSelected: {
    color: '#fff',
  },
  gridContainer: {
    paddingTop: SIZES.base1,
    gap: SIZES.base1,
    rowGap: SIZES.base1,
  },
  row: {
    justifyContent: 'space-between',
  },
  profileCard: {
    width: '48%',
    borderRadius: SIZES.base1,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: SIZES.base1 / 2, // Approximately 8
    elevation: 4,
  },
  profileImage: {
    width: '100%',
    height: SIZES.height * 0.25,
    resizeMode: 'cover',
  },
  profileInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SIZES.base1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  profileName: {
    color: '#fff',
    fontSize: SIZES.h5,
    fontWeight: 'bold',
  },
  profileLocation: {
    color: '#fff',
    fontSize: SIZES.font,
    opacity: 0.9,
  },
  emptyStateContainer: {
    height: SIZES.height * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  emptyText: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.black,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: fontSize16,
    color: COLORS.emptyText,
    textAlign: 'center',
  },
  heartImage: {
    width: SIZES.width * 0.55,
    height: SIZES.width * 0.55,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
