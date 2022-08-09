import { IUser } from "../store/types/authTypes";
import { IFriendsObj } from "../store/types/friendsTypes";
import { IMessage, IUpdateMessageStatusSocket, IUpdateMessageStatusSocketRes } from "../store/types/messengerTypes";
import { ITypingMessageRequest, ITypingMessageResponse } from "../store/types/socketTypes";

export interface ServerToClientEvents {
  /**
   * Sends the connected users
   */
  get_users: (users: IFriendsObj<string>) => void;
  /**
   * Sends to the connected users the info of the new client connected
   */
  connected_user: (user: IUser) => void;
  /**
   * Sends a private message
   */
  private_message: (message: IMessage) => void;
  /**
   * Sends a private message notifying the "is typing" status
   */
  show_typing_message: (notifyTyping: ITypingMessageResponse) => void;
  /**
   * Sends a private message to modify the message status
   */
  update_message_status: (message: IUpdateMessageStatusSocketRes) => void;
  /**
   * Sends a broadcast disconnection message
   */
  disconnected_user: (userId: string) => void;
}

export interface ClientToServerEvents {
  /**
   * Received to emit a private message
   */
  send_message: (message: IMessage) => void;
  /**
   * Received to emit the show typing message
   */
  notify_typing_message: (message: ITypingMessageRequest) => void;
  /**
   * Received to emit update message request
   */
  update_message_status_req: (message: IUpdateMessageStatusSocket) => void;
  /**
   * Received to emit disconnected user
   */
  disconnect: () => void;
}
