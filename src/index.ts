import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
const app = express();
import Note from "./models/note";
import cors from "cors";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log("Method:", req.method);
  console.log("Path: ", req.path);
  console.log("Body: ", req.body);
  console.log("---");
  next();
};

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};
const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(requestLogger);

app.get("/api/notes", (req: Request, res: Response) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get("/api/notes/:id", (req: Request, res: Response, next: NextFunction) => {
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

app.post("/api/notes", (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }

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

app.put("/api/notes/:id", (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.delete(
  "/api/notes/:id",
  (req: Request, res: Response, next: NextFunction) => {
    Note.findByIdAndDelete(req.params.id)
      .then((result) => {
        res.status(204).end();
      })
      .catch((error) => next(error));
  }
);

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
