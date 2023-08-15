"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const UsersController_1 = require("../controllers/UsersController");
const Validate_1 = __importDefault(require("../middleware/Validate"));
const UsersZod_1 = require("../ZodSchema/UsersZod");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
userRouter.post("/register", (0, Validate_1.default)(UsersZod_1.registerZodSchema), UsersController_1.register);
userRouter.post("/login", (0, Validate_1.default)(UsersZod_1.loginZodSchema), UsersController_1.login);
// userRouter.get("/", protect, getUser);
// userRouter.get("/refresh", refreshToken, protect, getUser);
userRouter.post("/logout", UsersController_1.logout);
userRouter.post("/resetpass", (0, Validate_1.default)(UsersZod_1.resetPassZodSchema), UsersController_1.resetPass);
userRouter.post("/editpass/:id/:token", (0, Validate_1.default)(UsersZod_1.editPassZodSchema), UsersController_1.editPass);
