import { Socket } from "socket.io";
import { verifyJWT } from "../helpers/generate-jwt";
import { ISocketModifiedReq } from "../controllers/sockets";
import { IUserResponse } from "../typings/response";

/**
 * Middleware that validates the token received
 * @param socket Client's socket
 * @param next Next function of socket io
 * @returns Error if not valid
 */
const socketJWTMiddleware = async (socket: Socket, next: any) => {
  const token = socket.handshake.auth.token as string;

  if (!token) return next(new Error("Unauthorized"));

  try {
    // verifyJWT returns an IUserResponse Obj
    const user = (await verifyJWT(token)) as any;

    if (!user) return next(new Error("Internal Error"));

    (socket.request as typeof socket.request & ISocketModifiedReq).authUserId =
      user.uid.toString();

    next();
  } catch (error: any) {
    console.log(error);
    if (error.message && error.message === "jwt expired") {
      socket.disconnect();
      next(new Error(error.message as string));
    } else next(new Error("Internal Error"));
  }
};

export default socketJWTMiddleware;
