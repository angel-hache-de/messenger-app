import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer | null = null;

const databaseConnection = async () => {
  try {
    let dbUrl = process.env.DATABASE_URL!;
    if (process.env.NODE_ENV === "test") {
      mongod = await MongoMemoryServer.create();
      dbUrl = mongod.getUri();
      console.log("mocking the mongodb...");
    }

    await mongoose.connect(dbUrl);
    // console.log("MongoDb connected");
  } catch (error) {
    console.log(error);
    throw new Error("Error while connecting to db");
  }
};

export const dbDisconnection = async () => {
  try {
    await mongoose.connection.close();

    if (!!mongod) await mongod.stop();

    console.log("mondodb closed ");
  } catch (error) {
    console.log(error);
  }
};

export default databaseConnection;
