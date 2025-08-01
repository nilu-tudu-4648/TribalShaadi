import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_VARIBLES } from './data';
import {
  setUser,
  logoutFromReducer,
  setLoadingfalse,
  completeUserProfileV2Updated,
} from '../store/reducers/authReducer';
import {
  getGalleryImageListApi,
  setReducerCleaned,
  setUserRegistrationCompleted,
} from '../store/reducers/userReducer';
import axios from 'axios';
import AppToast from '../components/AppToast';
import { navigate } from '../navigation/NavigationRef';
import { ROUTES } from './data';
import { getPackageByUserIdApi } from '../store/reducers/paymentReducer';
import { ToastAndroid } from 'react-native';

// Configuration for user profile completion checks
const PROFILE_COMPLETION_STEPS = [
  { field: 'gender', screen: ROUTES.GENDER },
  { field: 'firstName', screen: ROUTES.NAME },
  { field: 'birthDate', screen: ROUTES.BIRTH_DATE },
  { field: 'motherTongue', screen: ROUTES.RELIGION },
  { field: 'planingto_settle', screen: ROUTES.ADDRESS },
  { field: 'occupationId', screen: ROUTES.QUALIFICATION },
  { field: 'smoking', screen: ROUTES.PHYSICAL_ATTRIBUTES },
  { field: 'aboutMe', screen: ROUTES.ABOUT },
  { field: 'about_lifepartener', screen: ROUTES.ABOUT_PARTNER },
  { field: 'image', screen: ROUTES.UPLOAD_IMAGE },
  { field: 'intrests', screen: ROUTES.SELECT_INTERESTS },
];

export const baseUrl = 'https://api.tribalshaadi.co.in/api';
export const updateUrl = 'app/users/completeUserProfileV2';
export const getUserDetailsUrl = 'app/users/viewUserDetail?';
export const getReligionUrl = 'admin/religion/getReligion';
export const getCommunityUrl = 'admin/community/getCommunity?isActive=true&';
export const getStatesUrl = 'admin/states/getStates';
export const getCitiesUrl = 'admin/districts/getDistricts';
export const getAllCitiesUrl = 'admin/districts/getDistrictsV2?searchString=';
export const getMaritalStatusUrl = 'admin/maritalStatus/getMaritalStatus';
export const getEducationUrl = 'admin/education/getEducation';
export const getEducationTypeUrl = 'admin/education/getEducationType';
export const getOccupationUrl = 'admin/occupation/getOccupation';
export const getEmploymentTypeUrl = 'admin/employmentType/getEmploymentType';
export const getIncomeUrl = 'admin/annualIncome/getAnnualIncome';
export const getHeightUrl = 'admin/height/getHeight';
export const getDietUrl = 'admin/diet/getDiet';
export const uploadProfileImageUrl = 'app/users/updateUserProfilePic';
export const addEditGalleryImageListUrl = 'app/users/addEditGalleryImageList';
export const deleteUserUrl = 'admin/users/deleteUser';
export const imageUrl = 'https://api.tribalshaadi.co.in/';

// Home Screen API
export const getMatchedUsersUrl = 'app/users/getAllUsers';
export const sendProposalUrl = 'app/proposals/sendProposal';
export const passUserUrl = 'app/proposals/passUser';
export const getProposalsSendByMeUrl = 'app/proposals/getProposalsSendByMe';
export const getProposalsGotByMeUrl = 'app/proposals/getProposalsGotByMe';
export const getPassedUsersUrl = 'app/proposals/getPassedUsers';
export const cancelProposalRequestUrl = 'app/proposals/cancelProposalRequest';
export const acceptRejectProposalUrl = 'app/proposals/acceptRejectProposal';
export const getSelectedUserUrl = 'app/users/viewUserDetail';
export const getGalleryImageListUrl = 'app/users/getGalleryImageList';
//payment
export const getPackageListUrl = 'admin/package/getpackage';
export const getTimeDurationUrl = 'admin/timeDuration/getTimeDuration';
export const getPaymentGatewaysUrl =
  'app/paymentGateways/getPaymentgatewaysForPackage?appPlatform=androidApp';
export const generateRazorPayOrderIdUrl =
  'app/paymentGateways/generateRazorPayOrderId';
export const verifyPaymentUrl = 'app/paymentGateways/verifyPayment';
export const insertPaymentUrl = 'app/payment/insertPayment';
export const savePremiumAccountUrl = 'app/package/savePremiumAccount';
export const getPackageByUserIdUrl = 'app/package/getPackageByUserId';

