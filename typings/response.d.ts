import { IUser } from "../models/user";
import { IMessage, IMessageResponse, MESSAGE_STATUS } from "../models/message";

export interface IError {
  error: {
    message: string;
  };
}

export interface IMessageResponse extends IMessage {
  id: string;
}

export interface ITypingMessageResponse {
  emitterId: string;
  // True if the typing req has some text
  isTyping: boolean;
}

export interface IUpdateMessageSocketResponse {
  emitterId: string;
  status: MESSAGE_STATUS;
}

export interface IUserResponse extends IUser {
  uid: string;
}

export interface IFriendsResponse extends IUserResponse {
  lastMessage?: IMessageResponse;
}

export interface IResponseAuth {
  successMessage: string;
  token: string;
}
