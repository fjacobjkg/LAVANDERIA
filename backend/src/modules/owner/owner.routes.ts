import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { requireOwner } from "./owner.authorization.js";
import { getMonthlyDeliveriesController } from "./monthly/monthly.controller.js";
import {
  getAccountController, changeUsernameController, changePasswordController,
  listOperatorsController, createOperatorController, setOperatorStatusController, changeOperatorPasswordController,
} from "./access/access.controller.js";

export const ownerRouter = Router();
ownerRouter.use(requireAuth, requireOwner);
ownerRouter.get("/monthly-deliveries", getMonthlyDeliveriesController);
ownerRouter.get("/account", getAccountController);
ownerRouter.patch("/account/username", changeUsernameController);
ownerRouter.patch("/account/password", changePasswordController);
ownerRouter.get("/operators", listOperatorsController);
ownerRouter.post("/operators", createOperatorController);
ownerRouter.patch("/operators/:id/status", setOperatorStatusController);
ownerRouter.patch("/operators/:id/password", changeOperatorPasswordController);
