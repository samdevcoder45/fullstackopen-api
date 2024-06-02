import express, { NextFunction, Request, Response } from "express";
import Note from "../models/note";
const notesRouter = express.Router();

notesRouter.get("/", async (req: Request, res: Response) => {
  const notes = await Note.find({});
  res.json(notes);
});

notesRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const note = await Note.findById(req.params.id);
    try {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    } catch (error) {
      next(error);
    }
  }
);

notesRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    const note = new Note({
      content: body.content,
      important: body.important || false,
    });

    try {
      const savedNote = await note.save();
      res.status(201).json(savedNote);
    } catch (error) {
      next(error);
    }
  }
);

notesRouter.delete(
  "/:id",
  async(req: Request, res: Response, next: NextFunction) => {
   await  Note.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch((error) => next(error));
  }
);

notesRouter.put("/:id", (req: Request, res: Response, next) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

export default notesRouter;
