import request from "supertest";
import mongoose from "mongoose";

import Server from "../models/server";
import User from "../models/user";
import Message, { MESSAGE_STATUS } from "../models/message";

import {
  EMAIL,
  ID,
  IMAGE_DIR,
  mockFindById,
  USERNAME,
} from "../models/__mocks__/user";

import {
  mockFindOneAndSortMessage,
  mockCreateMessage,
  RECEPTOR_ID,
  MOCKED_TEXT,
  mockFindMessageById,
  mockFindMessageByIdAndUpdate,
  ID as messageId,
  EMITTER_ID,
  mockFindMessages,
  mockedMessage,
} from "../models/__mocks__/message";
import generateJWT from "../helpers/generate-jwt";
import { IMessageCreateRequest } from "../typings/request";

const server = new Server();

/**
 * Expects of every "token no present" test
 * @param res
 */
const unauthorizedExpects = (res: request.Response) => {
  expect(res.statusCode).toBe(401);
  expect(res.body).toHaveProperty("error");
  expect(JSON.stringify(res.body)).toMatch(/\bUnauthorized\b/);
};

/**
 * Expects of every "token no present" test
 * @param res
 */
const invalidRequestExpects = (res: request.Response, regex: RegExp) => {
  expect(res.statusCode).toBe(400);
  expect(res.body).toHaveProperty("error");
  expect(res.body.error).toHaveProperty("message");
  expect(JSON.stringify(res.body)).toMatch(regex);
};

/**
 * Expects to create/update messages
 * @param res
 */
const successfullRequestExpects = (res: request.Response) => {
  expect(res.body).toHaveProperty("message");
  expect(res.body).toHaveProperty("success");
  expect(res.body.message).toHaveProperty("emitterId");
  expect(res.body.message).toHaveProperty("receptorId");
  expect(res.body.message).toHaveProperty("message");
  expect(res.body.message).toHaveProperty("_id");
  expect(res.body.message.receptorId).toBe(RECEPTOR_ID);
  expect(res.body.message.message).toHaveProperty("text");
  expect(res.body.message.message.text).toBe(MOCKED_TEXT);
};

let token = "";

const newMessage: IMessageCreateRequest = {
  receptorId: RECEPTOR_ID,
  text: MOCKED_TEXT,
};

beforeAll(async () => {
  // Mocking the User.findById function
  jest
    .spyOn(User, "findById")
    .mockImplementation((id: string) => mockFindById(id));

  // Mocking the Message.create function
  jest
    .spyOn(Message, "create")
    .mockImplementation((obj: any) => mockCreateMessage(obj));

  // Mocking the Message.findById function
  jest
    .spyOn(Message, "findById")
    .mockImplementation((id: string) => mockFindMessageById(id));

  // Mocking the Message.findByIdAndUpdate function
  jest
    .spyOn(Message, "findByIdAndUpdate")
    .mockImplementation((id: string, obj: any) =>
      mockFindMessageByIdAndUpdate(id, obj)
    );

  // Mocking the Message.findByIdAndUpdate function
  jest
    .spyOn(Message, "find")
    .mockImplementation((obj: any) => mockFindMessages(obj));

  //Generating a token
  const payload = {
    userName: USERNAME, //...other attributes}
    email: EMAIL,
    image: IMAGE_DIR,
    uid: EMITTER_ID,
  };

  token = (await generateJWT(payload)) as string;
});

beforeEach(() => {
  mockFindById.mockClear();
  mockFindOneAndSortMessage.mockClear();
  mockCreateMessage.mockClear();
  mockFindMessageById.mockClear();
  mockFindMessageByIdAndUpdate.mockClear();
  mockFindMessages.mockClear();
});

/**
 * Test for auth endpoint
 */
