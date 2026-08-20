import { Router } from "express";

import {
  requireAuth,
} from "../../middleware/auth.js";

import {
  createServiceController,
} from "./service.controller.js";

export const serviceRouter = Router();

serviceRouter.post(
  "/",
  requireAuth,
  createServiceController,
);