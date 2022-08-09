import dotenv from "dotenv";
dotenv.config();

import Server from "./models/server";

// COnfigura dotenv

const server = new Server();

server.listen();

/**
 * Stops the mongodb memory server, used for e2e tests,
 * when the app is exited
 */
if (process.env.NODE_ENV === "test") {
  if (process.platform === "win32") {
    var rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on("SIGINT", function () {
      process.emit("SIGINT");
    });
  }

  process.on("SIGINT", async function () {
    //graceful shutdown
    await server.disconnectDB();
    process.exit();
  });
}
