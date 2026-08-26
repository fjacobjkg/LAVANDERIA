import { Router } from "express";

import {
  requireAuth,
} from "../../middleware/auth.js";

import {
  advanceServiceStatusController,
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

serviceRouter.patch(
  "/:id/next-status",
  requireAuth,
  advanceServiceStatusController,
);