import { Router } from "express";

import {
  requireAuth,
} from "../../middleware/auth.js";

import {
  advanceServiceStatusController,
  createServiceController,
  getServicesController,
  getServiceLabelController,
  getServicesForLabelController,
  confirmServiceLabelPrintController,
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

serviceRouter.get(
  "/label-options",
  requireAuth,
  getServicesForLabelController,
);


serviceRouter.get(
  "/:id/label",
  requireAuth,
  getServiceLabelController,
);

serviceRouter.post(
  "/:id/label/print-confirmation",
  requireAuth,
  confirmServiceLabelPrintController,
);