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
import {
  getPackageByUserIdApi,
  setSelfieVerify,
} from '../store/reducers/paymentReducer';
import { setUnreadChatHistory } from '../store/reducers/chatReducer';

// Configuration for user profile completion checks
const PROFILE_COMPLETION_STEPS = [
  { field: 'gender', screen: ROUTES.GENDER },
  { field: 'firstName', screen: ROUTES.NAME },
  { field: 'birthDate', screen: ROUTES.BIRTH_DATE },
  { field: 'motherTongue', screen: ROUTES.RELIGION },
  { field: 'planingto_settle', screen: ROUTES.ADDRESS },
  // { field: 'occupationId', screen: ROUTES.QUALIFICATION },
  { field: 'smoking', screen: ROUTES.PHYSICAL_ATTRIBUTES },
  // { field: 'aboutMe', screen: ROUTES.ABOUT },
  { field: 'about_lifepartener', screen: ROUTES.ABOUT_PARTNER },
  { field: 'image', screen: ROUTES.UPLOAD_IMAGE },
  { field: 'intrests', screen: ROUTES.SELECT_INTERESTS },
];

// export const apiUrl = 'https://api.tribalshaadi.co.in';
export const apiUrl = 'https://devapi.tribalshaadi.co.in';
export const baseUrl = `${apiUrl}/api`;
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
export const getOccupationByEmploymentTypeUrl =
  '/admin/occupation/getOccupationByEmploymentType?employmentTypeId=';
export const getOccupationCategoryByOccupationIdUrl =
  '/admin/occupationcategory/getOccupationCategoryByOccupationId?occupationId=';
