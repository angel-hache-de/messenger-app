import { Users } from "../models/chat";
import { ITypingMessageRequest, IUpdateMessageSocketRequest } from "./request";
import {
  IMessageResponse,
  ITypingMessageResponse,
  IUpdateMessageSocketResponse,
  IUserResponse,
} from "./response";

export interface ServerToClientEvents {
  /**
   * Sends the connected users
   */
  get_users: (users: Users) => void;
  /**
   * Sends to the connected users the info of the new client connected
   */
  connected_user: (user: IUserResponse) => void;
  /**
   * Sends a private message
   */
  private_message: (message: IMessageResponse) => void;
  /**
   * Sends a private message notifying the "is typing" status
   */
  show_typing_message: (notifyTyping: ITypingMessageResponse) => void;
  /**
   * Sends a private message to modify the message status
   */
  update_message_status: (message: IUpdateMessageSocketResponse) => void;
  /**
   * Sends a broadcast disconnection message
   */
  disconnected_user: (userId: string) => void;
}

export interface ClientToServerEvents {
  /**
   * Received to emit a private message
   */
  send_message: (message: IMessageResponse) => void;
  /**
   * Received to emit the show typing message
   */
  notify_typing_message: (message: ITypingMessageRequest) => void;
  /**
   * Received to emit update message request
   */
  update_message_status_req: (message: IUpdateMessageSocketRequest) => void;
  /**
   * Received to emit disconnected user
   */
  disconnect: () => void;
}