describe("Endpoint /api/messenger/messages/", () => {
  describe("Endpoint /api/messenger/messages/send", () => {
    it("Should successfully create the message", async () => {
      const res = await request(server.app)
        .post("/api/messenger/messages/send")
        .send(newMessage)
        .set("Cookie", [`authToken=${token}`]);

      expect(res.statusCode).toBe(201);
      /**
       * is called twice, when the token is verified and
       * when doing the verification that the receptor id
       * a valid id
       */
      expect(mockFindById).toHaveBeenCalledTimes(2);
      expect(mockCreateMessage).toHaveBeenCalledTimes(1);
      successfullRequestExpects(res);
      /**
       * The user find returns the mocked user and user.id
       * is used as emitter
       */
      expect(res.body.message.emitterId).toBe(ID);
    });

    it("Should not create the message if the token is not present", async () => {
      const res = await request(server.app)
        .post("/api/messenger/messages/send")
        .send(newMessage);
      // .set("Cookie", [`authToken=${token}`]);

      unauthorizedExpects(res);
    });

    it("Should not create the message if there is neither images or text", async () => {
      const res = await request(server.app)
        .post("/api/messenger/messages/send")
        .send({})
        .set("Cookie", [`authToken=${token}`]);

      invalidRequestExpects(
        res,
        /\bYou must send a text or maximum 4 images\b/
      );
    });
  });

  describe("Endpoint /api/messenger/messages/update/:id", () => {
    const newStatus = MESSAGE_STATUS.DELIVERED;
    it("Should successfully update the message", async () => {
      const res = await request(server.app)
        .put(`/api/messenger/messages/update/${messageId}`)
        .send({
          status: newStatus,
        })
        .set("Cookie", [`authToken=${token}`]);

      expect(res.statusCode).toBe(200);

      expect(mockFindById).toHaveBeenCalledTimes(1);
      expect(mockFindMessageById).toHaveBeenCalledTimes(1);
      expect(mockFindMessageByIdAndUpdate).toHaveBeenCalledTimes(1);

      successfullRequestExpects(res);
      expect(res.body.message.status).toBe(newStatus);
      expect(res.body.message.emitterId).toBe(EMITTER_ID);
    });

    it("Should not update the message if the token is not present", async () => {
      const res = await request(server.app)
        .post("/api/messenger/messages/send")
        .send({
          status: newStatus,
        });
      // .set("Cookie", [`authToken=${token}`]);

      unauthorizedExpects(res);
    });

    it("Should not update the message if the new status was not send", async () => {
      const res = await request(server.app)
        .put(`/api/messenger/messages/update/${messageId}`)
        .send({})
        .set("Cookie", [`authToken=${token}`]);

      invalidRequestExpects(res, /\bInvalid status\b/);
    });

    it("Should not update the message if the new status is neither 'delivered' nor 'seen'", async () => {
      const res = await request(server.app)
        .put(`/api/messenger/messages/update/${messageId}`)
        .send({
          status: MESSAGE_STATUS.SENT,
        })
        .set("Cookie", [`authToken=${token}`]);

      invalidRequestExpects(res, /\bInvalid status\b/);
    });
  });

  describe("Endpoint /api/messenger/messages/get/:id", () => {
    it("Should successfully get the messages", async () => {
      const res = await request(server.app)
        .get(`/api/messenger/messages/get/${RECEPTOR_ID}`)
        .set("Cookie", [`authToken=${token}`]);

      expect(res.statusCode).toBe(200);

      /**
       * Called twice, when verifying the token
       * and when verifying that the :id is valid
       */
      expect(mockFindById).toHaveBeenCalledTimes(2);
      expect(mockFindMessages).toHaveBeenCalledTimes(1);

      expect(res.body).toHaveProperty("messages");
      expect(res.body).toHaveProperty("success");
      expect(res.body.messages).toHaveLength(1);
      expect(res.body.messages[0]).toEqual(mockedMessage);
    });

    it("Should not get the messages if the token is not present", async () => {
      const res = await request(server.app).get(
        `/api/messenger/messages/get/${RECEPTOR_ID}`
      );
      // .set("Cookie", [`authToken=${token}`]);

      unauthorizedExpects(res);
    });
  });
});

afterAll(async () => {
  // The app opens the connection so this closes it.
  await mongoose.disconnect();
  server.close();
});
