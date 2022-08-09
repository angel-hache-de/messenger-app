import User from "../models/user";
import Message from "../models/message";

export const emailExists = async (email: string) => {
  const existsEmail = await User.findOne({ email });
  if (existsEmail) throw new Error(`Email ${email} is already registered`);
};

export const userExists = async (id: string) => {
  const userExists = await User.findById(id);
  if (!userExists) throw new Error(`User ${id} is unknown`);
};

export const messageExists = async (id: string) => {
  const messageExists = await Message.findById(id);
  if (!messageExists) throw new Error(`Message ${id} does not exists`);
};
