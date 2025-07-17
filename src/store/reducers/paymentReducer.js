import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../api';
const initialState = {
  loader: false,
  packageList: [],
  timeDuration: [],
  paymentGateways: [],
  razorPayOrderId: '',
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
    paymentReducerRazorPayOrderIdReceived: (paymentReducer, action) => {
      paymentReducer.loader = false;
      paymentReducer.razorPayOrderId = action.payload.recordList;
    },
    paymentReducerPaymentVerificationReceived: (paymentReducer, action) => {
      paymentReducer.loader = false;
      // Handle payment verification success
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
  paymentReducerRazorPayOrderIdReceived,
  paymentReducerPaymentVerificationReceived,
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
export const generateRazorPayOrderIdApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: paymentReducerDataRequested.type,
    onSuccess: paymentReducerRazorPayOrderIdReceived.type,
    onError: paymentReducerDataRequestFailed.type,
  });

export const verifyPaymentApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: paymentReducerDataRequested.type,
    onSuccess: paymentReducerPaymentVerificationReceived.type,
    onError: paymentReducerDataRequestFailed.type,
  });
export default paymentReducer.reducer;
