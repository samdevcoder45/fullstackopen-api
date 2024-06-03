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
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const usersRouter = express_1.default.Router();
const user_1 = __importDefault(require("../models/user"));
usersRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, name, password } = req.body;
    const saltRounds = process.env.SALT_ROUNDS;
    const passwordHash = yield bcrypt_1.default.hash(password, Number(saltRounds));
    const user = new user_1.default({
        username,
        name,
        passwordHash,
    });
    const savedUser = yield user.save();
    res.status(201).json(savedUser);
}));
usersRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({});
    res.json(users);
}));
exports.default = usersRouter;
