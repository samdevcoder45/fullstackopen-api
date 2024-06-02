"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./utils/config"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const notes_1 = __importDefault(require("./controllers/notes"));
const middleware_1 = __importDefault(require("./utils/middleware"));
const logger_1 = __importDefault(require("./utils/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set("strictQuery", false);
logger_1.default.info("connecting to", config_1.default.MONGO_URI);
mongoose_1.default
    .connect(config_1.default.MONGO_URI)
    .then(() => {
    logger_1.default.info("connected to MongoDB");
})
    .catch((error) => {
    logger_1.default.error("error connecting to MongoDB:", error.message);
});
app.use((0, cors_1.default)());
app.use(express_1.default.static("dist"));
app.use(express_1.default.json());
app.use(middleware_1.default.requestLogger);
app.use("/api/notes", notes_1.default);
app.use(middleware_1.default.unknownEndpoint);
app.use(middleware_1.default.errorHandler);
exports.default = app;
