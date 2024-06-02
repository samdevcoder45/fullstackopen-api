"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const note_1 = __importDefault(require("../models/note"));
const notesRouter = express_1.default.Router();
notesRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notes = yield note_1.default.find({});
    res.json(notes);
}));
notesRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield note_1.default.findById(req.params.id);
    try {
        if (note) {
            res.json(note);
        }
        else {
            res.status(404).end();
        }
    }
    catch (error) {
        next(error);
    }
}));
notesRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const note = new note_1.default({
        content: body.content,
        important: body.important || false,
    });
    try {
        const savedNote = yield note.save();
        res.status(201).json(savedNote);
    }
    catch (error) {
        next(error);
    }
}));
notesRouter.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield note_1.default.findByIdAndDelete(req.params.id)
        .then(() => {
        res.status(204).end();
    })
        .catch((error) => next(error));
}));
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
