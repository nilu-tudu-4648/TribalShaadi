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
import { getPackageByUserIdApi, setLoaderPayment, setSelfieVerify } from '../store/reducers/paymentReducer';

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
export const resetPartnerPreferencesUrl = 'app/users/resetPartnerPreferences';
export const verifySelfieUrl = 'app/verify-selfie';
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
export const getAllChatHistoryByUserIdUrl =
  'app/userChat/getAllChatHistoryByUserId';
export const getAcceptedProposalByIdUrl =
  'app/proposals/getAcceptedProposalById';
export const insertUserNotificationsUrl =
  'app/notifications/insertUserNotifications';
export const updateProposalIsNewUrl = 'app/proposals/updateProposalIsNew';
export const updateChatIsReadUrl = 'app/userChat/updateChatIsRead';

// Date formatting function

export const delay = async (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
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

// WhatsApp-style date formatting for chat headers
export const formatChatDateHeader = timestamp => {
  if (!timestamp) return '';

  try {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Reset hours to compare only dates
    const messageDateOnly = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate(),
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
    );

    if (messageDateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else {
      // Format as DD/MM/YYYY for older dates
      const day = messageDate.getDate().toString().padStart(2, '0');
      const month = (messageDate.getMonth() + 1).toString().padStart(2, '0');
      const year = messageDate.getFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch (error) {
    console.log('Error formatting chat date header:', error);
    return '';
  }
};

// Helper function to check if two timestamps are on different days
export const isDifferentDay = (timestamp1, timestamp2) => {
  if (!timestamp1 || !timestamp2) return false;

  try {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);

    return (
      date1.getDate() !== date2.getDate() ||
      date1.getMonth() !== date2.getMonth() ||
      date1.getFullYear() !== date2.getFullYear()
    );
  } catch (error) {
    console.log('Error comparing dates:', error);
    return false;
  }
};
export const checkUserLoggedIn = async dispatch => {
  try {
    // Add a small delay to prevent race conditions with other AsyncStorage operations
    await delay(100);
    
    const userDataString = await AsyncStorage.getItem(ASYNC_VARIBLES.USER);

    if (!userDataString || userDataString === 'null' || userDataString === 'undefined') {
      console.log('No valid user data found in storage');
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
      // Clear corrupted data
      try {
        await AsyncStorage.multiRemove([ASYNC_VARIBLES.USER, ASYNC_VARIBLES.USER_TOKEN]);
      } catch (clearError) {
        console.error('Error clearing corrupted data:', clearError);
      }
      navigate(ROUTES.WELCOME);
      return;
    }

    if (!user || typeof user !== 'object' || !user.id) {
      console.log('User object is invalid - checkUserLoggedIn');
      try {
        await AsyncStorage.multiRemove([ASYNC_VARIBLES.USER, ASYNC_VARIBLES.USER_TOKEN]);
      } catch (clearError) {
        console.error('Error clearing invalid user data:', clearError);
      }
      navigate(ROUTES.WELCOME);
      return;
    }

    await getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
  } catch (error) {
    console.error('Error in checkUserLoggedIn:', error);
    // Ensure we don't crash the app - navigate to welcome as fallback
    try {
      navigate(ROUTES.WELCOME);
    } catch (navError) {
      console.error('Error navigating to welcome:', navError);
    }
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
export const sendOTPForLogin = async (url, data, setLoading) => {
  try {
    const response = await axios.post(`${baseUrl}/${url}`, data);
    AppToast(`${response.data.otp} is your OTP`);
    return true;
  } catch (error) {
    console.log(error.response.data, 'sendOTPForLogin');
    return false;
  } finally {
    setLoading(false);
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
    
    if (!token || token === 'null' || token === 'undefined') {
      console.error('No valid token found for getUserDetailsApi');
      logoutUser(dispatch);
      return;
    }
    
    const response = await axios.get(`${baseUrl}/${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000, // Add timeout to prevent hanging requests
    });
    
    // Validate response structure
    if (!response.data || !response.data.recordList || !response.data.recordList[0]) {
      console.error('Invalid response structure from getUserDetailsApi');
      return;
    }
    
    const userData = response.data.recordList[0];
    
    // Safely save to AsyncStorage
    try {
      await AsyncStorage.setItem(ASYNC_VARIBLES.USER, JSON.stringify(userData));
    } catch (storageError) {
      console.error('Error saving user data to storage:', storageError);
    }
    
    // Safe dispatch
    try {
      if (typeof dispatch === 'function') {
        dispatch(setUser({ ...userData, token: token }));
        
        // Safe additional API calls
        if (userData.id) {
          dispatch(
            getPackageByUserIdApi(getPackageByUserIdUrl, {
              userId: userData.id,
            }),
          );
          dispatch(
            getGalleryImageListApi(getGalleryImageListUrl, {
              userId: userData.id,
            }),
          );
        }
      }
    } catch (dispatchError) {
      console.error('Error dispatching user data:', dispatchError);
    }
  } catch (error) {
    console.error('Error in getUserDetailsApi:', error);
    
    // Handle different error types safely
    if (error.response && error.response.data) {
      if (
        error.response.data.status === 401 ||
        error.response.data.status === 400
      ) {
        try {
          logoutUser(dispatch);
        } catch (logoutError) {
          console.error('Error during logout:', logoutError);
        }
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout in getUserDetailsApi');
    } else if (error.message === 'Network Error') {
      console.error('Network error in getUserDetailsApi');
    } else {
      console.error('Unexpected error in getUserDetailsApi:', error.message);
    }
  }
};
export const checkAuth = async dispatch => {
  try {
    // Add delay to prevent race conditions
    await delay(200);
    
    const userDataString = await AsyncStorage.getItem(ASYNC_VARIBLES.USER);
    // If no user data, let checkUserLoggedIn handle it
    if (!userDataString || userDataString === 'null' || userDataString === 'undefined') {
      console.log('No user data found in storage - checkAuth (skipping)');
      return false;
    }

    let user;
    try {
      user = JSON.parse(userDataString);
    } catch (parseError) {
      console.error('Error parsing user data in checkAuth:', parseError);
      // Clear corrupted data and let checkUserLoggedIn handle navigation
      try {
        await AsyncStorage.multiRemove([ASYNC_VARIBLES.USER, ASYNC_VARIBLES.USER_TOKEN]);
      } catch (clearError) {
        console.error('Error clearing corrupted data in checkAuth:', clearError);
      }
      return false;
    }

    // If no user object, let checkUserLoggedIn handle it
    if (!user || typeof user !== 'object' || !user.id) {
      console.log('User object is invalid - checkAuth (skipping)');
      return false;
    }
    
    // Safe check for interests
    try {
      if (user.intrests && Array.isArray(user.intrests) && user.intrests.length > 0) {
        if (typeof dispatch === 'function') {
          dispatch(setUserRegistrationCompleted(true));
        }
      }
    } catch (interestError) {
      console.error('Error checking user interests:', interestError);
    }
    
    console.log('checkAuth - User profile check:', user);

    // Check profile completion steps in order with safe navigation
    try {
      for (const step of PROFILE_COMPLETION_STEPS) {
        const fieldValue = user[step.field];

        // Check if field is missing, null, undefined, or empty string
        if (
          !fieldValue ||
          (typeof fieldValue === 'string' && fieldValue.trim() === '') ||
          (Array.isArray(fieldValue) && fieldValue.length === 0)
        ) {
          console.log(`Redirecting to ${step.screen} - missing ${step.field}`);
          try {
            navigate(step.screen);
          } catch (navError) {
            console.error('Error navigating in checkAuth:', navError);
          }
          return false;
        }
      }
    } catch (profileCheckError) {
      console.error('Error in profile completion check:', profileCheckError);
      return false;
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
export const uploadImage = async (
  data,
  dispatch,
  isProfile = false,
  func,
  func2,
  handleRemoveImage,
) => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const url = isProfile ? uploadProfileImageUrl : addEditGalleryImageListUrl;
    const response = await axios.post(`${baseUrl}/${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (func) {
      func(true);
    }
    console.log(response, 'response uploadImage');
  } catch (error) {
    if (func) {
      func(false);
      if (handleRemoveImage) {
        handleRemoveImage(0);
      }
    }
    console.log(error.response.data, 'uploadImage');
    if (error.response.data.status === 401) {
      logoutUser(dispatch);
    }
  } finally {
    if (func2) {
      func2(false);
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
    await delay();
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
export const formatHeightInFeettoInches = totalInches => {
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
export const resetPreferenceApi = async (dispatch, func) => {
  const userDataString = await AsyncStorage.getItem(ASYNC_VARIBLES.USER);
  const user = JSON.parse(userDataString);
  const data = {
    userId: user.id,
  };
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const response = await axios.post(
      `${baseUrl}/${resetPartnerPreferencesUrl}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data, 'resetPreferenceApi');
    await getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
  } catch (error) {
    console.log(error, 'resetPreferenceApi');
  } finally {
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
export const validateIndianPhoneNumber = phoneNumber => {
  if (!phoneNumber) {
    return {
      isValid: false,
      message: 'Please enter a phone number',
    };
  }

  // Remove any spaces, dashes, parentheses, or other formatting
  let cleanedNumber = phoneNumber.replace(/[\s\-()+]/g, '');

  // Remove country code if present (91 for India)
  if (cleanedNumber.startsWith('91') && cleanedNumber.length === 12) {
    cleanedNumber = cleanedNumber.substring(2);
  }

  // Check if the number contains only digits
  if (!/^\d+$/.test(cleanedNumber)) {
    return {
      isValid: false,
      message: 'Phone number should contain only digits',
    };
  }

  // Check if length is exactly 10 digits
  if (cleanedNumber.length !== 10) {
    return {
      isValid: false,
      message: 'Phone number should be exactly 10 digits',
    };
  }

  // Check if first digit is valid for Indian mobile numbers (6, 7, 8, or 9)
  const firstDigit = cleanedNumber.charAt(0);
  if (!['6', '7', '8', '9'].includes(firstDigit)) {
    return {
      isValid: false,
      message: 'Phone number should start with 6, 7, 8, or 9',
    };
  }

  return {
    isValid: true,
    message: 'Valid phone number',
    cleanedNumber: cleanedNumber,
  };
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
export const getChatHistoryByUserId = async userId => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const response = await axios.post(
      `${baseUrl}/${getAllChatHistoryByUserIdUrl}`,
      {
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data.recordList;
  } catch (error) {
    console.log(error, 'getChatHistoryByUserId');
    return [];
  }
};
export const filterChatByUserId = async (userId, friendId) => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const response = await axios.post(
      `${baseUrl}/${getAllChatHistoryByUserIdUrl}`,
      {
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = response.data.recordList;
    if (!Array.isArray(data)) {
      console.log('No chat data found or invalid format');
      return [];
    }

    const filteredChat = data.filter(chat => {
      if (!chat.chatId) return false;

      const chatIdParts = chat.chatId.split('_');
      const friendIdStr = String(friendId);

      return (
        String(chatIdParts[0]) === friendIdStr ||
        String(chatIdParts[1]) === friendIdStr
      );
    });

    console.log('filtered chat messages:', filteredChat.length);
    return filteredChat.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );
  } catch (error) {
    console.log(error, 'filterChatByUserId error');
    return [];
  }
};
export const updateProposalIsNewApi = async (url, data) => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const response = await axios.post(`${baseUrl}/${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, 'response updateProposalIsNewApi');
    return response.data;
  } catch (error) {
    console.log(error.response.data, 'updateProposalIsNewApi');
    return [];
  }
};
export const updateChatIsReadApi = async (url, data) => {
  console.log(data, 'data updateChatIsReadApi');
  console.log(`${baseUrl}/${url}`, 'url');
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const response = await axios.post(`${baseUrl}/${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, 'response updateChatIsReadApi');
    return response.data;
  } catch (error) {
    console.log(error.response.data, 'updateChatIsReadApi');
    return [];
  }
};
export const verifySelfieApi = async (data, dispatch) => {
  try {
    await delay(2000);
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const response = await axios.post(`${baseUrl}/${verifySelfieUrl}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data, 'response verifySelfieApi');
    if (response.data.verified === false) {
      dispatch(setSelfieVerify(false));
    }
    return response.data;
  } catch (error) {
    console.log(error.response.data, 'verifySelfieApi Error');
    dispatch(setSelfieVerify(false));
    return [];
  } finally {
    dispatch(setLoaderPayment(false));
  }
};
