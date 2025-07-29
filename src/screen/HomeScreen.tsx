import { StyleSheet, View, Image, Dimensions, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
import { getCurrentUserPackageApi } from '../store/reducers/paymentReducer';

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
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

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
      dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
      // Don't increment index here - let the useEffect handle it when matchedUsers updates
    } catch (error) {
      console.log(error, 'error');
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
      dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
      // Don't increment index here - let the useEffect handle it when matchedUsers updates
    } catch (error) {
      console.log(error, 'error');
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
  // console.log(currentUser, 'currentUser');

  return (
    <GestureHandlerRootView style={styles.container}>
      <AppSafeView style={styles.container}>
        {loader ? (
          <AppLoader />
        ) : (
          <>
            {/* Profile Card */}
            {matchedUsers.length > 0 && currentIndex < matchedUsers.length ? (
              <>
                <View style={styles.carouselContainer}>
                  <FlatList
                    data={matchedUsers}
                    keyExtractor={item => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={Dimensions.get('window').width}
                    onMomentumScrollEnd={e => {
                      const newIndex = Math.round(
                        e.nativeEvent.contentOffset.x /
                          Dimensions.get('window').width,
                      );
                      setCurrentIndex(newIndex);
                    }}
                    renderItem={({ item }) => (
                      <View
                        style={[
                          styles.profileCardContainer,
                          { width: Dimensions.get('window').width },
                        ]}
                      >
                        <ProfileCard
                          name={item.firstName + ' ' + (item.lastName ?? '')}
                          age={item.age}
                          height={item.height}
                          religion={item.religion}
                          caste={item.community}
                          districtName={item.districtName}
                          stateName={item.stateName}
                          bio={item.aboutMe}
                          image={item.imageUrl || ''}
                          galleryImageList={
                            currentMatchedUserGalleryImageList ||
                            item.galleryImageList ||
                            []
                          }
                          isLoading={loader}
                          maritalStatus={currentMatchedUser?.maritalStatus}
                          dob={item.birthDate}
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
                    )}
                  />
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
        )}
      </AppSafeView>
    </GestureHandlerRootView>
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
