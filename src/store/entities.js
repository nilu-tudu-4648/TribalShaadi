import { combineReducers } from "redux";
import authReducer from "./reducers/authReducer";
import userReducer from "./reducers/userReducer";
import paymentReducer from "./reducers/paymentReducer";
import chatReducer from "./reducers/chatReducer";

export default combineReducers({
  authReducer,
  userReducer,
  paymentReducer,
  chatReducer,
});
