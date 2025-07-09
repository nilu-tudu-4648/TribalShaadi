import { combineReducers } from "redux";
import authReducer from "./reducers/authReducer";
import userReducer from "./reducers/userReducer";


export default combineReducers({
  authReducer,
  userReducer,
});
