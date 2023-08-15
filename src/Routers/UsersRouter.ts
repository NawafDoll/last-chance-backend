import express from "express";
import {
  editPass,
  getUser,
  login,
  logout,
  refreshToken,
  register,
  resetPass,
} from "../controllers/UsersController";
import validate from "../middleware/Validate";
import {
  editPassZodSchema,
  loginZodSchema,
  registerZodSchema,
  resetPassZodSchema,
} from "../ZodSchema/UsersZod";
import { protect } from "../middleware/Protected";

const userRouter = express.Router();

userRouter.post("/register", validate(registerZodSchema), register);
userRouter.post("/login", validate(loginZodSchema), login);
// userRouter.get("/", protect, getUser);
// userRouter.get("/refresh", refreshToken, protect, getUser);
userRouter.post("/logout", logout);
userRouter.post("/resetpass", validate(resetPassZodSchema), resetPass);
userRouter.post("/editpass/:id/:token", validate(editPassZodSchema), editPass);

export { userRouter };
