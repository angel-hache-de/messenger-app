import request from "supertest";
import mongoose from "mongoose";

import Server from "../models/server";
import User from "../models/user";
import Message from "../models/message";

import {
  EMAIL,
  ID,
  IMAGE_DIR,
  mockFind,
  mockFindById,
  USERNAME,
} from "../models/__mocks__/user";

import {
  MESSAGE,
  mockFindOneAndSortMessage,
} from "../models/__mocks__/message";
import generateJWT from "../helpers/generate-jwt";

const server = new Server();

let token = "";

beforeAll(async () => {
  // Mocking the User.find function
  jest.spyOn(User, "find").mockImplementation((obj: any) => mockFind(obj));

  // Mocking the Message.findOne function
  jest
    .spyOn(Message, "findOne")
    .mockImplementation((obj: any) => mockFindOneAndSortMessage(obj));

  // Mocking the User.findById function
  jest
    .spyOn(User, "findById")
    .mockImplementation((id: string) => mockFindById(id));

  //Generating a token
  const payload = {
    userName: USERNAME, //...other attributes}
    email: EMAIL,
    image: IMAGE_DIR,
    uid: ID,
  };

  token = (await generateJWT(payload)) as string;
});

beforeEach(() => {
  mockFind.mockClear();
  mockFindOneAndSortMessage.mockClear();
  mockFindById.mockClear();
});

/**
 * Test for auth endpoint
 */
describe("Endpoint /api/messenger/friends/", () => {
  it("Should return an array with the mocked user", async () => {
    const res = await request(server.app)
      .get("/api/messenger/friends/")
      .set("Cookie", [`authToken=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(mockFindById).toHaveBeenCalledTimes(1);
    expect(mockFindOneAndSortMessage).toHaveBeenCalledTimes(1);

    expect(res.body).toHaveProperty("friends");
    expect(res.body.friends[0]).toBeDefined();
    expect(res.body.friends[0].email).toBe(EMAIL);
    expect(res.body.friends[0].uid).toBe(ID);
    expect(res.body.friends[0]).toHaveProperty("lastMessage");
    expect(res.body.friends[0].lastMessage).toHaveProperty("message");
    expect(res.body.friends[0].lastMessage.message).toEqual(MESSAGE);
  });

  it("Should not return the users array if the token is not present", async () => {
    const res = await request(server.app).get("/api/messenger/friends/");
    // .set("Cookie", [`authToken=${token}`]);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
    expect(JSON.stringify(res.body)).toMatch(/\bUnauthorized\b/);
  });
});

afterAll(async () => {
  // The app opens the connection so this closes it.
  await mongoose.disconnect();
  server.close();
});
