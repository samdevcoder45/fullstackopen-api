import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Note from "../models/note";
import User from "../models/user";
const notesRouter = express.Router();
interface JwtPayload {
  id: string;
}
notesRouter.get("/", async (req: Request, res: Response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  res.json(notes);
});

notesRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const note = await Note.findById(req.params.id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).end();
    }
  }
);

const getTokenFrom = (req: Request) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }

  return null;
};

notesRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const decodedToken = jwt.verify(
      getTokenFrom(req)!,
      process.env.SECRET!
    ) as JwtPayload;
    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const note = new Note({
      content: body.content,
      important: body.important === undefined ? false : body.important,
      user: user._id,
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    res.status(201).json(savedNote);
  }
);

notesRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    await Note.findByIdAndDelete(req.params.id);
    res.status(204).end();
  }
);

notesRouter.put("/:id", async (req: Request, res: Response, next) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
  });

  res.json(updatedNote);
});

export default notesRouter;
