import axios, { AxiosRequestConfig } from "axios";
import { Dispatch } from "redux";

import {
  FRIENDS_ACTION_TYPE,
  IFriendResponse,
  IFriendsAction,
  IFriendsObj,
} from "../types/friendsTypes";

import { MESSAGE_STATUS } from "../types/messengerTypes";

import { ENDPOINTS } from "../../utils/endpoints";
import { handleRequestError } from "../../utils/errorHandler";

const config: AxiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * Send a request to api to update the status of the last message between
 * the auth user and the friend
 * @param messageId
 * @param friendId
 * @param status
 * @returns
 */
export const updateMessage = (
  messageId: string,
  friendId: string,
  status: MESSAGE_STATUS
) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.put(
        `${ENDPOINTS.UPDATE_MESSAGE}/${messageId}`,
        {
          status,
        },
        config
      );

      // console.log(response.data.message);

      // Updates the last message status
      dispatch({
        type: FRIENDS_ACTION_TYPE.SET_MESSAGES_STATUS,
        payload: {
          messageStatus: {
            friendId,
            status,
          },
        },
      } as IFriendsAction);
    } catch (error) {
      handleRequestError(error, dispatch);
    }
  };
};

/**
 * Send request to api to get all authUser's friends
 * @returns void but dispatch an action
 */
export const getFriends = () => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: FRIENDS_ACTION_TYPE.SET_LOADING,
        payload: true,
      } as IFriendsAction);

      const response = await axios.get(ENDPOINTS.GET_FRIENDS, config);

      const friendsAsObj: IFriendsObj<IFriendResponse> = {};

      response.data.friends.forEach((friend: IFriendResponse) => {
        friendsAsObj[friend.uid] = friend;
      });

      dispatch({
        type: FRIENDS_ACTION_TYPE.SET_FRIENDS,
        payload: {
          friends: friendsAsObj,
        },
      });

      dispatch({
        type: FRIENDS_ACTION_TYPE.SET_LOADING,
        payload: false,
      } as IFriendsAction);
    } catch (error) {
      handleRequestError(error, dispatch);
    }
  };
};
