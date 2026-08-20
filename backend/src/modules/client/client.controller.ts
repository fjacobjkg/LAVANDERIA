import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  getActiveClients,
} from "./client.service.js";

export async function getClientsController(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const clients =
      await getActiveClients();

    return response.status(200).json({
      clients,
    });
  } catch (error) {
    next(error);
  }
}