import dotenv from "dotenv";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { createServer, Server } from "http";
import { Server as ServerIo } from "socket.io";
import cors from "cors";
import path from "path";

import databaseConnection, { dbDisconnection } from "../config/database";
import fileUpload from "express-fileupload";

import authRoutes from "../routes/auth";
import friendsRoutes from "../routes/friends";
import messagesRoutes from "../routes/messages";
import socketController from "../controllers/sockets";
import socketJWTMiddleware from "../middlewares/socket-auth";
import { ClientToServerEvents, ServerToClientEvents } from "../typings/socket";
import User from "./user";

if (process.env.NODE_ENV === "test") {
  dotenv.config();
}

class MyServer {
  private _app: Application;
  private port: string;
  private io: ServerIo;
  private server: Server;

  private apiPaths = {
    auth: "/api/messenger/users",
    friends: "/api/messenger/friends",
    messages: "/api/messenger/messages",
  };

  constructor() {
    this._app = express();
    this.port = process.env.PORT || "5000";
    this.server = createServer(this._app);
    this.io = new ServerIo<ClientToServerEvents, ServerToClientEvents>(
      this.server,
      {
        cors: {
          origin: "*",
          methods: ["GET, POST"],
        },
      }
    );

    this.connectDB();

    this.middlewares();

    this.routes();

    // sockets
    this.sockets();
  }

  get app() {
    return this._app;
  }

  sockets() {
    this.io.on("connection", (socket) => socketController(socket, this.io));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("Server running on port:", this.port);
    });
  }

  async connectDB() {
    await databaseConnection();

    /**
     * User used to e2e tests
     */
    if (process.env.NODE_ENV === "test") {
      const testUser = new User({
        userName: "angel",
        email: "angel@de.es",
        password:
          "$2b$10$Vdh5mbW3OA1qibeOTYEXTuADyHK5VVx6YJoVLGIeookTxypdDNAUO",
        image: "fondo.jpg",
      });

      const testUser2 = new User({
        userName: "diana",
        email: "diana@de.es",
        password:
          "$2b$10$Vdh5mbW3OA1qibeOTYEXTuADyHK5VVx6YJoVLGIeookTxypdDNAUO",
        image: "fondo.jpg",
      });

      await testUser.save();
      await testUser2.save();
    }
  }

  async disconnectDB() {
    await dbDisconnection();
  }

  routes() {
    this._app.use(this.apiPaths.auth, authRoutes);
    this._app.use(this.apiPaths.friends, friendsRoutes);
    this._app.use(this.apiPaths.messages, messagesRoutes);

    // console.log(path.resolve(path.resolve(), "frontend", "build", "index.html"));
    if (process.env.NODE_ENV === "production") {
      this._app.use(
        express.static(path.join(path.join(path.resolve(), "/frontend/build")))
      );

      this._app.get("*", (req, res) => {
        res.sendFile(
          path.resolve(path.resolve(), "frontend", "build", "index.html")
        );
      });
    }
  }

  middlewares() {
    // CORS
    this._app.use(cors());

    this._app.use(express.json());

    // cookies parser
    this._app.use(cookieParser());

    // public directory
    // this._app.use("/images/users", express.static("../uploads/users"));
    this._app.use(express.static("dist/uploads"));

    // Fileupload
    this._app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );

    // JWT middleware to validate sockets reqs
    this.io.use(socketJWTMiddleware);
  }

  close() {
    this.server.close();
  }
}

export default MyServer;
