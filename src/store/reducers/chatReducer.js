import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../api';
const initialState = {
  loader: false,
  acceptedProposalById: [],
  insertUserNotifications: [],
  unreadChatHistory: [],
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
      console.log(action.payload, 'chatReducer Failed');
    },
    chatReducerAcceptedProposalByIdReceived: (chatReducer, action) => {
      chatReducer.loader = false;
      chatReducer.acceptedProposalById = action.payload.recordList;
    },
    chatReducerInsertUserNotificationsReceived: (chatReducer, action) => {
      chatReducer.loader = false;
      chatReducer.insertUserNotifications = action.payload;
    },
    setUnreadChatHistory: (chatReducer, action) => {
      chatReducer.unreadChatHistory = action.payload;
    },
  },
});

export const { setUnreadChatHistory } = chatReducer.actions;

const {
  chatReducerDataRequestFailed,
  chatReducerDataRequested,
  chatReducerAcceptedProposalByIdReceived,
  chatReducerInsertUserNotificationsReceived,
} = chatReducer.actions;
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
