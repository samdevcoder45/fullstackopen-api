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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const note_1 = __importDefault(require("../models/note"));
const user_1 = __importDefault(require("../models/user"));
const notesRouter = express_1.default.Router();
notesRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notes = yield note_1.default.find({}).populate("user", { username: 1, name: 1 });
    res.json(notes);
}));
notesRouter.get("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield note_1.default.findById(req.params.id);
    if (note) {
        res.json(note);
    }
    else {
        res.status(404).end();
    }
}));
const getTokenFrom = (req) => {
    const authorization = req.get("authorization");
    if (authorization && authorization.startsWith("Bearer ")) {
        return authorization.replace("Bearer ", "");
    }
    return null;
};
notesRouter.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const decodedToken = jsonwebtoken_1.default.verify(getTokenFrom(req), process.env.SECRET);
    if (!decodedToken.id) {
        return res.status(401).json({ error: "token invalid" });
    }
    const user = yield user_1.default.findById(decodedToken.id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const note = new note_1.default({
        content: body.content,
        important: body.important === undefined ? false : body.important,
        user: user._id,
    });
    const savedNote = yield note.save();
    user.notes = user.notes.concat(savedNote._id);
    yield user.save();
    res.status(201).json(savedNote);
}));
notesRouter.delete("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield note_1.default.findByIdAndDelete(req.params.id);
    res.status(204).end();
}));
notesRouter.put("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const note = {
        content: body.content,
        important: body.important,
    };
    const updatedNote = yield note_1.default.findByIdAndUpdate(req.params.id, note, {
        new: true,
    });
    res.json(updatedNote);
}));
exports.default = notesRouter;
