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

const authReducer = createSlice({
  name: 'authReducer',
  initialState,
  reducers: {
    authReducerDataRequested: (authReducer, action) => {
      authReducer.loader = true;
    },
    authReducerDataReceived: (authReducer, action) => {
      authReducer.loader = false;
      authReducer.user = action.payload.data;
    },
    authReducerDataRequestFailed: (authReducer, action) => {
      authReducer.loader = false;
      console.log(action.payload, 'reducer Failed');
    },
    setUserRegistrationCompleted: (authReducer, action) => {
      authReducer.userRegistrationCompleted = action.payload;
    },
    setMatchedUser: (authReducer, action) => {
      authReducer.matchedUsers = action.payload.recordList;
      authReducer.loader = false;
    },
    sentProposalDataReceived: (authReducer, action) => {
      authReducer.sentProposal = action.payload.recordList;
      authReducer.loader = false;
    },
    setProposalsSendByMeDataReceived: (authReducer, action) => {
      authReducer.proposalsSendByMe = action.payload.recordList;
      authReducer.loader = false;
    },
    setProposalsGotByMeDataReceived: (authReducer, action) => {
      authReducer.proposalsGotByMe = action.payload.recordList;
      authReducer.loader = false;
    },
    setCancelProposalRequestDataReceived: (authReducer, action) => {
      authReducer.loader = false;
      authReducer.cancelProposalRequest = action.payload.recordList;
    },
    setAcceptRejectProposalDataReceived: (authReducer, action) => {
      authReducer.loader = false;
      authReducer.acceptRejectProposal = action.payload.recordList;
    },
  },
});

export const { setUser, setUserRegistrationCompleted } = authReducer.actions;

const {
  authReducerDataRequestFailed,
  authReducerDataRequested,
  setMatchedUser,
  sentProposalDataReceived,
  setProposalsSendByMeDataReceived,
  setProposalsGotByMeDataReceived,
  setCancelProposalRequestDataReceived,
  setAcceptRejectProposalDataReceived,
  } = authReducer.actions;
export const setMatchedUserApi = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: authReducerDataRequested.type,
    onSuccess: setMatchedUser.type,
    onError: authReducerDataRequestFailed.type,
  });

export const sentProposalApi = (url, data) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: authReducerDataRequested.type,
    onSuccess: sentProposalDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });

export const getProposalsSendByMeApi = (url, data={}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: authReducerDataRequested.type,
    onSuccess: setProposalsSendByMeDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const getProposalsGotByMeApi = (url, data={}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: authReducerDataRequested.type,
    onSuccess: setProposalsGotByMeDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });

export const cancelProposalRequestApi = (url, data) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: authReducerDataRequested.type,
    onSuccess: setCancelProposalRequestDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });

  export const acceptRejectProposalApi = (url, data) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: authReducerDataRequested.type,
    onSuccess: setAcceptRejectProposalDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
    export default authReducer.reducer;
