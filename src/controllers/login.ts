import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
const loginRouter = express.Router();
import User from "../models/user";

loginRouter.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash!);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "invalid username or password" });
  }

  const userToken = {
    username: user.username,
    id: user._id,
  };

  //token expires in 60 * 60 seconds, that is , in one hour
  const token = jwt.sign(userToken, process.env.SECRET!, {
    expiresIn: 60 * 60,
  });

  res.status(200).send({ token, username: user.username, name: user.name });
});

export default loginRouter;
