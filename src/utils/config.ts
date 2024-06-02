import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGO_URI;

export default {
  PORT,
  MONGO_URI,
};
