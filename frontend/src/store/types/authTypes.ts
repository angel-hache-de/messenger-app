export enum AUTH_ACTION_TYPE {
  REGISTER_FAIL = "REGISTER_FAIL",
  REGISTER_SUCCESS = "REGISTER_SUCCESS",
  SUCESSS_MESSAGE_CLEAR = "SUCESSS_MESSAGE_CLEAR",
  ERROR_CLEAR = "ERROR_CLEAR",
  LOGIN_FAIL = "LOGIN_FAIL",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGOUT = "LOGOUT",
}

export interface IUser {
  uid: string;
  userName: string;
  email: string;
  image: string;
  /**If true show the is typing animation */
  isTyping?: boolean;
}

export interface IAuthSate {
  isLoading: boolean;
  authenticated: boolean;
  error: string;
  successMessage: string;
  userInf?: IUser | null;
}

export interface IAuthPayload {
  isLoading?: boolean;
  authenticated?: boolean;
  error?: string;
  successMessage?: string;
  token?: string;
}

export interface IAuthAction {
  type: AUTH_ACTION_TYPE;
  payload: IAuthPayload;
}

export interface IJWTDecoded extends IUser {
  exp: number;
  iat: number;
}

export type AuthDispatchType = (args: IAuthAction) => IAuthSate;

// Error that returns the api when there is
// an invalid field
export interface IAuthError {
  errors: {
    msg: string;
  }[];
}
