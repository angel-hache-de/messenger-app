import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import Server from "../models/server";
import { ILoginRequest } from "../typings/request";
import User from "../models/user";
import { sendSimplePostRequest } from "./helpers";
import { EMAIL, EMAILNOTREGISTERED, PASSWORD } from "../models/__mocks__/user";
import { mockFindOne } from "../models/__mocks__/user";

const server = new Server();

const loginData: ILoginRequest = {
  email: EMAIL,
  password: PASSWORD,
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

// Mock function to mock the bcrypt.compareSync method
const mockCompareSync = jest.fn(
  (string1: Buffer | string, encripted: string) => string1 === encripted
);

beforeAll(() => {
  // Mocking the findOne function
  jest
    .spyOn(User, "findOne")
    .mockImplementation((obj: any) => mockFindOne(obj.email));

  // Mocking the bcrypt.compareSync function
  jest
    .spyOn(bcrypt, "compareSync")
    .mockImplementation((string1: string | Buffer, encripted: string) =>
      mockCompareSync(string1, encripted)
    );
});

beforeEach(() => {
  mockFindOne.mockClear();
  mockCompareSync.mockClear();
  loginData.email = EMAIL;
  loginData.password = PASSWORD;
});

/**
 * Test for auth endpoint
 */
describe("Login tests", () => {
  describe("Successfully Login", () => {
    /**
     * The login function return the token in the body
     * and in the cookies
     */
    it("Should do a successfully login", async () => {
      const res = await sendSimplePostRequest(
        "/api/messenger/users/login",
        server.app,
        loginData
      );

      expect(res.statusCode).toBe(200);
      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockCompareSync).toHaveBeenCalledTimes(1);
      expect(res.headers["set-cookie"][0]).toBeDefined();
      // Verify that the token has been generated.
      expect(res.headers["set-cookie"][0]).toMatch(/^authToken=\S+/);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("successMessage");
    });
  });

  describe("Password validations", () => {
    it("Shouldn't login with an incorrect password", async () => {
      loginData.password = "asblkfdsanfd";

      const res = await sendSimplePostRequest(
        "/api/messenger/users/login",
        server.app,
        loginData
      );

      invalidAuthRequestExpecs(res, /\bInvalid credentials\b/);
      expect(mockFindOne).toHaveBeenCalledTimes(1);
    });

    it("Shouldn't login with a password shorter than 6 characters", async () => {
      loginData.password = "abc";

      const res = await sendSimplePostRequest(
        "/api/messenger/users/login",
        server.app,
        loginData
      );

      invalidAuthRequestExpecs(res, /\bPassword min length is 6\b/);
    });

    it("Shouldn't login if the password is not present", async () => {
      const loginData = {
        email: EMAIL,
      };

      const res = await sendSimplePostRequest(
        "/api/messenger/users/login",
        server.app,
        loginData
      );

      invalidAuthRequestExpecs(res, /\bPassword min length is 6\b/);
    });
  });

  describe("Email validations", () => {
    it("Shouldn't login with an invalid email", async () => {
      loginData.email = "asfasdflas";

      const res = await sendSimplePostRequest(
        "/api/messenger/users/login",
        server.app,
        loginData
      );

      invalidAuthRequestExpecs(res, /\bInvalid email\b/);
    });

    it("Shouldn't login with an email that is not registered", async () => {
      loginData.email = EMAILNOTREGISTERED;

      const res = await sendSimplePostRequest(
        "/api/messenger/users/login",
        server.app,
        loginData
      );

      invalidAuthRequestExpecs(res, /\bInvalid credentials\b/);
      expect(mockFindOne).toHaveBeenCalledTimes(1);
    });

    it("Should not login if the email is not present", async () => {
      const loginData = {
        password: PASSWORD,
      };

      const res = await sendSimplePostRequest(
        "/api/messenger/users/login",
        server.app,
        loginData
      );

      invalidAuthRequestExpecs(res, /\bInvalid email\b/);
    });
  });
});

afterAll(async () => {
  // The app opens the connection so this closes it.
  await mongoose.disconnect();
  server.close();
});
