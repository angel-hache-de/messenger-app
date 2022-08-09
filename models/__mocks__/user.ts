import { ISignUpRequest } from "../../typings/request";
import { Types } from "mongoose";
/**
 * Example of mock a ES6 class
 */

/**
 * Fake data
 */
export const EMAIL = "angel@de.es";
export const EMAILNOTREGISTERED = "angel@new.es";
export const PASSWORD = "podemos";
export const USERNAME = "Angel";
export const ID = new Types.ObjectId().toString();
export const IMAGE_DIR = "./image.jpg";

export const mockedUser = {
  password: PASSWORD,
  status: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: EMAIL,
  _id: ID,
};

export const mockSave = jest.fn((obj: ISignUpRequest) => ({
  ...obj,
  _id: ID,
}));

export const mockFindOne = jest.fn((email: string): any => {
  // console.log("EMAIL", email);
  return email === EMAIL ? mockedUser : null;
});

export const mockFind = jest.fn((obj: any): any => [mockedUser]);

export const mockFindById = jest.fn(
  (id: string | Types.ObjectId): any => mockedUser
);

/**
 * Constructor function
 */
const mock = jest
  .fn()
  .mockImplementation(
    (userName: string, email: string, password: string, image: string) => {
      return {
        save: mockSave,
        userName,
        email,
        password,
        image,
        _id: ID,
        findOne: mockFindOne,
      };
    }
  );

export default mock;
