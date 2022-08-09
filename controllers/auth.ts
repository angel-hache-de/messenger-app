import { CookieOptions, Request, Response } from "express";
import bcryptjs from "bcrypt";

import User from "../models/user";
import generateJWT, { IJwtPayload } from "../helpers/generate-jwt";
import { IResponseAuth } from "../typings/response";
import { ISignUpRequest } from "../typings/request";
import { uploadFiles } from "../helpers/upload-files-cloudinary";

const options: CookieOptions = {
  expires: new Date(
    Date.now() + parseInt(process.env.COOKIE_EXP!) * 24 * 60 * 60 * 1000
  ),
};

export const signupController = async (req: Request, res: Response) => {
  const { userName, email, password, passwordConf } =
    req.body as ISignUpRequest;

  if (password !== passwordConf)
    return res.status(400).json({
      errors: [
        {
          msg: "Passwords does not match",
        },
      ],
    });

  try {
    const image = (await uploadFiles(req.files!.file))[0];
    
    // Encrypt password
    // "Giros de encriptacion". Entre mas alto el numero mas seguro,
    // pero mas tardado. 10 es el defecto
    const salt = bcryptjs.genSaltSync();
    const encriptedPassword = bcryptjs.hashSync(password, salt);

    // Creates the document and saves it on DB
    // this way is used to mock the function on tests
    const user = await User.create({
      userName,
      email,
      password: encriptedPassword,
      image,
    });

    /**
     * This imp could not be mocked due the middleware
     * to avoid duplicated emails
     *
     */
    // const user = new User({
    //   userName,
    //   email,
    //   password: encriptedPassword,
    //   image,
    // });

    // Save on DB
    // await user.save();

    // generate the jwt with the user info
    // const { status, createdAt, updatedAt, ...userInfo } = user.toJSON();

    // generate the jwt
    const token = await generateJWT({
      email: user.email,
      image: user.image,
      userName: user.userName,
      uid: user._id.toString(),
    } as IJwtPayload);

    const respToSend: IResponseAuth = {
      successMessage: "Account Created!",
      token: token as string,
    };

    res.status(201).cookie("authToken", token, options).json(respToSend);
  } catch (error: any) {
    console.log(error);

    // If the file(s) are not images
    const regexInvalidExtension = /\bCheck your files\b/;

    if (regexInvalidExtension.test(error.message))
      return res.status(400).json({
        errors: [
          {
            msg: error.message,
          },
        ],
      });

    res.status(500).json({
      errors: [
        {
          msg: "Internal Server Error",
        },
      ],
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // verify if email exists
    const user = await User.findOne({ email });

    // Verify if the user is active
    if (!user || !user.status)
      return res.status(400).json({
        errors: [
          {
            msg: "Invalid credentials",
          },
        ],
      });

    const { createdAt, updatedAt, status } = user;

    // Verify the password
    const passwordIsValid = bcryptjs.compareSync(password, user.password);
    if (!passwordIsValid)
      return res.status(400).json({
        errors: [
          {
            msg: "Invalid credentials",
          },
        ],
      });

    // generate the jwt
    const token = await generateJWT({
      email: user.email,
      image: user.image,
      userName: user.userName,
      uid: user._id.toString(),
    } as IJwtPayload);

    res.cookie("authToken", token, options).json({
      token,
      successMessage: "Welcome back!",
    } as IResponseAuth);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: [
        {
          msg: "Something went wrong",
        },
      ],
    });
  }
};

/**
 * Controller to clear the token from the cookies
 * @param req
 * @param res
 */
export const logoutController = (req: Request, res: Response) => {
  res.cookie("authToken", "").json({
    success: true,
  });
};
