export enum MESSENGER_ACTION_TYPE {
  // MESSAGES
  SEND_MESSAGE = "SEND_MESSAGE",
  SET_MESSAGES = "SET_MESSAGES",
  SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS",
  ADD_MESSAGE = "ADD_MESSAGE",
  SET_BACKEND_ERROR = "SET_BACKEND_ERROR",
  CLEAR_MESSAGES = "CLEAR MESSAGES",
  CLEAR_MESSAGE_SUCCESS = "CLEAR_MESSAGE_SUCCESS",
}

export enum MESSAGES_SOCKET_EVENTS {
  UPDATE_MESSAGE_STATUS_REQUEST = "update_message_status_req",
  PRIVATE_MESSAGE_RECEIVED = "private_message",
  USER_DISCONNECTED = "disconnected_user",
  USER_CONNECTED = "connected_user",
  SHOW_TYPING_MESSAGE = "show_typing_message",
  UPDATE_MESSAGE_STATUS = "update_message_status",
  GET_USERS = "get_users",
  ERROR_WHILE_CONNECTING = "connect_error",
  SEND_MESSAGE = "send_message",
  NOTIFY_TYPING = "notify_typing_message",
}

export enum MESSAGE_STATUS {
  SEEN = "seen",
  DELIVERED = "delivered",
  SENT = "sent",
}

export interface IMessengerState {
  messages: IMessage[];
  messageSentSuccessfully: boolean;
}

export interface IMessageRequest {
  receptorId: string;
  text: string;
  images: File[];
  // createdAt: Date;
}

// Message base
interface IBaseMessage {
  emitterId: string;
  receptorId: string;
  createdAt?: Date;
  id: string;
  status?: MESSAGE_STATUS;
}

// Message received with socket
export interface IMessageSocket extends IBaseMessage {
  message: {
    text: string;
    // images from server
    images?: File[];
  };
}

// Messages returned by api.
export interface IMessage extends IBaseMessage {
  message: {
    text: string;
    // images from server
    images?: string[] | File[];
  };
  // Used when images are received from the socket
  isBlobImage?: boolean;
}

// Data that will be send on the socket to udpate the
// message's status
export interface IUpdateMessageStatusSocket {
  status: MESSAGE_STATUS;
  receptorId: string;
}

// Data that will be received on the socket
// that indicates how to updated the message
export interface IUpdateMessageStatusSocketRes {
  status: MESSAGE_STATUS;
  emitterId: string;
}

export interface IMessengerPayload {
  message?: IMessage;
  messages?: IMessage[];
  status?: MESSAGE_STATUS;
}

export type MessengerDispatchType = (args: IMessengerAction) => IMessengerState;

export interface IMessengerAction {
  type: MESSENGER_ACTION_TYPE;
  payload: IMessengerPayload;
}
