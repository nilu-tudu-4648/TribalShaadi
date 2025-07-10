import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../api';
const initialState = {
  loader: false,
  connectLoader: false,
  declineLoader: false,
  userRegistrationCompleted: false,
  user: null,
  matchedUsers: [],
  sentProposal: [],
  proposalsSendByMe: [],
  proposalsGotByMe: [],
  cancelProposalRequest: [],
  acceptRejectProposal: [],
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
      console.log(action.payload, 'reducer Failed');
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
    setCancelProposalRequestDataReceived: (userReducer, action) => {
      userReducer.loader = false;
      userReducer.cancelProposalRequest = action.payload.recordList;
    },
    setAcceptRejectProposalDataReceived: (userReducer, action) => {
      userReducer.loader = false;
      userReducer.acceptRejectProposal = action.payload.recordList;
    },
  },
});

export const { setUser, setUserRegistrationCompleted } = userReducer.actions;

const {
  userReducerDataRequestFailed,
  userReducerDataRequested,
  setMatchedUser,
  sentProposalDataReceived,
  setProposalsSendByMeDataReceived,
  setProposalsGotByMeDataReceived,
  setCancelProposalRequestDataReceived,
  setAcceptRejectProposalDataReceived,
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
    onStart: userReducerDataRequested.type,
    onSuccess: sentProposalDataReceived.type,
    onError: userReducerDataRequestFailed.type,
  });

export const getProposalsSendByMeApi = (url, data={}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: userReducerDataRequested.type,
    onSuccess: setProposalsSendByMeDataReceived.type,
    onError: userReducerDataRequestFailed.type,
  });
export const getProposalsGotByMeApi = (url, data={}) =>
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
    onStart: userReducerDataRequested.type,
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
    export default userReducer.reducer;
