import { apiCallBegan, apiCallFailed, apiCallSuccess } from "../api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../constants/functions";
import { ASYNC_VARIBLES } from "../../constants/data";
import { logoutFromReducer } from "../reducers/authReducer";

const apiMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    if (action.type !== apiCallBegan.type) {
      return next(action);
    }

    const {
      url,
      method,
      data,
      onSuccess,
      onStart,
      onError,
      headers = {},
    } = action.payload;

    // Dispatch onStart action if provided
    if (onStart) {
      dispatch({ type: onStart });
    }

    next(action);

    try {
      // Fetch token from AsyncStorage
      const userToken = await AsyncStorage.getItem(ASYNC_VARIBLES.USER_TOKEN)
      // Make the API request
      const response = await axios.request({
        baseURL: baseUrl,
        url,
        method,
        data,
        headers: {
          ...headers,
          Authorization: userToken ? `Bearer ${userToken}` : undefined,
        },
      });
      // Dispatch general success action
      dispatch(apiCallSuccess(response.data));

      // Dispatch specific success action if provided
      if (onSuccess) {
        dispatch({ type: onSuccess, payload: response.data });
      }
    } catch (error) {
      // Handle network errors
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        const networkErrorMessage = 'Network error. Please check your internet connection and try again.';
        dispatch(apiCallFailed(networkErrorMessage));
        
        if (onError) {
          dispatch({ type: onError, payload: networkErrorMessage });
        }
        return;
      }

      // Handle 401 unauthorized errors
      if(error.response?.status === 401){
        AsyncStorage.removeItem(ASYNC_VARIBLES.USER_TOKEN);
        AsyncStorage.removeItem(ASYNC_VARIBLES.USER);
        dispatch(logoutFromReducer());
      }
      
      const errorMessage = error.response?.data || error.message;
      // Dispatch general error action
      dispatch(apiCallFailed(errorMessage));

      // Dispatch specific error action if provided
      if (onError) {
        dispatch({ type: onError, payload: errorMessage });
      }
    }
  };

export default apiMiddleware;
