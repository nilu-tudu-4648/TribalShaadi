import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../api';
const initialState = {
  loader: false,
  packageList: [],
  timeDuration: [],
  paymentGateways: [],
  razorPayOrderId: '',
  payment: [],
  savePremiumAccount: [],
  packageByUserId: [],
  currentUserPackage: [],
  selfieVerify: true,
  premiumBenefits:[],
  // true => editing that preference group requires a premium package
  isPrimaryPreferenceEditPaid: true,
  isSecondaryPreferenceEditPaid: true,
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
      paymentReducer.packageList = action.payload.recordList.filter(item => item.isActive===1);
    },
    paymentReducerDataRequestFailed: (paymentReducer, action) => {
      paymentReducer.loader = false;
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
    paymentReducerPaymentReceived: (paymentReducer, action) => {
      paymentReducer.loader = false;
      paymentReducer.payment = action.payload.recordList;
    },
    paymentReducerSavePremiumAccountReceived: (paymentReducer, action) => {
      paymentReducer.loader = false;
      paymentReducer.savePremiumAccount = action.payload.recordList;
    },
    paymentReducerPackageByUserIdReceived: (paymentReducer, action) => {
      paymentReducer.loader = false;
      const filteredPackages = action.payload.recordList.filter(item => item.status === "Active");
      paymentReducer.packageByUserId = filteredPackages.length > 0 ? filteredPackages : [];
    },
    paymentReducerCurrentUserPackageReceived: (paymentReducer, action) => {
      paymentReducer.loader = false;
      paymentReducer.currentUserPackage = action.payload.recordList;
    },
    setLoaderPayment: (paymentReducer, action) => {
      paymentReducer.loader = action.payload;
    },
    setSelfieVerify: (paymentReducer, action) => {
      paymentReducer.selfieVerify = action.payload;
    },
    setPrimaryPreference: (paymentReducer, action) => {
      paymentReducer.isPrimaryPreferenceEditPaid = Boolean(
        action.payload.recordList?.[0]?.isActive,
      );
    },
    setSecondaryPreference: (paymentReducer, action) => {
      paymentReducer.isSecondaryPreferenceEditPaid = Boolean(
        action.payload.recordList?.[0]?.isActive,
      );
    },
    setpremiumBenefits: (paymentReducer, action) => {
      paymentReducer.premiumBenefits = action.payload.recordList || [];
    },
  },
});

export const { setLoaderPayment, setSelfieVerify } = paymentReducer.actions;

const {
  paymentReducerDataRequestFailed,
  paymentReducerDataRequested,
  paymentReducerDataReceived,
  paymentReducerTimeDurationReceived,
  paymentReducerPaymentGatewaysReceived,
  paymentReducerRazorPayOrderIdReceived,
  paymentReducerPaymentReceived,
  paymentReducerSavePremiumAccountReceived,
  paymentReducerPackageByUserIdReceived,
  paymentReducerCurrentUserPackageReceived,
  setpremiumBenefits,
  setSecondaryPreference,
  setPrimaryPreference,
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
export const insertPaymentApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: paymentReducerDataRequested.type,
    onSuccess: paymentReducerPaymentReceived.type,
    onError: paymentReducerDataRequestFailed.type,
  });
export const savePremiumAccountApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: paymentReducerDataRequested.type,
    onSuccess: paymentReducerSavePremiumAccountReceived.type,
    onError: paymentReducerDataRequestFailed.type,
  });
export const getPackageByUserIdApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: paymentReducerDataRequested.type,
    onSuccess: paymentReducerPackageByUserIdReceived.type,
    onError: paymentReducerDataRequestFailed.type,
  });
export const getCurrentUserPackageApi = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: paymentReducerDataRequested.type,
    onSuccess: paymentReducerCurrentUserPackageReceived.type,
    onError: paymentReducerDataRequestFailed.type,
  });
export const getPremiumBenefitsApi = (url) =>
  apiCallBegan({
    method: 'get',
    url,
    onSuccess: setpremiumBenefits.type,
    onError: paymentReducerDataRequestFailed.type,
  });
export const getPrimaryPreferenceApi = (url) =>
  apiCallBegan({
    method: 'get',
    url,
    onSuccess: setPrimaryPreference.type,
  });
export const getSecondaryPreferenceApi = (url) =>
  apiCallBegan({
    method: 'get',
    url,
    onSuccess: setSecondaryPreference.type,
  });
export default paymentReducer.reducer;
