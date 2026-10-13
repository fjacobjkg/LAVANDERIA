import { Router } from "express";

import {
  requireAuth,
  requireOperator,
} from "../../middleware/auth.js";

import {
  createClientController,
  getClientsController,
} from "./client.controller.js";

export const clientRouter =
  Router();


clientRouter.get(
  "/",
  requireAuth,
  requireOperator,
  getClientsController,
);


clientRouter.post(
  "/",
  requireAuth,
  requireOperator,
  createClientController,
);