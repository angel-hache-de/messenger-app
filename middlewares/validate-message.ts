import { NextFunction, Request, Response } from "express";
import { MESSAGE_STATUS } from "../models/message";
import {
  IMessageCreateRequest,
  IMessageUpdateRequest,
} from "../typings/request";
import { IError } from "../typings/response";
import { IModifiedRequest } from "./validate-jwt";

/**
 * Validates that there is a photo or some text in the message
 */
const validateMessageContent = (
  request: Request,
  res: Response,
  next: NextFunction
) => {
  const req = request as IModifiedRequest;
  if (!req.authUser) {
    console.log("Verifying the message content but there is not auth user...");
    console.log(req);
    return res.status(401).json({
      error: {
        message: "Unauthorized",
      },
    } as IError);
  }

  const { text } = req.body as IMessageCreateRequest;
  let valid = false;

  if (!!req.files && Object.keys(req.files).length <= 4) valid = true;

  if (!!text && !!text.trim().length) valid = true;

  if (!valid)
    return res.status(400).json({
      error: {
        message: "You must send a text or maximum 4 images",
      },
    } as IError);

  next();
};

/**
 * Used to validate that the message's status is delivered or seen.
 * The status sent is the default when the message is created.
 * @param request
 * @param res
 * @param next
 * @returns
 */
export const validateMessageStatus = (
  request: Request,
  res: Response,
  next: NextFunction
) => {
  const req = request as IModifiedRequest;
  if (!req.authUser) {
    console.log("Verifying the message status but there is not auth user...");
    return res.status(401).json({
      error: {
        message: "Unauthorized",
      },
    } as IError);
  }

  const { status } = req.body as IMessageUpdateRequest;

  if (
    !status ||
    (status !== MESSAGE_STATUS.DELIVERED && status !== MESSAGE_STATUS.SEEN)
  )
    return res.status(400).json({
      error: {
        message: "Invalid status",
      },
    } as IError);

  next();
};

export default validateMessageContent;
