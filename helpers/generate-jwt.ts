import jwt, { JwtPayload } from "jsonwebtoken";

import User, { IUser } from "../models/user";
import { IUserResponse } from "../typings/response";

export interface IJwtPayload {
  userName: string;
  email: string;
  image: string;
  uid: string;
}

const generateJWT = (userInfo: IJwtPayload) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userName: userInfo.userName, //...other attributes}
      email: userInfo.email,
      image: userInfo.image,
      uid: userInfo.uid,
    };
    jwt.sign(
      payload,
      process.env.SECRET_KEY!,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("The token was not generated");
        } else resolve(token);
      }
    );
  });
};

/**
 * Verify is token received is valid
 * @returns IUserResponse object or null
 */
export const verifyJWT = async (token: string) => {
  try {
    if (token.trim().length < 10) {
      return null;
    }

    const { uid } = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload;
    const user = await User.findById(uid);

    if (user && user.status) return user.toJSON();
    else return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default generateJWT;
