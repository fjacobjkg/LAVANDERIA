import {
  Router,
} from "express";

import {
  requireAuth,
} from "../../middleware/auth.js";

import {
  getIncidentsController,
  getIncidentServiceOptionsController,
  registerIncidentController,
} from "./incident.controller.js";

import {
  getServiceHistoryController,
} from "./history.controller.js";


export const historyControlRouter =
  Router();


historyControlRouter.get(
  "/service-options",
  requireAuth,
  getIncidentServiceOptionsController,
);


historyControlRouter.get(
  "/incidents",
  requireAuth,
  getIncidentsController,
);


historyControlRouter.post(
  "/incidents",
  requireAuth,
  registerIncidentController,
);


historyControlRouter.get(
  "/services/:id/history",
  requireAuth,
  getServiceHistoryController,
);