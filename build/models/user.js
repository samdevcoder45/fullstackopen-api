"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: String,
    passwordHash: String,
    notes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Note",
        },
    ],
});
userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        //the passwordHash should not be revealed
        delete returnedObject.passwordHash;
    },
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
