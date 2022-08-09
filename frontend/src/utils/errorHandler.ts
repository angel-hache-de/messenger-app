import axios from "axios";
import { Dispatch } from "redux";
import { removeToken } from "../store/actions/authActions";
import {
  IError,
  IStatusAction,
  STATUS_ACTION_TYPE,
} from "../store/types/statusTypes";

export const handleRequestError = (error: any, dispatch: Dispatch) => {
  if (!axios.isAxiosError(error) || !error.response?.data.error)
    return dispatch({
      type: STATUS_ACTION_TYPE.SET_ERROR,
      payload: {
        error: error.message,
      },
    } as IStatusAction);

  const errMessage = (error.response?.data as IError).error.message;
  if (errMessage === "Token expired" || errMessage === "Unauthorized")
    return removeToken(dispatch);

  dispatch({
    type: STATUS_ACTION_TYPE.SET_ERROR,
    payload: {
      error: errMessage,
    },
  } as IStatusAction);
};
