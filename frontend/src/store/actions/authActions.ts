import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { ENDPOINTS } from "../../utils/endpoints";
import { handleRequestError } from "../../utils/errorHandler";
import { AUTH_ACTION_TYPE, IAuthAction, IAuthError } from "../types/authTypes";
import { FRIENDS_ACTION_TYPE } from "../types/friendsTypes";
import { MESSENGER_ACTION_TYPE } from "../types/messengerTypes";

const config: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Removes the token from localStorage
 * @param dispatch
 */
export const removeToken = (dispatch: Dispatch) => {
  dispatch({
    type: AUTH_ACTION_TYPE.LOGOUT,
  });

  dispatch({
    type: MESSENGER_ACTION_TYPE.CLEAR_MESSAGES,
  });

  dispatch({
    type: FRIENDS_ACTION_TYPE.CLEAR_FRIENDS,
  });

  localStorage.removeItem("authToken");
};

/**
 * Send a req to endpoint to clear the cookie
 */
export const logout = () => {
  return async (dispatch: Dispatch) => {
    try {
      await axios.post(ENDPOINTS.LOGOUT, {}, config);

      removeToken(dispatch);
    } catch (error) {
      handleRequestError(error, dispatch);
    }
  };
};

/**
 * Sends the axios req to given endpoint and stores the token
 * in localStorage
 * @param data Form data to send
 * @param uri endpoint
 * @returns Action ready to dispatch
 */
const sendAuthReq = async (
  data: FormData,
  uri: string,
  successType:
    | AUTH_ACTION_TYPE.REGISTER_SUCCESS
    | AUTH_ACTION_TYPE.LOGIN_SUCCESS,
  errorType: AUTH_ACTION_TYPE.REGISTER_FAIL | AUTH_ACTION_TYPE.LOGIN_FAIL
): Promise<IAuthAction> => {
  try {
    const response: AxiosResponse = await axios.post(uri, data, config);

    localStorage.setItem("authToken", response.data.token);

    const action: IAuthAction = {
      type: successType,
      payload: {
        successMessage: response.data.successMessage,
        token: response.data.token,
      },
    };

    return action;
  } catch (error) {
    const err: AxiosError = error as AxiosError;

    const action: IAuthAction = {
      type: errorType,
      payload: {
        error: err.response?.data.errors
          ? err.response?.data.errors[0].msg
          : err.message,
      },
    };

    // if (!!err.response) {
    //   const data: IAuthError = err.response.data as IAuthError;
    //   action.payload.error = data.errors[0].msg;
    // } else action.payload.error = err.message;

    return action;
  }
};

export const userRegister = (data: FormData) => {
  return async (dispatch: Dispatch) => {
    const action = await sendAuthReq(
      data,
      ENDPOINTS.SIGNUP,
      AUTH_ACTION_TYPE.REGISTER_SUCCESS,
      AUTH_ACTION_TYPE.REGISTER_FAIL
    );
    dispatch(action);
  };
};

export const userLogin = (data: FormData) => {
  return async (dispatch: Dispatch) => {
    const action = await sendAuthReq(
      data,
      ENDPOINTS.LOGIN,
      AUTH_ACTION_TYPE.LOGIN_SUCCESS,
      AUTH_ACTION_TYPE.LOGIN_FAIL
    );

    dispatch(action);
  };
};
