import { Router } from "express";

import {
  requireAuth,
} from "../../middleware/auth.js";

import {
  createServiceController,
  getServicesController,
} from "./service.controller.js";

export const serviceRouter =
  Router();


serviceRouter.get(
  "/",
  requireAuth,
  getServicesController,
);


serviceRouter.post(
  "/",
  requireAuth,
  createServiceController,
);