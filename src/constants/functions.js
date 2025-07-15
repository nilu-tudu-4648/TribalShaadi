import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_VARIBLES } from './data';
import {
  setUser,
  logoutFromReducer,
  setLoadingfalse,
} from '../store/reducers/authReducer';
import { setUserRegistrationCompleted } from '../store/reducers/userReducer';
import axios from 'axios';
import AppToast from '../components/AppToast';
import { navigate } from '../navigation/NavigationRef';
import { ROUTES } from './data';

export const baseUrl = 'https://api.tribalshaadi.co.in/api';
export const updateUrl = 'app/users/completeUserProfileV2';
export const getUserDetailsUrl = 'app/users/viewUserDetail?';
export const getReligionUrl = 'admin/religion/getReligion';
export const getCommunityUrl = 'admin/community/getCommunity?isActive=true&';
export const getStatesUrl = 'admin/states/getStates';
export const getCitiesUrl = 'admin/districts/getDistricts';
export const getMaritalStatusUrl = 'admin/maritalStatus/getMaritalStatus';
export const getEducationUrl = 'admin/education/getEducation';
export const getEducationTypeUrl = 'admin/education/getEducationType';
export const getOccupationUrl = 'admin/occupation/getOccupation';
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

// https://api.tribalshaadi.co.in/content/user/24/9.jpeg
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
      await saveUserToStorage(response.data.recordList[0]);
      await getUserDetailsApi(
        `${getUserDetailsUrl}id=${response.data.recordList[0].id}`,
        dispatch,
      );
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
    // console.log(token, 'token');
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

// Function to convert height in cm to readable format
export const convertCmToReadableHeight = cm => {
  const feet = Math.floor(cm / 30.48);
  const inches = Math.round((cm / 30.48 - feet) * 12);
  return `${feet}'${inches}"`;
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
export const resetPreferenceApi = async data => {
  try {
    const token = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN);
    const response = await axios.post(`${baseUrl}/${updateUrl}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, 'resetPreferenceApi');
  } catch (error) {
    console.log(error, 'resetPreferenceApi');
  }
};