export const getIncomeUrl = 'admin/annualIncome/getAnnualIncome';
export const getHeightUrl = 'admin/height/getHeight';
export const getDietUrl = 'admin/diet/getDiet';
export const uploadProfileImageUrl = 'app/users/updateUserProfilePic';
export const addEditGalleryImageListUrl = 'app/users/addEditGalleryImageList';
export const deleteUserUrl = 'admin/users/deleteUser';
export const imageUrl = apiUrl + '/';

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
export const checkUserLoggedIn = async (dispatch, isInitialLoad = true) => {
  try {
    // Add a small delay to prevent race conditions with other AsyncStorage operations
    await delay(100);

    const userDataString = await AsyncStorage.getItem(ASYNC_VARIBLES.USER);

    if (
      !userDataString ||
      userDataString === 'null' ||
      userDataString === 'undefined'
    ) {
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
        await AsyncStorage.multiRemove([
          ASYNC_VARIBLES.USER,
          ASYNC_VARIBLES.USER_TOKEN,
        ]);
      } catch (clearError) {
        console.error('Error clearing corrupted data:', clearError);
      }
      navigate(ROUTES.WELCOME);
      return;
    }

    if (!user || typeof user !== 'object' || !user.id) {
      console.log('User object is invalid - checkUserLoggedIn');
      try {
        await AsyncStorage.multiRemove([
          ASYNC_VARIBLES.USER,
          ASYNC_VARIBLES.USER_TOKEN,
        ]);
      } catch (clearError) {
        console.error('Error clearing invalid user data:', clearError);
      }
      navigate(ROUTES.WELCOME);
      return;
    }
    dispatch(
      completeUserProfileV2Updated(updateUrl, {
        id: user.id,
        middleName: 'online',
      }),
    );
    // Pass isInitialLoad flag to getUserDetailsApi to handle 401 errors appropriately
    await getUserDetailsApi(
      `${getUserDetailsUrl}id=${user.id}`,
      dispatch,
      isInitialLoad,
    );
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
    console.log(response.data, 'response sendOTPForLogin');
    // AppToast(`${response.data.otp} is your OTP`);
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
      const userWithToken = {
        ...user,
        token: user.token || `temp_token_${user.id}_${Date.now()}`,
      };

      await saveUserToStorage(userWithToken);
      await getUserDetailsApi(
        `${getUserDetailsUrl}id=${user.id}`,
        dispatch,
        false,
      );
      const fcmToken = await AsyncStorage.getItem(ASYNC_VARIBLES.FCM_TOKEN);
      dispatch(
        completeUserProfileV2Updated(updateUrl, {
          id: user.id,
          fcmToken: fcmToken,
          middleName: 'online',
        }),
      );
      dispatch(setLoadingfalse());
      // Wait a bit for all dispatches to complete
      await delay(500);
      try {
        const authResult = await checkAuth(dispatch);
        // If profile is complete but checkAuth didn't navigate, navigate to main tabs
        if (authResult === true) {
          console.log(
            'Navigating to main tabs after successful OTP verification',
          );
          navigate(ROUTES.MAIN_TABS);
        }
      } catch (navError) {
        console.error('Error during post-OTP navigation:', navError);
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    setError('Incorrect OTP, please enter the valid OTP you received');
    console.log(error);
  }
};
export const getUserDetailsApi = async (
  url,
  dispatch,
  isInitialLoad = false,
) => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    if (!token || token === 'null' || token === 'undefined') {
      console.log('No valid token found for getUserDetailsApi');

      // During initial load, navigate to welcome instead of crashing
      if (isInitialLoad) {
        console.log('Initial load without token - navigating to welcome');
        navigate(ROUTES.WELCOME);
        return null;
      }

      console.log('No token available - skipping API call');
      return null;
    }

    const response = await axios.get(`${baseUrl}/${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: 10000, // Add timeout to prevent hanging requests
    });

    // Validate response structure
    if (
      !response.data ||
      !response.data.recordList ||
      !response.data.recordList[0]
    ) {
      console.error('Invalid response structure from getUserDetailsApi');
      return null;
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

    return userData;
  } catch (error) {
    console.error('Error in getUserDetailsApi:', error);

    // Handle different error types safely
    if (error.response && error.response.data) {
      const status = error.response.data.status;

      if (status === 401) {
        console.log('Authentication error (401) - token expired or invalid');

        // During initial load, don't logout aggressively - just navigate to welcome
        if (isInitialLoad) {
          console.log(
            'Initial load with invalid token - clearing storage and navigating to welcome',
          );
          try {
            await AsyncStorage.multiRemove([
              ASYNC_VARIBLES.USER,
              ASYNC_VARIBLES.USER_TOKEN,
            ]);
            navigate(ROUTES.WELCOME);
          } catch (clearError) {
            console.error('Error clearing storage on 401:', clearError);
            navigate(ROUTES.WELCOME);
          }
        } else {
          // For subsequent calls, do normal logout
          try {
            await logoutUser(dispatch);
          } catch (logoutError) {
            console.error('Error during logout:', logoutError);
            // Fallback navigation
            navigate(ROUTES.WELCOME);
          }
        }
      } else if (status === 400) {
        console.log('Bad request error (400)');
        if (isInitialLoad) {
          navigate(ROUTES.WELCOME);
        } else {
          try {
            await logoutUser(dispatch);
          } catch (logoutError) {
            console.error('Error during logout:', logoutError);
          }
        }
      } else {
        console.error(`API error with status ${status}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout in getUserDetailsApi');
    } else if (error.message === 'Network Error') {
      console.error(
        'Network error in getUserDetailsApi - continuing without crash',
      );
    } else {
      console.error('Unexpected error in getUserDetailsApi:', error.message);
    }

    return null;
  } finally {
    dispatch(setLoadingfalse());
  }
};
export const checkAuth = async dispatch => {
  try {
    await delay(200);

    const userDataString = await AsyncStorage.getItem(ASYNC_VARIBLES.USER);

    if (!userDataString || userDataString === 'null' || userDataString === 'undefined') {
      console.log('No user data found in storage - checkAuth (skipping)');
      return false;
    }

    let user;
    try {
      user = JSON.parse(userDataString);
    } catch {
      await AsyncStorage.multiRemove([ASYNC_VARIBLES.USER, ASYNC_VARIBLES.USER_TOKEN]);
      return false;
    }
    // console.log(user, 'user in checkAuth');
    // Last screen check
    try {
      if (user.intrests) {
        dispatch(setUserRegistrationCompleted(true));
        return true;
      }
      if (typeof getLastScreenName === 'function') {
        const lastScreenName = await getLastScreenName();
        if (lastScreenName && lastScreenName !== 'null') {
          console.log(lastScreenName, 'lastScreenName');
          navigate(lastScreenName);
          return false;
        }

        for (const step of PROFILE_COMPLETION_STEPS) {
          if (!user[step.field]) {
            console.log(step.screen, 'step.screen');
            navigate(step.screen);
            return false;
          }
        }
      } else {
        console.log('getLastScreenName not defined');
        return false;
      }
    } catch (err) {
      console.error('Error in getLastScreenName:', err);
      return false;
    }
  } catch (error) {
    console.error('Error in checkAuth:', error?.message, error?.stack);
    return false;
  }
};
export const logoutUser = async (dispatch,userId) => {
  try {
    if(userId){
      dispatch(
        completeUserProfileV2Updated(updateUrl, {
          id: userId,
          fcmToken:"null",
        }),
      );
    }
    dispatch(setUserRegistrationCompleted(false));
    await AsyncStorage.removeItem(ASYNC_VARIBLES.USER);
    await AsyncStorage.removeItem(ASYNC_VARIBLES.USER_TOKEN);
    await AsyncStorage.removeItem(ASYNC_VARIBLES.FCM_TOKEN);
    await AsyncStorage.clear();
    dispatch(logoutFromReducer());
    dispatch(setReducerCleaned());

    // Refresh FCM token instead of restarting the app
    try {
      const { refreshFCMToken } = require('../notification/notifications');
      await refreshFCMToken();
      console.log('FCM token refreshed after logout');
    } catch (fcmError) {
      console.error('Error refreshing FCM token after logout:', fcmError);
    }
  } catch (error) {
    console.log(error);
  }
};
export const getUserImageListApi = async (id,setUserImageList) => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const response = await axios.post(
      `${baseUrl}/${getGalleryImageListUrl}`,
      { userId: id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data.recordList, 'response getUserImageListApi');
    if (setUserImageList) {
      setUserImageList(response.data.recordList);
    }
  } catch (error) {
    console.log(error, 'getGalleryImageListApi');
  }
};
export const uploadImage = async (
  data,
  dispatch,
  isProfile = false,
  func,
  func2,
  handleRemoveImage,
  setUserImageList = null
) => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const url = isProfile ? uploadProfileImageUrl : addEditGalleryImageListUrl;
    console.log(data, `${baseUrl}/${url}`, 'data uploadImage');
    const response = await axios.post(`${baseUrl}/${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, 'response uploadImage');
    if (setUserImageList) {
      getUserImageListApi(data.userId, setUserImageList);
    }
    if (func) {
      func(true);
    }
  } catch (error) {
    if (func) {
      func(false);
      // Remove only the failed image (profile or gallery)
      if (handleRemoveImage) {
        handleRemoveImage(data?.imageIndex);
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
    const response = await axios.delete(`${baseUrl}/${deleteUserUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, 'response deleteUser');
    await AsyncStorage.clear();
    logoutUser(dispatch);
  } catch (error) {
    console.log(error.response, 'deleteUserApi');
  }
};
export const setReducerLoadingfalse = async (dispatch, func) => {
  try {
    await delay();
    if (func) {
      func();
    }
  } catch (error) {
    console.log(error, 'setReducerLoadingfalse');
  } finally {
    dispatch(setLoadingfalse());
  }
};
export const convertCmToReadableHeight = cm => {
  const n = Number(cm);
  let feet = Math.floor(n / 30.48);
  let inches = Math.round((n / 30.48 - feet) * 12);

  // Handle inch overflow (12 inches = 1 foot)
  if (inches >= 12) {
    feet += Math.floor(inches / 12);
    inches = inches % 12;
  }

  return `${feet}'${String(inches).padStart(2, '0')}"`;
};
export const formatHeightInFeettoInches = totalInches => {
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}ft ${inches}in`;
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
    await getUserDetailsApi(
      `${getUserDetailsUrl}id=${user.id}`,
      dispatch,
      false,
    );
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
    console.log(error, 'getCitiesByStateIdV2');
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
export const getChatHistoryByUserId = async (userId, dispatch) => {
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
    const filteredChat = response.data.recordList.filter(
      chat => chat.userId !== userId && chat.isRead === 0
    );
    dispatch(setUnreadChatHistory(filteredChat));
  } catch (error) {
    console.log(error.response.data, 'getChatHistoryByUserId');
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
  }
};

// Called when the app moves to background (best-effort app close hook)
export const onAppClose = async dispatch => {
  try {
    const userDataString = await AsyncStorage.getItem(ASYNC_VARIBLES.USER);
    
    // Check if user data exists before parsing
    if (!userDataString || userDataString === 'null' || userDataString === 'undefined') {
      console.log('No user data available in onAppClose');
      return;
    }
    
    const user = JSON.parse(userDataString);
    
    // Check if user object and id exist
    if (!user || !user.id) {
      console.log('Invalid user data in onAppClose');
      return;
    }
    
    const requestBody = {
      id: user.id,
      middleName: 'offline',
    };
    // console.log('requestBody onAppClose', requestBody);
    dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
    setReducerLoadingfalse(dispatch, () => {
      getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
    });
  } catch (error) {
    console.error('onAppClose error:', error);
  }
};

// Called when the app comes to foreground
export const onAppForeground = async dispatch => {
  try {
    const userDataString = await AsyncStorage.getItem(ASYNC_VARIBLES.USER);
    
    // Check if user data exists before parsing
    if (!userDataString || userDataString === 'null' || userDataString === 'undefined') {
      console.log('No user data available in onAppForeground');
      return;
    }
    
    const user = JSON.parse(userDataString);
    
    // Check if user object and id exist
    if (!user || !user.id) {
      console.log('Invalid user data in onAppForeground');
      return;
    }
    
    const requestBody = {
      id: user.id,
      middleName: 'online',
    };
    // console.log('requestBody onAppForeground', requestBody);
    dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
    setReducerLoadingfalse(dispatch, () => {
      getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
    });
  } catch (error) {
    console.error('onAppForeground error:', error);
  }
};

export const savedLastScreenName = async (screenName) => {
  try {
    await AsyncStorage.setItem(ASYNC_VARIBLES.LAST_SCREEN_NAME, screenName);
  } catch (error) {
    console.error('savedLastScreenName error:', error);
  }
};

export const getLastScreenName = async () => {
  try {
    return await AsyncStorage.getItem(ASYNC_VARIBLES.LAST_SCREEN_NAME);
  } catch (error) {
    console.error('getLastScreenName error:', error);
    return null;
  }
};
export const navigateToLastScreen = async (navigation, ROUTES) => {
  try {
    navigation.navigate(ROUTES);
    savedLastScreenName(ROUTES);
  } catch (error) {
    console.error('navigateToLastScreen error:', error);
  }
};
/**
 * Returns true if the user has set at least one mandatory preference (marital status, age, religion, height)
 * to something other than default/Any. Used to decide whether to show the preference prompt dialog.
 */
export const isPreferencesSetByUser = (user) => {
  if (!user) return false;

  const hasMarital =
    user.pMaritalStatusId != null &&
    user.pMaritalStatusId !== '' &&
    user.pMaritalStatusId !== 'any' &&
    (Array.isArray(user.pMaritalStatusId)
      ? user.pMaritalStatusId.length > 0
      : true);

  const hasAge =
    user.pFromAge != null &&
    user.pToAge != null &&
    user.pFromAge !== 'any' &&
    user.pToAge !== 'any' &&
    user.pFromAge !== '18' &&
    user.pToAge !== '65';

  const hasReligion =
    user.pReligionId != null &&
    user.pReligionId !== '' &&
    user.pReligionId !== 'any';

  const hasHeight =
    user.pFromHeight != null &&
    user.pToHeight != null &&
    user.pFromHeight !== 'any' &&
    user.pToHeight !== 'any' &&
    user.pFromHeight !== '123' &&
    user.pToHeight !== '214';

  return hasMarital || hasAge || hasReligion || hasHeight;
};