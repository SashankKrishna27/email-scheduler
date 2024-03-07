import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import db from "../db";
import os from "os";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
require("dotenv").config();

const start = async () => {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "50mb" }));

  await db();

  app.use("/", routes);

  app.use((_req, _res) => {
    return _res.status(404).json({ message: "Route Not Found" });
  });

  app.use(errorHandler);

  const server = app.listen(process.env.PORT, () => {
    console.log("Server started at http://localhost:" + process.env.PORT);
  });

  process.on("SIGTERM", () => {
    console.info("SIGTERM signal received.");
    console.log("Closing http server.");
    server.close(() => {
      console.log("Http server closed.");
      // boolean means [force], see in mongoose doc
      mongoose.disconnect().then(() => {
        console.log("MongoDb connection closed.");
        process.exit(0);
      });
    });
  });
};

if (process.env.NODE_ENV === "production") {
  const throng = require("throng");
  throng({
    master: () => {}, // Fn to call in master process (can be async)
    worker: start, // Fn to call in cluster workers (can be async)
    count: os.cpus().length, // Number of workers
    lifetime: Infinity, // Min time to keep cluster alive (ms)
    grace: 5000, // Grace period between signal and hard shutdown (ms)
    signals: ["SIGTERM", "SIGINT"], // Signals that trigger a shutdown (proxied to workers)
  }).then(() => {
    console.log("Worker started at " + process.pid);
  });
} else {
  start();
}
