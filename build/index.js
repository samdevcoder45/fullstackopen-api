"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const note_1 = __importDefault(require("./models/note"));
const cors_1 = __importDefault(require("cors"));
const requestLogger = (req, res, next) => {
    console.log("Method:", req.method);
    console.log("Path: ", req.path);
    console.log("Body: ", req.body);
    console.log("---");
    next();
};
const errorHandler = (error, req, res, next) => {
    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" });
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    next(error);
};
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};
app.use((0, cors_1.default)());
app.use(express_1.default.static("dist"));
app.use(express_1.default.json());
app.use(requestLogger);
app.get("/api/notes", (req, res) => {
    note_1.default.find({}).then((notes) => {
        res.json(notes);
    });
});
app.get("/api/notes/:id", (req, res, next) => {
    note_1.default.findById(req.params.id)
        .then((note) => {
        if (note) {
            res.json(note);
        }
        else {
            res.status(404).end();
        }
    })
        .catch((error) => next(error));
});
app.post("/api/notes", (req, res, next) => {
    const body = req.body;
    if (!body.content) {
        return res.status(400).json({ error: "content missing" });
    }
    const note = new note_1.default({
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
app.put("/api/notes/:id", (req, res, next) => {
    const body = req.body;
    const note = {
        content: body.content,
        important: body.important,
    };
    note_1.default.findByIdAndUpdate(req.params.id, note, { new: true })
        .then((updatedNote) => {
        res.json(updatedNote);
    })
        .catch((error) => next(error));
});
app.delete("/api/notes/:id", (req, res, next) => {
    note_1.default.findByIdAndDelete(req.params.id)
        .then((result) => {
        res.status(204).end();
    })
        .catch((error) => next(error));
});
app.use(unknownEndpoint);
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
