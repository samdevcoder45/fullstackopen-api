import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
const usersRouter = express.Router();
import User from "../models/user";

usersRouter.post("/", async (req: Request, res: Response) => {
  const { username, name, password } = req.body;

  const saltRounds = process.env.SALT_ROUNDS!;
  const passwordHash = await bcrypt.hash(password, Number(saltRounds));

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

usersRouter.get("/", async (req: Request, res: Response) => {
  const users = await User.find({}).populate("notes",{content:1,important:1});
  res.json(users);
});

export default usersRouter;
