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

export const apiUrl = 'https://api.tribalshaadi.co.in';
// export const apiUrl = 'https://devapi.tribalshaadi.co.in';
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

export const resolveImageUri = path => {
  if (!path || typeof path !== 'string') {
    return undefined;
  }
  const trimmed = path.trim();
  if (!trimmed) {
    return undefined;
  }
  if (
    /^https?:\/\//i.test(trimmed) ||
    trimmed.startsWith('file:') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }
  const relative = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  return `${imageUrl}${relative}`;
};

// Home Screen API
export const getMatchedUsersUrl = 'app/users/getAllUsers';
export const sendProposalUrl = 'app/proposals/sendProposal';
export const passUserUrl = 'app/proposals/passUser';
export const getProposalsSendByMeUrl = 'app/proposals/getProposalsSendByMe';
export const getProposalsGotByMeUrl = 'app/proposals/getProposalsGotByMe';
export const getPassedUsersUrl = 'app/proposals/getPassedUsers';
export const getProfileViewedUsersUrl = 'app/proposals/getCancelledByUsers';
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
export const getDailyLimitStatusUrl =
  'app/notsubscribeProfileCount/getDailyLimitStatus';
export const getPreferenceUrl = 'admin/preferences/getPreference';
export const getSecondaryPreferenceUrl =
  'admin/secondaryPreferences/getSecondaryPreference';
