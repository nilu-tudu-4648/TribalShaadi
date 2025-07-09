import { StyleSheet, View, Image, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { COLORS } from '../constants/AppColors';
import { SIZES, fontSize16, fontSize20, Size50 } from '../constants/Sizes';
import AppSafeView from '../components/AppSafeView';
import ProfileCard from '../components/Cards/ProfileCard';
import {
  baseUrl,
  cancelProposalRequestUrl,
  getMatchedUsersUrl,
  getProposalsSendByMeUrl,
  sendProposalUrl,
} from '../constants/functions';
import { useDispatch, useSelector } from 'react-redux';
import GradientLoader from '../components/GradientLoader';
import AppText from '../components/AppText';
import {
  sentProposalApi,
  setMatchedUserApi,
  getProposalsSendByMeApi,
  cancelProposalRequestApi,
} from '../store/reducers/userReducer';

const HomeScreen = () => {
  const { matchedUsers, loader } = useSelector(
    (state: any) => state.entities.userReducer,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setMatchedUserApi(`${baseUrl}/${getMatchedUsersUrl}`));
  }, [dispatch]);
  const handleSendProposal = (id: string) => {
    dispatch(
      sentProposalApi(`${baseUrl}/${sendProposalUrl}`, { proposalUserId: id }),
    );
    dispatch(getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`));
  };
  const handleCancelProposal = (id: string) => {
    dispatch(
      cancelProposalRequestApi(`${baseUrl}/${cancelProposalRequestUrl}`, {
        proposalUserId: id,
      }),
    );
    dispatch(getProposalsSendByMeApi(`${baseUrl}/${getProposalsSendByMeUrl}`));
  };
  return (
    <AppSafeView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image
          source={require('../assets/images/AILogo.png')}
          style={styles.logo}
        />
        <AppText text="Matches" textStyle={styles.topBarTitle} />
      </View>
      {loader ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <GradientLoader size={Size50} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          {/* Profile Card */}
          {matchedUsers && matchedUsers.length > 0 ? (
            matchedUsers.map((item: any, index: number) => (
              <ProfileCard
                key={index}
                name={item.firstName + ' ' + item.lastName}
                age={item.age}
                height={item.height}
                religion={item.religionName}
                caste={item.caste}
                districtName={item.districtName}
                stateName={item.stateName}
                bio={item.aboutMe}
                image={item.imageUrl}
                onDecline={() => handleCancelProposal(item.id)}
                isLoading={loader}
                onConnect={() => handleSendProposal(item.id)}
              />
            ))
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../assets/images/noMatch.png')}
                style={{
                  width: SIZES.width * 0.6,
                  height: SIZES.height * 0.3,
                  resizeMode: 'contain',
                }}
              />
              <AppText
                text="New profiles are joining soon! You'll get notified for new matches."
                textStyle={{
                  fontSize: fontSize16,
                  color: COLORS.textInactive,
                  textAlign: 'center',
                  fontWeight: '600',
                }}
              />
            </View>
          )}
        </ScrollView>
      )}
    </AppSafeView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
});
