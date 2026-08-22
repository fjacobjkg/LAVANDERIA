import {
  Router,
} from "express";

import {
  loginController,
  logoutController,
  meController,
} from "./auth.controller.js";

import {
  requireAuth,
} from "../../middleware/auth.js";

export const authRouter =
  Router();


authRouter.post(
  "/login",
  loginController,
);


authRouter.get(
  "/me",
  requireAuth,
  meController,
);


authRouter.post(
  "/logout",
  requireAuth,
  logoutController,
);