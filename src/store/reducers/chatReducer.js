import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../api';
const initialState = {
  loader: false,
  userChatList: [],
  allChatHistoryByUserId: [],
  sendMessage: [],
  messages: [],
  friendRequestAccept: [],
  acceptedProposalById: [],
  insertUserNotifications: [],
};

const chatReducer = createSlice({
  name: 'chatReducer',
  initialState,
  reducers: {
    chatReducerDataRequested: (chatReducer, action) => {
      chatReducer.loader = true;
    },
    chatReducerDataReceived: (chatReducer, action) => {
      chatReducer.loader = false;
      chatReducer.chatList = action.payload.recordList;
    },
    chatReducerDataRequestFailed: (chatReducer, action) => {
      chatReducer.loader = false;
      console.log(action.payload, 'reducer Failed');
    },
    chatReducerUserChatListReceived: (chatReducer, action) => {
      chatReducer.loader = false;
      chatReducer.userChatList = action.payload.recordList;
    },
    chatReducerAllChatHistoryByUserIdReceived: (chatReducer, action) => {
      chatReducer.loader = false;
      chatReducer.allChatHistoryByUserId = action.payload.recordList;
    },
    chatReducerSendMessageReceived: (chatReducer, action) => {
      chatReducer.loader = false;
      chatReducer.sendMessage = action.payload;
      console.log('action.payload', action.payload);
    },
    chatReducerMessagesReceived: (chatReducer, action) => {
      chatReducer.loader = false;
      chatReducer.messages = action.payload.recordList;
    },
    chatReducerFriendRequestAcceptReceived: (chatReducer, action) => {
      chatReducer.loader = false;
      chatReducer.friendRequestAccept = action.payload;
    },
    chatReducerAcceptedProposalByIdReceived: (chatReducer, action) => {
      chatReducer.loader = false;
      chatReducer.acceptedProposalById = action.payload.recordList;
    },
    chatReducerInsertUserNotificationsReceived: (chatReducer, action) => {
      chatReducer.loader = false;
      console.log('chatReducerInsertUserNotificationsReceived.payload', action.payload);
      chatReducer.insertUserNotifications = action.payload;
    },
  },
});

// export const {  } = paymentReducer.actions;

const {
  chatReducerDataRequestFailed,
  chatReducerDataRequested,
  chatReducerDataReceived,
  chatReducerUserChatListReceived,
  chatReducerAllChatHistoryByUserIdReceived,
  chatReducerSendMessageReceived,
  chatReducerMessagesReceived,
  chatReducerFriendRequestAcceptReceived,
  chatReducerAcceptedProposalByIdReceived,
  chatReducerInsertUserNotificationsReceived,
} = chatReducer.actions;
export const getUserChatListApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: chatReducerDataRequested.type,
    onSuccess: chatReducerUserChatListReceived.type,
    onError: chatReducerDataRequestFailed.type,
  });
export const getAllChatHistoryByUserIdApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: chatReducerDataRequested.type,
    onSuccess: chatReducerAllChatHistoryByUserIdReceived.type,
    onError: chatReducerDataRequestFailed.type,
  });   
export const sendMessageApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: chatReducerDataRequested.type,
    onSuccess: chatReducerSendMessageReceived.type,
    onError: chatReducerDataRequestFailed.type,
  });
export const getMessagesApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: chatReducerDataRequested.type,
    onSuccess: chatReducerMessagesReceived.type,
    onError: chatReducerDataRequestFailed.type,
  });
export const friendRequestAcceptApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: chatReducerDataRequested.type,
    onSuccess: chatReducerFriendRequestAcceptReceived.type,
    onError: chatReducerDataRequestFailed.type,
  });
export const getAcceptedProposalByIdApi = (url, data = {}) =>
  apiCallBegan({
    method: 'get',
    url,
    data,
    onStart: chatReducerDataRequested.type,
    onSuccess: chatReducerAcceptedProposalByIdReceived.type,
    onError: chatReducerDataRequestFailed.type,
  });
export const insertUserNotificationsApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: chatReducerDataRequestFailed.type,
    onSuccess: chatReducerInsertUserNotificationsReceived.type,
    onError: chatReducerDataRequestFailed.type,
  });
export default chatReducer.reducer;
