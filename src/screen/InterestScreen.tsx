import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { fontSize14, SIZES } from '../constants/Sizes';
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
} from '../store/reducers/userReducer';
import {
  acceptRejectProposalUrl,
  baseUrl,
  getGalleryImageListUrl,
  getPassedUsersUrl,
  getProposalsGotByMeUrl,
  getSelectedUserUrl,
} from '../constants/functions';
import { getProposalsSendByMeUrl } from '../constants/functions';
import { useNavigation } from '@react-navigation/native';
import AppLoader from '../components/AppLoader';

const InterestScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0); // Set "Recent Passes" as default
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {
    proposalsSendByMe,
    proposalsGotByMe,
    loader,
    passedUsers,
  } = useSelector((state: any) => state.entities.userReducer);
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      bottomSheetRef.current?.close();
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    dispatch(getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`));
    dispatch(getProposalsGotByMeApi(`${baseUrl}/${getProposalsGotByMeUrl}`));
    dispatch(getPassedUsersApi(`${baseUrl}/${getPassedUsersUrl}`));
  }, [dispatch]);
  const handleCardPress = async (id: string) => {
    console.log(id, 'id');
    try {
      dispatch(getSelectedUserApi(`${baseUrl}/${getSelectedUserUrl}?id=${id}`));
      dispatch(
        getCurrentMatchedUserGalleryImageListApi(
          `${baseUrl}/${getGalleryImageListUrl}`,
          {
            userId: id,
          },
        ),
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
      bottomSheetRef.current?.expand(); // Open the bottom sheet
    } catch (error) {
      console.log(error, 'error');
    }
  };
  const handleRejectProposal = (id: string) => {
    try {
      dispatch(
        acceptRejectProposalApi(`${baseUrl}/${acceptRejectProposalUrl}`, {
          proposalUserId: id,
          status: 0,
        }),
      );
      dispatch(getProposalsGotByMeApi(`${baseUrl}/${getProposalsGotByMeUrl}`));
    } catch (error) {
      console.log(error);
    }
  };
  const handleAcceptProposal = (item: any) => {
    try {
      dispatch(
        acceptRejectProposalApi(`${baseUrl}/${acceptRejectProposalUrl}`, {
          proposalUserId: item.id,
          status: 1,
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
    <View style={styles.container}>
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
      {loader ? (
        <AppLoader visible={loader} />
      ) : (
        <>
          {selectedTab === 0 &&
            (proposalsGotByMe.length > 0 ? (
              <FlatList
                data={proposalsGotByMe}
                renderItem={({ item }) => (
                  <ReceivedCard
                    item={item}
                    onDecline={() => handleRejectProposal(item.id)}
                    onConnect={() => handleAcceptProposal(item)}
                    onPress={() => handleCardPress(item.senderUserId)}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.gridContainer}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyStateContainer}>
                <Image
                  source={require('../assets/images/lonely.png')}
                  style={styles.heartImage}
                />
              </View>
            ))}
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
            />
          )}
        </>
      )}

      <ProfileBottomSheet
        bottomSheetRef={bottomSheetRef}
        isButtonVisible={selectedTab === 1}
      />
    </View>
  );
};

export default InterestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: '#E5D8F6',
    fontStyle: 'italic',
  },
  heartImage: {
    width: SIZES.width * 0.55,
    height: SIZES.width * 0.55,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
