import { IUser } from "./authTypes";
import { IMessage, MESSAGE_STATUS } from "./messengerTypes";

export enum FRIENDS_ACTION_TYPE {
  SET_FRIENDS = "SET_FRIENDS",
  SET_CURRENT_FRIEND = "SET_CURRENT_FRIEND",
  SET_ACTIVE_FRIENDS = "SET_ACTIVE_FRIENDS",
  REMOVE_ACTIVE_FRIEND = "REMOVE_ACTIVE_FRIEND",
  SET_IS_TYPING = "SET_IS_TYPING",
  SET_LAST_MESSAGE = "SET_LAST_MESSAGE",
  SET_MESSAGES_STATUS = "SET_MESSAGES_STATUS",
  SET_LOADING = "SET_LOADING",
  CLEAR_FRIENDS = "CLEAR_FRIENDS"
}

export interface IFriendsObj<T> {
  [name: string]: T;
}

export interface IFriendResponse extends IUser {
  lastMessage: IMessage | null;
}

export interface IFriendsState {
  friends: IFriendsObj<IFriendResponse>;
  currentFriend: IUser | null;
  // Active friends. Only stores id's
  activeFriends: IFriendsObj<string>;
  loading: boolean;
}

export interface IFriendsPayload {
  friends?: IFriendsObj<IUser>;
  activeFriends?: IFriendsObj<string>;
  currentFriend?: IUser;
  loading?: boolean;
  // Used to delete an active friend
  activeFriend?: string;
  // Used to show the typing animation over a friend
  typing?: {
    userId: string;
    isTyping: boolean;
  };
  // Used to updated the last message
  newMessage?: {
    // Friend who sent/received the message
    friendId: string;
    message: IMessage;
  };
  messageStatus?: {
    friendId: string;
    status: MESSAGE_STATUS;
  };
}

export type FriendsDispatchType = (args: IFriendsAction) => IFriendsState;

export interface IFriendsAction {
  type: FRIENDS_ACTION_TYPE;
  payload: IFriendsPayload;
}
