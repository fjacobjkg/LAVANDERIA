import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { createClientSchema } from "./client.schema.js";

import {
  createClient,
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

export async function createClientController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsed =
    createClientSchema.safeParse(
      request.body,
    );

  if (!parsed.success) {
    return response
      .status(400)
      .json({
        message:
          "Los datos del cliente no son válidos.",

        errors:
          parsed.error.flatten()
            .fieldErrors,
      });
  }


  const operatorId =
    Number(
      response.locals.user?.sub,
    );

  if (!Number.isInteger(operatorId)) {
    return response
      .status(401)
      .json({
        message:
          "No se pudo identificar al usuario autenticado.",
      });
  }


  try {
    const client =
      await createClient(
        parsed.data,
        operatorId,
      );

    return response
      .status(201)
      .json({
        message:
          "Cliente registrado correctamente.",

        client,
      });

  } catch (error) {

    if (
      error instanceof Error &&
      error.message ===
        "OPERATOR_NOT_ALLOWED"
    ) {
      return response
        .status(403)
        .json({
          message:
            "El usuario no está autorizado para registrar clientes.",
        });
    }

    next(error);
  }
}