import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../api';
const initialState = {
  loader: false,
  chatList: [],
  userChatList: [],
  allChatHistoryByUserId: [],
  friendsByUserId: [],
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
    chatReducerFriendsByUserIdReceived: (chatReducer, action) => {
      chatReducer.loader = false;
      chatReducer.friendsByUserId = action.payload.recordList;
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
  chatReducerFriendsByUserIdReceived,
} = chatReducer.actions;
export const getUserChatApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: chatReducerDataRequested.type,
    onSuccess: chatReducerDataReceived.type,
    onError: chatReducerDataRequestFailed.type,
  });
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
  export const getFriendsByUserIdApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: chatReducerDataRequested.type,
    onSuccess: chatReducerFriendsByUserIdReceived.type,
    onError: chatReducerDataRequestFailed.type,
  });
export default chatReducer.reducer;
