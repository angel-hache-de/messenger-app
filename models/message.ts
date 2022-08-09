import { model, Schema, Types } from "mongoose";
import { IMessageResponse } from "../typings/response";

export interface IMessage {
  emitterId: Types.ObjectId;
  receptorId: Types.ObjectId;
  message: {
    text: string;
    images?: File[];
  };
  status: MESSAGE_STATUS;
  createdAt: Date;
  updatedAt: Date;
}

// Possibles Status of the message
export enum MESSAGE_STATUS {
  SEEN = "seen",
  DELIVERED = "delivered",
  SENT = "sent",
}

const MessageSchema = new Schema<IMessage>(
  {
    emitterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receptorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      text: {
        type: String,
        default: "",
      },
      images: {
        type: [String],
        default: [],
      },
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: MESSAGE_STATUS.SENT,
      required: true,
    },
  },
  { timestamps: true }
);

// Tiene que ser una funcion normal
MessageSchema.methods.toJSON = function (): IMessageResponse {
  const { __v, _id, updatedAt, ...message } = this.toObject();

  message.id = _id;

  return message as IMessageResponse;
};

export default model<IMessage>("Message", MessageSchema);
