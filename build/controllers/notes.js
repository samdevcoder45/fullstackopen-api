"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const note_1 = __importDefault(require("../models/note"));
const notesRouter = express_1.default.Router();
notesRouter.get("/", (req, res) => {
    note_1.default.find({}).then((notes) => {
        res.json(notes);
    });
});
notesRouter.get("/:id", (req, res, next) => {
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
notesRouter.post("/", (req, res, next) => {
    const body = req.body;
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
notesRouter.delete("/:id", (req, res, next) => {
    note_1.default.findByIdAndDelete(req.params.id)
        .then(() => {
        res.status(204).end();
    })
        .catch((error) => next(error));
});
notesRouter.put("/:id", (req, res, next) => {
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
exports.default = notesRouter;
