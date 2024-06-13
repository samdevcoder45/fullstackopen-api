import config from "./utils/config";
import express from "express";
import "express-async-errors";
const app = express();
import cors from "cors";
import notesRouter from "./controllers/notes";
import usersRouter from "./controllers/users";
import middleware from "./utils/middleware";
import logger from "./utils/logger";
import mongoose from "mongoose";
import loginRouter from "./controllers/login";

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGO_URI!);
mongoose
  .connect(config.MONGO_URI!)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/notes", notesRouter);
app.use("/api/users",usersRouter)
app.use("/api/login",loginRouter)

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
