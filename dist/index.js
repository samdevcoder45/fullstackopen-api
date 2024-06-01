"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const requestLogger = (req, res, next) => {
    console.log("Method:", req.method);
    console.log("Path: ", req.path);
    console.log("Body: ", req.body);
    console.log("---");
    next();
};
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(requestLogger);
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true,
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false,
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true,
    },
];
app.get("/api/notes", (req, res) => {
    res.json(notes);
});
app.get("/api/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find((note) => note.id === id);
    if (note) {
        res.json(note);
    }
    else {
        res.status(404).end();
    }
});
const generatedId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
    return maxId + 1;
};
app.post("/api/notes", (req, res) => {
    const body = req.body;
    if (!body.content) {
        return res.status(400).json({ error: "content missing" });
    }
    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generatedId(),
    };
    notes = notes.concat(note);
    res.json(note);
});
app.delete("/api/notes/:id", (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter((note) => note.id !== id);
    res.status(204).end();
});
app.use(unknownEndpoint);
const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
