import express, { NextFunction, Request, Response } from "express";
import Note from "../models/note";
const notesRouter = express.Router();

notesRouter.get("/", (req: Request, res: Response) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

notesRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

notesRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((error) => next(error));
});

notesRouter.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    Note.findByIdAndDelete(req.params.id)
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
