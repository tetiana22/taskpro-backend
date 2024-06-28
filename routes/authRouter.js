import express from "express";
import multer from "multer";
import { authenticate, validateBody } from "../helpers/index.js";
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
  updateThemeSchema,
} from "../schemas/userSchema.js";
import authControllers from "../controllers/authControllers.js";
const upload = multer({ dest: "tmp/" });
const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  authControllers.register
);

authRouter.post("/login", validateBody(loginSchema), authControllers.login);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.put(
  "/update",
  authenticate,
  upload.single("avatarURL"),
  validateBody(updateUserSchema),
  authControllers.updateUser
);

authRouter.patch(
  "/theme",
  authenticate,
  validateBody(updateThemeSchema),
  authControllers.updateUserTheme
);
authRouter.post("/support", authenticate, authControllers.getHelpEmail);
export default authRouter;
