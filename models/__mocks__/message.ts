import { Types } from "mongoose";
import { MESSAGE_STATUS } from "../message";

// Mocked message
export const EMITTER_ID = new Types.ObjectId().toString();
export const RECEPTOR_ID = new Types.ObjectId().toString();
export const MOCKED_TEXT = "Mocked message";
export const MESSAGE = {
  text: MOCKED_TEXT,
  images: [],
};
export const STATUS = MESSAGE_STATUS.SEEN;
export const ID = new Types.ObjectId().toString();

export const mockedMessage = {
  emitterId: EMITTER_ID,
  receptorId: RECEPTOR_ID,
  message: MESSAGE,
  status: STATUS,
  _id: ID,
};

/**
 * Mocks the Message.find method
 */
export const mockFindMessages = jest.fn((obj: any): any => [mockedMessage]);

/**
 * This method is used when getting the last message
 * between 2 users
 */
export const mockFindOneAndSortMessage = jest.fn((obj: any): any => ({
  sort: () => mockedMessage,
}));

/**
 * Mocks the findById method from Message model
 */
export const mockFindMessageById = jest.fn((id: string): any =>
  id === ID ? mockedMessage : null
);

/**
 * Mocks the findByIdAndUpdate method from Message model
 */
export const mockFindMessageByIdAndUpdate = jest.fn(
  (id: string, obj: any): any => ({
    ...mockedMessage,
    status: obj.status,
  })
);

/**
 * Mocks the create document and save to db
 */
export const mockCreateMessage = jest.fn((obj: any): any => ({
  ...obj,
  _id: ID,
}));
