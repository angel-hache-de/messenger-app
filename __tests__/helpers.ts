import { Application } from "express";
import request from "supertest";

export const sendSimplePostRequest = async (
  uri: string,
  app: Application,
  body: string | object | undefined
) => {
  const res = await request(app).post(uri).send(body);
  return res;
};
