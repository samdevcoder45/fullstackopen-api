"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set("strictQuery", false);
const url = process.env.MONGO_URI;
mongoose_1.default
    .connect(url)
    .then((result) => {
    console.log("connected to MONGODB");
})
    .catch((error) => {
    console.log("error connecting to MONGODB:", error.message);
});
const noteSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true,
    },
    important: Boolean,
});
noteSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
const Note = mongoose_1.default.model("Note", noteSchema);
exports.default = Note;
