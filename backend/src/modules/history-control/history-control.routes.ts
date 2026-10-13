import {
  Router,
} from "express";

import {
  requireAuth,
  requireOperator,
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
  requireOperator,
  getIncidentServiceOptionsController,
);


historyControlRouter.get(
  "/incidents",
  requireAuth,
  requireOperator,
  getIncidentsController,
);


historyControlRouter.post(
  "/incidents",
  requireAuth,
  requireOperator,
  registerIncidentController,
);


historyControlRouter.get(
  "/services/:id/history",
  requireAuth,
  requireOperator,
  getServiceHistoryController,
);