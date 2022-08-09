import { Request, Response } from "express";

import { uploadFiles } from "../helpers/upload-files-cloudinary";
import { IModifiedRequest } from "../middlewares/validate-jwt";
import Message from "../models/message";
import {
  IMessageCreateRequest,
  IMessageUpdateRequest,
} from "../typings/request";
import { IError } from "../typings/response";

/**
 * Creates a document of type Message and stores it on db.
 * @param request
 * @param res
 */
export const postSendMessageController = async (
  request: Request,
  res: Response
) => {
  const req = request as IModifiedRequest;
  const { receptorId, text } = req.body as IMessageCreateRequest;
  const emitterId = req.authUser.uid;

  // Image eztensions
  const valImgExt = ["jpg", "png", "jpeg"];

  try {
    // Upload the files
    let images: string[] = [];
    if (!!req.files && !!req.files.file)
      images = await uploadFiles(req.files.file);

    //This way is used because is easily mocked
    const message = await Message.create({
      emitterId,
      receptorId: receptorId,
      message: {
        text: text,
        images: images,
      },
    });

    // const message = new Message({
    //   emitterId,
    //   receptorId: receptorId,
    //   message: {
    //     text: text,
    //     images: images,
    //   },
    // });

    // await message.save();

    res.status(201).json({
      message,
      success: true,
    });
  } catch (error: any) {
    console.log(error);
    // If the file(s) are not images
    const regexInvalidExtension = /\bCheck your files\b/;

    if (regexInvalidExtension.test(error.message))
      return res.status(400).json({
        error: {
          message: error.message,
        },
      });

    const err: IError = {
      error: {
        message: "Internal server error",
      },
    };
    res.status(500).json(err);
  }
};

/**
 * Returns the messages between 2 users
 * @param request
 * @param res
 */
export const getMessagesController = async (
  request: Request,
  res: Response
) => {
  const req = request as IModifiedRequest;
  const emitterId = req.authUser.uid;
  const receptorId = req.params.id;

  try {
    // Find the messages where appear both ids.
    const messages = await Message.find({
      emitterId: { $in: [emitterId, receptorId] },
      receptorId: { $in: [emitterId, receptorId] },
    });

    res.status(200).json({
      success: true,
      messages,
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

/**
 * Gets the last message between 2 users
 * @param user1 Id of the user 1
 * @param user2 Id of the user 2
 * @returns Last message saved
 */
export const getLastMessage = async (user1: string, user2: string) => {
  try {
    const msg = await Message.findOne({
      emitterId: { $in: [user1, user2] },
      receptorId: { $in: [user1, user2] },
    }).sort({ updatedAt: -1 });

    return msg;
  } catch (error) {
    throw error;
  }
};

/**
 * Connects to mongoDB and updates the status of the message
 * @param req
 * @param res
 */
export const updateMessageStatus = async (req: Request, res: Response) => {
  const { messageId, status } = req.body as IMessageUpdateRequest;

  try {
    const message = await Message.findByIdAndUpdate(messageId, {
      status,
    });

    res.status(200).json({
      message,
      success: true,
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
