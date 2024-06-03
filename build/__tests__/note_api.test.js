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
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const note_1 = __importDefault(require("../models/note"));
const test_helper_1 = __importDefault(require("./test_helper"));
const api = (0, supertest_1.default)(app_1.default);
(0, node_test_1.describe)("when there is initially some notes saved", () => {
    (0, node_test_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield note_1.default.deleteMany({});
        yield note_1.default.insertMany(test_helper_1.default.initialNotes);
    }));
    (0, node_test_1.test)("notes are returned as json", () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .get("/api/notes")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    }));
    (0, node_test_1.test)("all notes are returned", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.get("/api/notes");
        node_assert_1.default.strictEqual(response.body.length, test_helper_1.default.initialNotes.length);
    }));
    (0, node_test_1.test)("a specific note is within the returned notes", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api.get("/api/notes");
        const contents = response.body.map((r) => r.content);
        (0, node_assert_1.default)(contents.includes("Browser can execute only JavaScript"));
    }));
    (0, node_test_1.describe)("viewing a specific note", () => {
        (0, node_test_1.test)("succeeds with a valid id", () => __awaiter(void 0, void 0, void 0, function* () {
            const notesAtStart = yield test_helper_1.default.notesInDb();
            const noteToView = notesAtStart[0];
            const resultNote = yield api
                .get(`/api/notes/${noteToView._id}`)
                .expect(200)
                .expect("Content-Type", /application\/json/);
            node_assert_1.default.deepStrictEqual(resultNote.body, noteToView);
        }));
        (0, node_test_1.test)("fails with statuscode 404 if note does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const validNonexistingId = yield test_helper_1.default.nonExistingId();
            yield api.get(`/api/notes/${validNonexistingId}`).expect(404);
        }));
        (0, node_test_1.test)("fails with statuscode 400 id is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidId = "5a3d5da59070081a82a3445";
            yield api.get(`/api/notes/${invalidId}`).expect(400);
        }));
    });
    (0, node_test_1.describe)("addition of a new note", () => {
        (0, node_test_1.test)("succeeds with valid data", () => __awaiter(void 0, void 0, void 0, function* () {
            const newNote = {
                content: "async/await simplifies making async calls",
                important: true,
            };
            yield api
                .post("/api/notes")
                .send(newNote)
                .expect(201)
                .expect("Content-Type", /application\/json/);
            const notesAtEnd = yield test_helper_1.default.notesInDb();
            node_assert_1.default.strictEqual(notesAtEnd.length, test_helper_1.default.initialNotes.length + 1);
            const contents = notesAtEnd.map((n) => n.content);
            (0, node_assert_1.default)(contents.includes("async/await simplifies making async calls"));
        }));
        (0, node_test_1.test)("fails with status code 400 if data invalid", () => __awaiter(void 0, void 0, void 0, function* () {
            const newNote = {
                important: true,
            };
            yield api.post("/api/notes").send(newNote).expect(400);
            const notesAtEnd = yield test_helper_1.default.notesInDb();
            node_assert_1.default.strictEqual(notesAtEnd.length, test_helper_1.default.initialNotes.length);
        }));
    });
    (0, node_test_1.describe)("deletion of a note", () => {
        (0, node_test_1.test)("succeeds with status code 204 if id is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            const notesAtStart = yield test_helper_1.default.notesInDb();
            const noteToDelete = notesAtStart[0];
            yield api.delete(`/api/notes/${noteToDelete._id}`).expect(204);
            const notesAtEnd = yield test_helper_1.default.notesInDb();
            node_assert_1.default.strictEqual(notesAtEnd.length, test_helper_1.default.initialNotes.length - 1);
            const contents = notesAtEnd.map((r) => r.content);
            (0, node_assert_1.default)(!contents.includes(noteToDelete.content));
        }));
    });
});
(0, node_test_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
