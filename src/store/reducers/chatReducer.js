import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../api';
const initialState = {
  loader: false,
  acceptedProposalById: [],
  insertUserNotifications: [],
  unreadChatHistory: [],
  newUserNumber: 0,
};

const chatReducer = createSlice({
  name: 'chatReducer',
  initialState,
  reducers: {
    chatReducerDataRequested: (chatReducer, action) => {
      chatReducer.loader = false;
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
      chatReducer.newUserNumber = action.payload.recordList.filter((item) => item.isNewStatus===1).length;
    },
    chatReducerInsertUserNotificationsReceived: (chatReducer, action) => {
      chatReducer.loader = false;
      chatReducer.insertUserNotifications = action.payload;
    },
    setUnreadChatHistory: (chatReducer, action) => {
      chatReducer.unreadChatHistory = action.payload;
    },
    addUnreadChatForeground: (chatReducer, action) => {
      const payload = action.payload || {};
      const newUnreadItem = {
        userId: payload.userId,
        isRead: 0,
        content: payload.content || '',
        created_at: payload.created_at || new Date().toISOString(),
        origin: 'foreground',
      };
      chatReducer.unreadChatHistory = [
        newUnreadItem,
        ...(chatReducer.unreadChatHistory || []),
      ];
    },
  },
});

export const { setUnreadChatHistory, addUnreadChatForeground } = chatReducer.actions;

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
    onStart: chatReducerDataRequested.type,
    onSuccess: chatReducerInsertUserNotificationsReceived.type,
    onError: chatReducerDataRequestFailed.type,
  });
export default chatReducer.reducer;
