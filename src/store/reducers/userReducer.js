import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../api';
const initialState = {
  loader: false,
  userRegistrationCompleted: false,
  user: null,
  matchedUsers: [],
  currentMatchedUser: null,
  currentMatchedUserGalleryImageList: [],
  sentProposal: [],
  proposalsSendByMe: [],
  proposalsGotByMe: [],
  passedUsers: [],
  cancelProposalRequest: [],
  acceptRejectProposal: [],
  selectedUser: null,
  acceptedUser: [],
  homeTabRefr: false,
  galleryImageList: [],
};

const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    userReducerDataRequested: (userReducer, action) => {
      userReducer.loader = true;
    },
    userReducerDataReceived: (userReducer, action) => {
      userReducer.loader = false;
      userReducer.user = action.payload.data;
    },
    userReducerDataRequestFailed: (userReducer, action) => {
      userReducer.loader = false;
      console.log('userReducerDataRequestFailed', action.payload);
      if (action.payload.message === 'No Matches Found') {
        userReducer.matchedUsers = [];
      }
    },
    setUserRegistrationCompleted: (userReducer, action) => {
      userReducer.userRegistrationCompleted = action.payload;
    },
    setMatchedUser: (userReducer, action) => {
      userReducer.matchedUsers = action.payload.recordList;
      userReducer.loader = false;
    },
    sentProposalDataReceived: (userReducer, action) => {
      userReducer.sentProposal = action.payload.recordList;
      userReducer.loader = false;
    },
    setProposalsSendByMeDataReceived: (userReducer, action) => {
      userReducer.proposalsSendByMe = action.payload.recordList;
      userReducer.loader = false;
    },
    setProposalsGotByMeDataReceived: (userReducer, action) => {
      userReducer.proposalsGotByMe = action.payload.recordList;
      userReducer.loader = false;
    },
    setPassedUsersDataReceived: (userReducer, action) => {
      userReducer.passedUsers = action.payload.recordList;
      userReducer.loader = false;
    },
    setCancelProposalRequestDataReceived: (userReducer, action) => {
      userReducer.loader = false;
      userReducer.cancelProposalRequest = action.payload.recordList;
    },
    setAcceptRejectProposalDataReceived: (userReducer, action) => {
      userReducer.loader = false;
      console.log('setAcceptRejectProposalDataReceived', action.payload.recordList);
      userReducer.acceptRejectProposal = action.payload.recordList;
    },
    setCurrentMatchedDataReceived: (userReducer, action) => {
      userReducer.loader = false;
      userReducer.currentMatchedUser = action.payload.recordList[0];
    },
    setSelectedUserDataReceived: (userReducer, action) => {
      userReducer.loader = false;
      userReducer.selectedUser = action.payload.recordList[0];
    },
    setAcceptedUser: (userReducer, action) => {
      userReducer.loader = false;
      userReducer.acceptedUser = action.payload;
    },
    setHomeTabRefr: (userReducer, action) => {
      userReducer.homeTabRefr = action.payload;
    },
    setSelectedUser: (userReducer, action) => {
      userReducer.selectedUser = action.payload;
    },
    setGalleryImageDataReceived: (userReducer, action) => {
      userReducer.galleryImageList = action.payload.recordList;
      userReducer.loader = false;
    },
    setCurrentMatchedUserGalleryImageList: (userReducer, action) => {
      userReducer.currentMatchedUserGalleryImageList =
        action.payload.recordList;
      userReducer.loader = false;
    },
    setReducerCleaned: (userReducer, action) => {
      userReducer.loader = false;
      userReducer.matchedUsers = [];
      userReducer.currentMatchedUser = null;
      userReducer.currentMatchedUserGalleryImageList = [];
      userReducer.sentProposal = [];
    },
  },
});

export const {
  setUserRegistrationCompleted,
  setAcceptedUser,
  setHomeTabRefr,
  setSelectedUser,
  setReducerCleaned
} = userReducer.actions;

const {
  userReducerDataRequestFailed,
  userReducerDataRequested,
  setMatchedUser,
  sentProposalDataReceived,
  setProposalsSendByMeDataReceived,
  setProposalsGotByMeDataReceived,
  setPassedUsersDataReceived,
  setCancelProposalRequestDataReceived,
  setAcceptRejectProposalDataReceived,
  setCurrentMatchedDataReceived,
  setSelectedUserDataReceived,
  setGalleryImageDataReceived,
  setCurrentMatchedUserGalleryImageList,
} = userReducer.actions;
export const setMatchedUserApi = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: userReducerDataRequested.type,
    onSuccess: setMatchedUser.type,
    onError: userReducerDataRequestFailed.type,
  });

export const sentProposalApi = (url, data) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: userReducerDataRequestFailed.type,
    onSuccess: sentProposalDataReceived.type,
    onError: userReducerDataRequestFailed.type,
  });

export const getProposalsSendByMeApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: userReducerDataRequestFailed.type,
    onSuccess: setProposalsSendByMeDataReceived.type,
    onError: userReducerDataRequestFailed.type,
  });
export const getProposalsGotByMeApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: userReducerDataRequested.type,
    onSuccess: setProposalsGotByMeDataReceived.type,
    onError: userReducerDataRequestFailed.type,
  });

export const cancelProposalRequestApi = (url, data) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: userReducerDataRequestFailed.type,
    onSuccess: setCancelProposalRequestDataReceived.type,
    onError: userReducerDataRequestFailed.type,
  });

export const acceptRejectProposalApi = (url, data) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: userReducerDataRequested.type,
    onSuccess: setAcceptRejectProposalDataReceived.type,
    onError: userReducerDataRequestFailed.type,
  });

export const getCurrentMatchedApi = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: userReducerDataRequestFailed.type,
    onSuccess: setCurrentMatchedDataReceived.type,
    onError: userReducerDataRequestFailed.type,
  });
export const getCurrentMatchedUserGalleryImageListApi = (url, data) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: userReducerDataRequestFailed.type,
    onSuccess: setCurrentMatchedUserGalleryImageList.type,
    onError: userReducerDataRequestFailed.type,
  });
export const getPassedUsersApi = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: userReducerDataRequested.type,
    onSuccess: setPassedUsersDataReceived.type,
    onError: userReducerDataRequestFailed.type,
  });
export const getSelectedUserApi = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: userReducerDataRequested.type,
    onSuccess: setSelectedUserDataReceived.type,
    onError: userReducerDataRequestFailed.type,
  });
export const getGalleryImageListApi = (url, data) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: userReducerDataRequestFailed.type,
    onSuccess: setGalleryImageDataReceived.type,
    onError: userReducerDataRequestFailed.type,
  });
export default userReducer.reducer;
