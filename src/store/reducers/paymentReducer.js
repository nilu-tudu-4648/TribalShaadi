import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../api';
const initialState = {
  loader: false,
  packageList: [],
  timeDuration: [],
  paymentGateways: [],
};

const paymentReducer = createSlice({
  name: 'paymentReducer',
  initialState,
  reducers: {
    paymentReducerDataRequested: (paymentReducer, action) => {
      paymentReducer.loader = true;
    },
    paymentReducerDataReceived: (paymentReducer, action) => {
      paymentReducer.loader = false;
      paymentReducer.packageList = action.payload.recordList;
    },
    paymentReducerDataRequestFailed: (paymentReducer, action) => {
      paymentReducer.loader = false;
      console.log(action.payload, 'reducer Failed');
    },
    paymentReducerTimeDurationReceived: (paymentReducer, action) => {
      paymentReducer.loader = false;
      paymentReducer.timeDuration = action.payload.recordList;
    },
    paymentReducerPaymentGatewaysReceived: (paymentReducer, action) => {
      paymentReducer.loader = false;
      paymentReducer.paymentGateways = action.payload.recordList[0];
    },
  },
});

// export const {  } = paymentReducer.actions;

const {
  paymentReducerDataRequestFailed,
  paymentReducerDataRequested,
  paymentReducerDataReceived,
  paymentReducerTimeDurationReceived,
  paymentReducerPaymentGatewaysReceived,
} = paymentReducer.actions;
export const getPackageListApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: paymentReducerDataRequested.type,
    onSuccess: paymentReducerDataReceived.type,
    onError: paymentReducerDataRequestFailed.type,
  });
export const getTimeDurationApi = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: paymentReducerDataRequested.type,
    onSuccess: paymentReducerTimeDurationReceived.type,
    onError: paymentReducerDataRequestFailed.type,
  });
export const getPaymentGatewaysApi = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: paymentReducerDataRequested.type,
    onSuccess: paymentReducerPaymentGatewaysReceived.type,
    onError: paymentReducerDataRequestFailed.type,
  });
export default paymentReducer.reducer;