//chatUrl
export const getUserChatUrl = 'app/userChat/userChat';
export const getUserChatListUrl = 'app/userChat/getUserChatList';
export const sendMessageUrl = 'app/userChat/sendMessage';
export const getMessagesUrl = 'app/userChat/getMessages';
export const friendRequestAcceptUrl = 'app/userChat/friendRequestAccept';
export const friendRequestRejectOrBlockUrl =
  'app/userChat/friendRequestRejectOrBlock';
export const getFriendsByUserIdUrl = 'app/userChat/getFriendsByUserId';
export const getAllChatHistoryByUserIdUrl =
  'app/userChat/getAllChatHistoryByUserId';
export const getAcceptedProposalByIdUrl =
  'app/proposals/getAcceptedProposalById';
export const insertUserNotificationsUrl =
  'app/notifications/insertUserNotifications';
// Date formatting function
export const formatDateOfBirth = dateString => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.log('Error formatting date:', error);
    return dateString;
  }
};

// Alternative shorter format (DD/MM/YYYY)
export const formatDateShort = dateString => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.log('Error formatting date:', error);
    return dateString;
  }
};

export const checkUserLoggedIn = async dispatch => {
  try {
    const userDataString = await AsyncStorage.getItem(ASYNC_VARIBLES.USER);

    if (!userDataString) {
      navigate(ROUTES.WELCOME);
      return;
    }

    let user;
    try {
      user = JSON.parse(userDataString);
    } catch (parseError) {
      console.error(
        'Error parsing user data in checkUserLoggedIn:',
        parseError,
      );
      await AsyncStorage.removeItem(ASYNC_VARIBLES.USER);
      navigate(ROUTES.WELCOME);
      return;
    }

    if (!user) {
      console.log('User object is null - checkUserLoggedIn');
      navigate(ROUTES.WELCOME);
      return;
    }

    await getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
  } catch (error) {
    console.error('Error in checkUserLoggedIn:', error);
    navigate(ROUTES.WELCOME);
  }
};
export const saveUserToStorage = async user => {
  try {
    await AsyncStorage.setItem(ASYNC_VARIBLES.USER, JSON.stringify(user));
    await AsyncStorage.setItem(ASYNC_VARIBLES.USER_TOKEN, user.token);
  } catch (error) {
    console.log(error);
  }
};
export const verifyOTP = async (url, data, dispatch, navigation, setError) => {
  try {
    const response = await axios.post(`${baseUrl}/${url}`, data);
    AppToast('OTP verified successfully');
    if (response.data.status === 200) {
      const user = response.data.recordList[0];
      console.log(user, 'verifyOTP');
      await saveUserToStorage(user);
      await getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
      const fcmToken = await AsyncStorage.getItem(ASYNC_VARIBLES.FCM_TOKEN);
      dispatch(
        completeUserProfileV2Updated(updateUrl, {
          id: user.id,
          fcmToken: fcmToken,
        }),
      );
      dispatch(setLoadingfalse());
      checkAuth(dispatch);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    setError('Incorrect OTP, please enter the valid OTP you received');
    console.log(error);
  }
};
export const getUserDetailsApi = async (url, dispatch) => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    console.log(token, 'token');
    const response = await axios.get(`${baseUrl}/${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await AsyncStorage.setItem(
      ASYNC_VARIBLES.USER,
      JSON.stringify(response.data.recordList[0]),
    );
    dispatch(setUser({ ...response.data.recordList[0], token: token }));
    dispatch(
      getPackageByUserIdApi(getPackageByUserIdUrl, {
        userId: response.data.recordList[0].id,
      }),
    );
    dispatch(
      getGalleryImageListApi(getGalleryImageListUrl, {
        userId: response.data.recordList[0].id,
      }),
    );
  } catch (error) {
    if (error.response && error.response.data) {
      if (
        error.response.data.status === 401 ||
        error.response.data.status === 400
      ) {
        logoutUser(dispatch);
      }
    } else {
      console.log(error, 'getUserDetailsApi');
    }
  }
};
export const checkAuth = async dispatch => {
  try {
    // Get user from Redux store instead of AsyncStorage to avoid race conditions
    const userDataString = await AsyncStorage.getItem(ASYNC_VARIBLES.USER);
    // If no user data, let checkUserLoggedIn handle it
    if (!userDataString) {
      console.log('No user data found in storage - checkAuth (skipping)');
      return false;
    }

    let user;
    try {
      user = JSON.parse(userDataString);
    } catch (parseError) {
      console.error('Error parsing user data:', parseError);
      // Clear corrupted data and let checkUserLoggedIn handle navigation
      await AsyncStorage.removeItem(ASYNC_VARIBLES.USER);
      return false;
    }

    // If no user object, let checkUserLoggedIn handle it
    if (!user) {
      console.log('User object is null or undefined - checkAuth (skipping)');
      return false;
    }
    if (user.intrests) {
      if (typeof dispatch === 'function') {
        dispatch(setUserRegistrationCompleted(true));
      }
    }
    console.log('checkAuth - User profile check:', user);

    // Check profile completion steps in order
    for (const step of PROFILE_COMPLETION_STEPS) {
      const fieldValue = user[step.field];

      // Check if field is missing, null, undefined, or empty string
      if (
        !fieldValue ||
        (typeof fieldValue === 'string' && fieldValue.trim() === '')
      ) {
        console.log(`Redirecting to ${step.screen} - missing ${step.field}`);
        navigate(step.screen);
        return;
      }
    }
    return true;
  } catch (error) {
    console.error('Error in checkAuth:', error);
    return false;
  }
};
export const logoutUser = async dispatch => {
  try {
    dispatch(setUserRegistrationCompleted(false));
    await AsyncStorage.clear();
    dispatch(logoutFromReducer());
    dispatch(setReducerCleaned());
    navigate(ROUTES.WELCOME);
  } catch (error) {
    console.log(error);
  }
};
export const uploadImage = async (data, dispatch, isProfile = false) => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const url = isProfile ? uploadProfileImageUrl : addEditGalleryImageListUrl;
    const response = await axios.post(`${baseUrl}/${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response, 'response uploadImage');
  } catch (error) {
    console.log(error.response.data, 'uploadImage');
    ToastAndroid.show(error.response.data.message, ToastAndroid.LONG);
    if (error.response.data.status === 401) {
      logoutUser(dispatch);
    }
  }
};
export const deleteUserApi = async (id, dispatch) => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const response = await axios.post(`${baseUrl}/${deleteUserUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, 'response deleteUser');
    await AsyncStorage.clear();
    dispatch(logoutFromReducer());
  } catch (error) {
    console.log(error.response, 'deleteUserApi');
  }
};
export const setReducerLoadingfalse = async (dispatch, func) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    func();
  } catch (error) {
    console.log(error, 'setReducerLoadingfalse');
  } finally {
    dispatch(setLoadingfalse());
  }
};
export const convertCmToReadableHeight = cm => {
  const n = Number(cm);
  const feet = Math.floor(n / 30.48);
  const inches = Math.round((n / 30.48 - feet) * 12);
  return `${feet}'${String(inches).padStart(2, '0')}"`;
};
export const formatHeightInFeettoInches = (totalInches) => {
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}ft ${inches}in`;
};
export const getCitiesByStateId = async stateId => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const response = await axios.get(
      `${baseUrl}/${getCitiesUrl}?stateId=${stateId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.recordList;
  } catch (error) {
    console.log(error, 'getCitiesByStateId');
    return [];
  }
};
export const resetPreferenceApi = async (dispatch,func) => {
  const userDataString = await AsyncStorage.getItem(ASYNC_VARIBLES.USER);
  const user = JSON.parse(userDataString);
  const data = {
    id: user.id,
    pAlcoholAcceptance: null,
    pAnnualIncomeId: null,
    pBodyType: null,
    pCityLivingInId: null,
    pCommunityId: null,
    pComplexion: null,
    pCountryLivingInId: null,
    pDietId: null,
    pDisabilityAcceptance: null,
    pEducationMediumId: null,
    pEducationTypeId: null,
    pEmploymentTypeId: null,
    pFamilyType: null,
    pFromAge: null,
    pFromHeight: null,
    pHoroscopeBelief: null,
    pManglikMatch: null,
    pMaritalStatusId: null,
    pMotherTongue: null,
    pOccupationId: null,
    pOtherExpectations: null,
    pProfileWithChildren: null,
    pReligionId: null,
    pSmokingAcceptance: null,
    pStateLivingInId: null,
    pToAge: null,
    pToHeight: null,
  };
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const response = await axios.post(`${baseUrl}/${updateUrl}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
    console.log(response, 'resetPreferenceApi');
  } catch (error) {
    console.log(error, 'resetPreferenceApi');
  }finally{
    func();
  }
};
export const searchCitiesApi = async data => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const response = await axios.get(`${baseUrl}/${getAllCitiesUrl}${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.recordList;
  } catch (error) {
    console.log(error, 'searchCitiesApi');
    return [];
  }
};
export const getCitiesByStateIdV2 = async stateId => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const response = await axios.get(
      `${baseUrl}/${getCitiesUrl}?stateId=${stateId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.recordList;
  } catch (error) {
    console.log(error, 'getCitiesByStateId');
    return [];
  }
};

export const getEmploymentTypeApi = async dispatch => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const response = await axios.get(`${baseUrl}/${getEmploymentTypeUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.recordList;
  } catch (error) {
    console.log(error, 'getEmploymentTypeApi');
    return [];
  }
};
