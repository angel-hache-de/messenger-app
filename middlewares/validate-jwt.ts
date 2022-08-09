import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// Instancia del modelo
import User from "../models/user";
import { IError, IUserResponse } from "../typings/response";

export interface IModifiedRequest extends Request {
  authUser: IUserResponse;
}

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  // En el front=end se deben de mandar este header.
  const token = req.cookies["authToken"];

  if (!token)
    return res.status(401).json({
      error: {
        message: "Unauthorized",
      },
    } as IError);

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY!) as any;

    const authUser = await User.findById(uid);
    // Si el usuario no ha sido eliminado
    if (!authUser || !authUser.status)
      return res.status(401).json({
        error: {
          message: "Unauthorized",
        },
      } as IError);

    (req as IModifiedRequest).authUser = {
      email: authUser.email,
      image: authUser.image,
      userName: authUser.userName,
      uid: authUser._id.toString(),
    };

    next();
  } catch (error) {
    console.log(error);
    const err: IError = {
      error: {
        message: "Token expired",
      },
    };
    res.status(401).json(err);
  }
};

export default validateJWT;
