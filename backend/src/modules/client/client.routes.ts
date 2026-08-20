import { Router } from "express";

import {
  requireAuth,
} from "../../middleware/auth.js";

import {
  getClientsController,
} from "./client.controller.js";

export const clientRouter = Router();

clientRouter.get(
  "/",
  requireAuth,
  getClientsController,
);