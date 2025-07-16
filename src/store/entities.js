import { combineReducers } from "redux";
import authReducer from "./reducers/authReducer";
import userReducer from "./reducers/userReducer";
import paymentReducer from "./reducers/paymentReducer";

export default combineReducers({
  authReducer,
  userReducer,
  paymentReducer,
});
