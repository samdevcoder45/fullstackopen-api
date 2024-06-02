import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URIS;

export default {
  PORT,
  MONGO_URI,
};
