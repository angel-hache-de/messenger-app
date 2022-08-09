import { model, Schema } from "mongoose";
import { IUserResponse } from "../typings/response";

export interface IUser {
  userName: string;
  email: string;
  image: string;
}

interface IUserModel extends IUser {
  password: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserModel>(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Tiene que ser una funcion normal
UserSchema.methods.toJSON = function (): IUserResponse {
  const { __v, password, _id, status, updatedAt, createdAt, ...user } =
    this.toObject();
  user.uid = _id;
  return user as IUserResponse;
};

export default model<IUserModel>("User", UserSchema);
