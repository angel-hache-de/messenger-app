import axios, { AxiosRequestConfig } from "axios";
import { Dispatch } from "redux";
import { ENDPOINTS } from "../../utils/endpoints";
import { handleRequestError } from "../../utils/errorHandler";
import { IUser } from "../types/authTypes";

import {
  IMessengerAction,
  MESSENGER_ACTION_TYPE,
} from "../types/messengerTypes";

const config: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Send a request to api to save and send a message
 * @param data message to send. Type of @interface IMessageRequest
 * @returns void. Dispatch the set messagesa action if
 * everything ok
 */
export const sendMessage = (data: FormData) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(
        ENDPOINTS.SEND_MESSAGE,
        data,
        config
      );

      // console.log(response.data.message);

      // Show the message on the screen
      dispatch({
        type: MESSENGER_ACTION_TYPE.SEND_MESSAGE_SUCCESS,
        payload: {
          message: response.data.message,
        },
      } as IMessengerAction);
    } catch (error) {
      handleRequestError(error, dispatch);
    }
  };
};

/**
 * Request the api to get the messages between the auth User and
 * the specified friend.
 * @param friend
 * @returns
 */
export const getMessages = (friend: IUser) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(
        `${ENDPOINTS.GET_MESSAGES}/${friend.uid}`,
        config
      );

      dispatch({
        type: MESSENGER_ACTION_TYPE.SET_MESSAGES,
        payload: {
          messages: response.data.messages,
        },
      } as IMessengerAction);
    } catch (error) {
      handleRequestError(error, dispatch);
    }
  };
};
