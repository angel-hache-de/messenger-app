import { Server, Socket } from "socket.io";
import Chat from "../models/chat";
import {
  /* IMessageRequest, */ ITypingMessageRequest,
  IUpdateMessageSocketRequest,
} from "../typings/request";
// import { v4 as uuid } from "uuid";
import {
  IMessageResponse,
  ITypingMessageResponse,
  IUpdateMessageSocketResponse,
} from "../typings/response";
import User from "../models/user";

export interface ISocketModifiedReq {
  authUserId: string;
}

const chat = new Chat();

// Esto de new Socket es SOLO para DEV
const socketController = async (socket: Socket, io: Server) => {
  const { authUserId } = socket.request as typeof socket.request &
    ISocketModifiedReq;

  // Gets the user info from db
  const user = await User.findById(authUserId);
  if (!user) return socket.disconnect();

  socket.join(authUserId);
  // EMIT's
  // When a new user connects, then send him all the connected users.
  socket.emit("get_users", chat.users);
  chat.connectUser(authUserId);

  // Notifies the rest of the users that one user has been connected
  socket.broadcast.emit("connected_user", user);
  console.log("Connecting...", user?.userName);

  // ON's
  socket.on("send_message", (message: IMessageResponse) => {
    console.log("SENDING MESSAGE");
    
    if (!message.receptorId) return;

    socket.to(message.receptorId.toString()).emit("private_message", message);
    // io.emit("private_message", messageToSend);
  });

  socket.on(
    "notify_typing_message",
    ({ receptorId, isTyping }: ITypingMessageRequest) => {

      if (!receptorId) return;
      const notifyTyping: ITypingMessageResponse = {
        // receptorId: message.receptorId,
        emitterId: authUserId,
        isTyping,
      };

      socket.to(receptorId).emit("show_typing_message", notifyTyping);
    }
  );

  // Receive and send the request to update the last message's status
  socket.on(
    "update_message_status_req",
    ({ status, receptorId }: IUpdateMessageSocketRequest) => {
      if (!receptorId) return;
      // The message that will be updated is the last message beetwen
      // the emitter and the receptor
      socket.to(receptorId).emit("update_message_status", {
        emitterId: authUserId,
        status,
      } as IUpdateMessageSocketResponse);
    }
  );

  socket.on("disconnect", () => {
    console.log("Disconnecting...", user.userName);

    chat.disconnectUser(authUserId);
    io.emit("disconnected_user", authUserId);
  });
};

export default socketController;
