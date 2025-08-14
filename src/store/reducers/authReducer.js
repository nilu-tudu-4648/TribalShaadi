import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../api';
import AppToast from '../../components/AppToast';
const initialState = {
  loader: false,
  user: null,
  otpSent: false,
  userProfileGenderUpdated: false,
  tokenExpired: false,
  religion: [],
  community: [],
  states: [],
  cities: [],
  allCities: [],
  maritalStatuses: [],
  educationTypes: [],
  occupations: [],
  income: [],
  height: '',
  diet: '',
  updatedUser: null,
  isInterestsUpdated: false,
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
      console.log(action.payload, 'authreducer Failed');
      if (action.payload.response.status === 401) {
        authReducer.loader = false;
        authReducer.tokenExpired = true;
      }
    },
    sendOTPDataReceived: (authReducer, action) => {
      authReducer.loader = false;
      authReducer.otpSent = true;
      console.log(action.payload, 'action.payload');
      AppToast(`${action.payload.otp} is your OTP`);
    },
    completeUserProfileV2GenderDataReceived: (authReducer, action) => {
      authReducer.loader = false;
      authReducer.userProfileGenderUpdated = true;
    },
    completeUserProfileV2NameDataReceived: (authReducer, action) => {
      authReducer.loader = false;
    },
    setUser: (reducer, action) => {
      reducer.user = action.payload;
    },
    logoutFromReducer: reducer => {
      reducer.user = null;
      reducer.tokenExpired = false;
      reducer.loader = false;
      reducer.otpSent = false;
      reducer.userProfileGenderUpdated = false;
      reducer.isInterestsUpdated = false;
    },
    getReligionDataReceived: (reducer, action) => {
      reducer.loader = false;
      reducer.religion = action.payload.recordList;
    },
    getCommunityDataReceived: (reducer, action) => {
      reducer.loader = false;
      reducer.community = action.payload.recordList;
    },
    getStatesDataReceived: (reducer, action) => {
      reducer.loader = false;
      reducer.states = action.payload.recordList;
    },
    getCitiesDataReceived: (reducer, action) => {
      reducer.loader = false;
      reducer.cities = action.payload.recordList;
    },
    getAllCitiesDataReceived: (reducer, action) => {
      reducer.loader = false;
      reducer.allCities = action.payload.recordList;
    },
    getMaritalStatusDataReceived: (reducer, action) => {
      reducer.loader = false;
      reducer.maritalStatuses = action.payload.recordList;
    },
    getEducationTypesDataReceived: (reducer, action) => {
      reducer.loader = false;
      reducer.educationTypes = action.payload.recordList;
    },
    getOccupationDataReceived: (reducer, action) => {
      reducer.loader = false;
      reducer.occupations = action.payload.recordList;
    },
    getIncomeDataReceived: (reducer, action) => {
      reducer.loader = false;
      reducer.income = action.payload.recordList;
    },
    getHeightDataReceived: (reducer, action) => {
      reducer.loader = false;
      reducer.height = action.payload.recordList;
    },
    getDietDataReceived: (reducer, action) => {
      reducer.loader = false;
      reducer.diet = action.payload.recordList;
    },
    completeUserProfileV2UpdatedDataReceived: (reducer, action) => {
      console.log(action.payload, 'action.payload');
      reducer.updatedUser = action.payload;
    },
    completeUserProfileV2InterestsDataReceived: (reducer, action) => {
      reducer.loader = false;
      reducer.isInterestsUpdated = true;
    },
    setLoadingTrue: (reducer, action) => {
      reducer.loader = true;
    },
    setLoadingfalse: (reducer, action) => {
      reducer.loader = false;
    },
  },
});

export const { setUser, logoutFromReducer, setLoadingfalse, setLoadingTrue } =
  authReducer.actions;

const {
  authReducerDataRequestFailed,
  authReducerDataRequested,
  sendOTPDataReceived,
  completeUserProfileV2GenderDataReceived,
  completeUserProfileV2NameDataReceived,
  getReligionDataReceived,
  getCommunityDataReceived,
  getStatesDataReceived,
  getCitiesDataReceived,
  getMaritalStatusDataReceived,
  getEducationTypesDataReceived,
  completeUserProfileV2UpdatedDataReceived,
  getOccupationDataReceived,
  getIncomeDataReceived,
  getHeightDataReceived,
  getDietDataReceived,
  completeUserProfileV2InterestsDataReceived,
  getAllCitiesDataReceived,
} = authReducer.actions;
export const sendOTP = (url, data) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: authReducerDataRequested.type,
    onSuccess: sendOTPDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });

export const completeUserProfileV2Gender = (url, data) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: authReducerDataRequested.type,
    onSuccess: completeUserProfileV2GenderDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const completeUserProfileV2Name = (url, data) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: authReducerDataRequested.type,
    onSuccess: completeUserProfileV2NameDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const getReligion = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: authReducerDataRequested.type,
    onSuccess: getReligionDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const getCommunity = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: authReducerDataRequested.type,
    onSuccess: getCommunityDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const getStates = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: authReducerDataRequested.type,
    onSuccess: getStatesDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const getCities = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: authReducerDataRequested.type,
    onSuccess: getCitiesDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const getAllCities = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: authReducerDataRequested.type,
    onSuccess: getAllCitiesDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const getMaritalStatus = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: authReducerDataRequested.type,
    onSuccess: getMaritalStatusDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const getEducationTypes = (url, data = {}) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: authReducerDataRequested.type,
    onSuccess: getEducationTypesDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const getOccupation = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: authReducerDataRequested.type,
    onSuccess: getOccupationDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const getIncome = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: authReducerDataRequested.type,
    onSuccess: getIncomeDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const completeUserProfileV2Updated = (url, data) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: authReducerDataRequested.type,
    onSuccess: completeUserProfileV2UpdatedDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const getHeight = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: authReducerDataRequested.type,
    onSuccess: getHeightDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const getDiet = url =>
  apiCallBegan({
    method: 'get',
    url,
    onStart: authReducerDataRequested.type,
    onSuccess: getDietDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export const completeUserProfileV2Interests = (url, data) =>
  apiCallBegan({
    method: 'post',
    url,
    data,
    onStart: authReducerDataRequested.type,
    onSuccess: completeUserProfileV2InterestsDataReceived.type,
    onError: authReducerDataRequestFailed.type,
  });
export default authReducer.reducer;
