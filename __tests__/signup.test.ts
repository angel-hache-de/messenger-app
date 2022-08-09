import request from "supertest";
import mongoose from "mongoose";
import path from "path";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import Server from "../models/server";
import { ISignUpRequest } from "../typings/request";
import {
  EMAIL,
  EMAILNOTREGISTERED,
  ID,
  IMAGE_DIR,
  PASSWORD,
  USERNAME,
} from "../models/__mocks__/user";

import User from "../models/user";
import { mockFindOne, mockSave } from "../models/__mocks__/user";
import { IJwtPayload } from "../helpers/generate-jwt";
import uploadFileHelper, { uploadFilesHelper } from "../helpers/upload-file";
// import mockedUser, {mockSave} from "../models/__mocks__/user";

const server = new Server();

const signUpData: ISignUpRequest = {
  email: EMAILNOTREGISTERED,
  password: PASSWORD,
  passwordConf: PASSWORD,
  userName: USERNAME,
};

export const invalidAuthRequestExpecs = (
  res: request.Response,
  errorMessage: RegExp
) => {
  expect(res.statusCode).toBe(400);
  expect(res.headers["set-cookie"]).not.toBeDefined();
  expect(res.body).toHaveProperty("errors");
  expect(JSON.stringify(res.body)).toMatch(errorMessage);
};

// Mocking the upload-file function
jest.mock("../helpers/upload-file", () => {
  const originalModule = jest.requireActual("../helpers/upload-file");

  //Mock the default export and named export 'uploadFilesHelper'
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(async () => IMAGE_DIR),
    // uploadFilesHelper: jest.fn(async () => {
    //   console.log("====================================");
    //   console.log("Mocking the uploadFilesHelper function");
    //   console.log("====================================");
    //   return "./image.jpg";
    // }),
  };
});

beforeAll(() => {
  // Mocking the findOne function
  jest
    .spyOn(User, "findOne")
    .mockImplementation((obj: any) => mockFindOne(obj.email));

  // Mocking the create function
  jest.spyOn(User, "create").mockImplementation((obj: any) => mockSave(obj));
});

beforeEach(() => {
  // User.mockClear();
  mockFindOne.mockClear();
  mockSave.mockClear();
  signUpData.email = EMAIL;
  signUpData.password = PASSWORD;
  signUpData.passwordConf = PASSWORD;
  signUpData.userName = USERNAME;
});

/**
 * Test for auth endpoint
 */
describe("Signup tests", () => {
  describe("Successfully Signup", () => {
    /**
     * The signup function return the token in the body
     * and in the cookies
     */
    it("Should do a successfully SignUp", async () => {
      // Sending the request attaching the image
      const img = path.resolve(__dirname, "fondo.jpg");
      const res = await request(server.app)
        .post("/api/messenger/users/signup")
        .field("email", EMAILNOTREGISTERED)
        .field("password", PASSWORD)
        .field("passwordConf", PASSWORD)
        .field("userName", USERNAME)
        .attach("file", img);

      expect(res.statusCode).toBe(201);
      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(uploadFileHelper).toHaveBeenCalled();
      expect(res.headers["set-cookie"][0]).toBeDefined();
      // Verify that the token has been generated.
      expect(res.headers["set-cookie"][0]).toMatch(/^authToken=\S+/);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("successMessage");

      // verify that the token has the correct payload
      const payload = jwt.decode(res.body.token) as IJwtPayload;

      expect(payload.userName).toBe(USERNAME);
      expect(payload.email).toBe(EMAILNOTREGISTERED);
      expect(payload.uid).toBe(ID);
      expect(payload.image).toBe(IMAGE_DIR);
    });
  });

  describe("Validations", () => {
    it("Shouldn't signup with an email already registered", async () => {
      // Sending the request attaching the image
      const img = path.resolve(__dirname, "fondo.jpg");
      const res = await request(server.app)
        .post("/api/messenger/users/signup")
        .field("email", EMAIL)
        .field("password", PASSWORD)
        .field("passwordConf", PASSWORD)
        .field("userName", USERNAME)
        .attach("file", img);

      invalidAuthRequestExpecs(res, /\bis already registered\b/);
      expect(mockFindOne).toHaveBeenCalledTimes(1);
    });

    it("Shouldn't singup with an invalid password or invalid email", async () => {
      // Sending the request attaching the image
      const img = path.resolve(__dirname, "fondo.jpg");
      const res = await request(server.app)
        .post("/api/messenger/users/signup")
        .field("email", "ab")
        .field("password", "a")
        .field("passwordConf", "a")
        .field("userName", USERNAME)
        .attach("file", img);

      invalidAuthRequestExpecs(res, /\bInvalid email\b/);
      expect(JSON.stringify(res.body)).toMatch(/\bPassword min length is 6\b/);
      expect(mockFindOne).toHaveBeenCalledTimes(1);
    });

    it("Shouldn't singup if the image is not present", async () => {
      // Sending the request attaching the image
      const img = path.resolve(__dirname, "fondo.jpg");
      const res = await request(server.app)
        .post("/api/messenger/users/signup")
        .field("email", EMAILNOTREGISTERED)
        .field("password", PASSWORD)
        .field("passwordConf", PASSWORD)
        .field("userName", USERNAME);
      // .attach("file", img);

      // console.log(res.body);

      invalidAuthRequestExpecs(res, /\bimage is required\b/i);
      expect(mockFindOne).toHaveBeenCalledTimes(1);
    });

    it("Should not signup if the userName is not present", async () => {
      // Sending the request attaching the image
      const img = path.resolve(__dirname, "fondo.jpg");
      const res = await request(server.app)
        .post("/api/messenger/users/signup")
        .field("email", EMAILNOTREGISTERED)
        .field("password", PASSWORD)
        .field("passwordConf", PASSWORD)
        // .field("userName", USERNAME)
        .attach("file", img);

      invalidAuthRequestExpecs(res, /\bUsername is required\b/i);
      expect(mockFindOne).toHaveBeenCalledTimes(1);
    });
  });
});

afterAll(async () => {
  // The app opens the connection so this closes it.
  await mongoose.disconnect();
  server.close();
});