export const getPremiumBenefitsUrl =
  'admin/premiumBenefits/getPremiumBenefits';

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
      navigate(ROUTES.WELCOME);
      return;
    }

    let user;
    try {
      user = JSON.parse(userDataString);
    } catch (parseError) {
      // Clear corrupted data
      try {
        await AsyncStorage.multiRemove([
          ASYNC_VARIBLES.USER,
          ASYNC_VARIBLES.USER_TOKEN,
        ]);
      } catch (clearError) {
      }
      navigate(ROUTES.WELCOME);
      return;
    }

    if (!user || typeof user !== 'object' || !user.id) {
      try {
        await AsyncStorage.multiRemove([
          ASYNC_VARIBLES.USER,
          ASYNC_VARIBLES.USER_TOKEN,
        ]);
      } catch (clearError) {
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
    // Ensure we don't crash the app - navigate to welcome as fallback
    try {
      navigate(ROUTES.WELCOME);
    } catch (navError) {
    }
  }
};
export const saveUserToStorage = async user => {
  try {
    await AsyncStorage.setItem(ASYNC_VARIBLES.USER, JSON.stringify(user));
    await AsyncStorage.setItem(ASYNC_VARIBLES.USER_TOKEN, user.token);
  } catch (error) {
  }
};
export const sendOTPForLogin = async (url, data, setLoading) => {
  try {
    const response = await axios.post(`${baseUrl}/${url}`, data);
    // AppToast(`${response.data.otp} is your OTP`);
    return true;
  } catch (error) {
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
        if (authResult === true) {
          // Only navigate to MainTabs if registration is completed, otherwise checkAuth handles the step navigation
          navigation.navigate(ROUTES.MAIN_TABS);
        }
      } catch (navError) {
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    setError('Incorrect OTP, please enter the valid OTP you received');
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

      // During initial load, navigate to welcome instead of crashing
      if (isInitialLoad) {
        navigate(ROUTES.WELCOME);
        return null;
      }

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
      return null;
    }

    const userData = response.data.recordList[0];

    // Safely save to AsyncStorage
    try {
      await AsyncStorage.setItem(ASYNC_VARIBLES.USER, JSON.stringify(userData));
    } catch (storageError) {
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
    }

    return userData;
  } catch (error) {

    // Handle different error types safely
    if (error.response && error.response.data) {
      const status = error.response.data.status;

      if (status === 401) {

        // During initial load, don't logout aggressively - just navigate to welcome
        if (isInitialLoad) {
          try {
            await AsyncStorage.multiRemove([
              ASYNC_VARIBLES.USER,
              ASYNC_VARIBLES.USER_TOKEN,
            ]);
            navigate(ROUTES.WELCOME);
          } catch (clearError) {
            navigate(ROUTES.WELCOME);
          }
        } else {
          // For subsequent calls, do normal logout
          try {
            await logoutUser(dispatch);
          } catch (logoutError) {
            // Fallback navigation
            navigate(ROUTES.WELCOME);
          }
        }
      } else if (status === 400) {
        if (isInitialLoad) {
          navigate(ROUTES.WELCOME);
        } else {
          try {
            await logoutUser(dispatch);
          } catch (logoutError) {
          }
        }
      } else {
      }
    } else if (error.code === 'ECONNABORTED') {
    } else if (error.message === 'Network Error') {
    } else {
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
      return false;
    }

    let user;
    try {
      user = JSON.parse(userDataString);
    } catch {
      await AsyncStorage.multiRemove([ASYNC_VARIBLES.USER, ASYNC_VARIBLES.USER_TOKEN]);
      return false;
    }
    // Last screen check
    try {
      if (user.intrests) {
        dispatch(setUserRegistrationCompleted(true));
        return true;
      }
      if (typeof getLastScreenName === 'function') {
        const lastScreenName = await getLastScreenName();
        if (lastScreenName && lastScreenName !== 'null') {
          navigate(lastScreenName);
          return false;
        }

        for (const step of PROFILE_COMPLETION_STEPS) {
          if (!user[step.field]) {
            navigate(step.screen);
            return false;
          }
        }
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  } catch (error) {
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
    } catch (fcmError) {
    }
  } catch (error) {
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
    if (setUserImageList) {
      setUserImageList(response.data.recordList);
    }
  } catch (error) {
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
    const response = await axios.post(`${baseUrl}/${url}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
    await AsyncStorage.clear();
    logoutUser(dispatch);
  } catch (error) {
  }
};
export const setReducerLoadingfalse = async (dispatch, func) => {
  try {
    await delay();
    if (func) {
      func();
    }
  } catch (error) {
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
    await getUserDetailsApi(
      `${getUserDetailsUrl}id=${user.id}`,
      dispatch,
      false,
    );
  } catch (error) {
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

    return filteredChat.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );
  } catch (error) {
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
    return response.data;
  } catch (error) {
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
    return response.data;
  } catch (error) {
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
    if (response.data.verified === false) {
      dispatch(setSelfieVerify(false));
    }
    return response.data;
  } catch (error) {
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
      return;
    }
    
    const user = JSON.parse(userDataString);
    
    // Check if user object and id exist
    if (!user || !user.id) {
      return;
    }
    
    const requestBody = {
      id: user.id,
      middleName: 'offline',
    };
    dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
    setReducerLoadingfalse(dispatch, () => {
      getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
    });
  } catch (error) {
  }
};

// Called when the app comes to foreground
export const onAppForeground = async dispatch => {
  try {
    const userDataString = await AsyncStorage.getItem(ASYNC_VARIBLES.USER);
    
    // Check if user data exists before parsing
    if (!userDataString || userDataString === 'null' || userDataString === 'undefined') {
      return;
    }
    
    const user = JSON.parse(userDataString);
    
    // Check if user object and id exist
    if (!user || !user.id) {
      return;
    }
    
    const requestBody = {
      id: user.id,
      middleName: 'online',
    };
    dispatch(completeUserProfileV2Updated(updateUrl, requestBody));
    setReducerLoadingfalse(dispatch, () => {
      getUserDetailsApi(`${getUserDetailsUrl}id=${user.id}`, dispatch);
    });
  } catch (error) {
  }
};

export const savedLastScreenName = async (screenName) => {
  try {
    await AsyncStorage.setItem(ASYNC_VARIBLES.LAST_SCREEN_NAME, screenName);
  } catch (error) {
  }
};

export const getLastScreenName = async () => {
  try {
    return await AsyncStorage.getItem(ASYNC_VARIBLES.LAST_SCREEN_NAME);
  } catch (error) {
    return null;
  }
};
export const navigateToLastScreen = async (navigation, ROUTES) => {
  try {
    navigation.navigate(ROUTES);
    savedLastScreenName(ROUTES);
  } catch (error) {
  }
};

export const getPopupContent = async () => {
  try {
    const token =(await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN));
    if (!token || token === 'null' || token === 'undefined') {
      return null;
    }

    const response = await axios.get(
      `${baseUrl}/app/membershipPopupContents/getMembershipPopupContent`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );

    return response.data.recordList;
  } catch (error) {
    return null;
  }
};/**
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