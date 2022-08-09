import jwtDecode from "jwt-decode";
import {
  AUTH_ACTION_TYPE,
  IAuthAction,
  IAuthSate,
  IJWTDecoded,
  IUser,
} from "../types/authTypes";

const authState: IAuthSate = {
  isLoading: true,
  authenticated: false,
  error: "",
  successMessage: "",
  userInf: null,
};

/**
 * Decodes the jwt to get the auth user info
 * @param jwt
 * @returns Null if token is not present or has expired
 */
const decodeJWT = (jwt?: string): IUser | null => {
  if (!jwt) return null;
  const { iat, exp, ...user } = jwtDecode(jwt) as IJWTDecoded;
  const expTime = new Date(exp * 1000);

  if (new Date() > expTime) return null;

  return user;
};

// Obtain the "stored user" in localstorage
const getToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;
  try {
    const user = decodeJWT(token);

    if (!!user) {
      authState.userInf = user;
      authState.authenticated = true;
      authState.isLoading = false;
    }
  } catch (error) {}
};

getToken();

const authReducer = (state = authState, action: IAuthAction): IAuthSate => {
  const { payload, type } = action;
  switch (type) {
    // FAIL ACTIONS
    case AUTH_ACTION_TYPE.REGISTER_FAIL:
      return newStateFail(state, payload.error!);
    case AUTH_ACTION_TYPE.LOGIN_FAIL:
      return newStateFail(state, payload.error!);
    // SUCCESS ACTIONS
    case AUTH_ACTION_TYPE.REGISTER_SUCCESS:
      const user = decodeJWT(payload.token);
      if (!!user) return newStateSuccesss(state, payload.successMessage!, user);
      else return newStateFail(state, "Token has expired");
    case AUTH_ACTION_TYPE.LOGIN_SUCCESS:
      const userInfo = decodeJWT(payload.token);
      if (!!userInfo)
        return newStateSuccesss(state, payload.successMessage!, userInfo);
      else return newStateFail(state, "Token has expired");
    // CLEAN ACTIONS
    case AUTH_ACTION_TYPE.SUCESSS_MESSAGE_CLEAR:
      return {
        ...state,
        successMessage: "",
      };
    case AUTH_ACTION_TYPE.ERROR_CLEAR:
      return {
        ...state,
        error: "",
      };
    // CLOSES THE SESSION
    case AUTH_ACTION_TYPE.LOGOUT:
      return {
        ...state,
        userInf: null,
        authenticated: false,
        error: "Your session has expired",
      } as IAuthSate;
    default:
      return state;
  }
};

/**
 * Returns the new state when the type is FAIL
 */
const newStateFail = (state: IAuthSate, error: string): IAuthSate => {
  return {
    ...state,
    error: error,
    successMessage: "",
    authenticated: false,
    userInf: null,
    isLoading: false,
  };
};

/**
 * Returns the new state when the type is SUCCESS
 */
const newStateSuccesss = (
  state: IAuthSate,
  successMessage: string,
  user: IUser
): IAuthSate => {
  return {
    ...state,
    userInf: user,
    successMessage: successMessage,
    error: "",
    authenticated: true,
    isLoading: false,
  };
};

export default authReducer;
