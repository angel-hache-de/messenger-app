import { Request, Response } from "express";
import { IModifiedRequest } from "../middlewares/validate-jwt";
import User from "../models/user";
import { IError, IFriendsResponse } from "../typings/response";
import { getLastMessage } from "./message";

/**
 * The token should have been validated
 * @param request
 * @param res
 */
export const getFriendsController = async (request: Request, res: Response) => {
  try {
    const req = request as IModifiedRequest;
    const friends = await User.find({
      _id: {
        $ne: req.authUser.uid,
      },
    });

    const friendsResponse: IFriendsResponse[] = [];

    await Promise.all(
      friends.map(async (friend): Promise<void> => {
        friendsResponse.push({
          email: friend.email,
          image: friend.image,
          userName: friend.userName,
          uid: friend._id.toString(),
          lastMessage: await getLastMessage(friend.id, req.authUser.uid),
        });
      })
    );

    res.status(200).json({
      success: true,
      friends: friendsResponse,
    });
  } catch (error) {
    console.log(error);
    const err: IError = {
      error: {
        message: "Internal server error",
      },
    };
    res.status(500).json(err);
  }
};
