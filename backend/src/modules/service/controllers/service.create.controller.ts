import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  createServiceSchema,
} from "../service.schema.js";

import {
  registerService,
} from "../service.service.js";

import {
  ServiceError,
} from "../service.errors.js";


export async function createServiceController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsed =
    createServiceSchema.safeParse(
      request.body,
    );


  if (!parsed.success) {
    return response
      .status(400)
      .json({
        message:
          "Los datos del servicio no son válidos.",

        errors:
          parsed.error.flatten().fieldErrors,
      });
  }


  const operatorId =
    Number(
      response.locals.user?.sub,
    );


  if (
    !Number.isInteger(
      operatorId,
    )
  ) {
    return response
      .status(401)
      .json({
        message:
          "No se pudo identificar al usuario autenticado.",
      });
  }


  try {
    const service =
      await registerService(
        parsed.data,
        operatorId,
      );


    return response
      .status(201)
      .json({
        message:
          "Servicio registrado correctamente.",

        service,
      });

  } catch (error) {
    if (
      error instanceof
      ServiceError
    ) {
      return response
        .status(
          error.statusCode,
        )
        .json({
          message:
            error.message,
        });
    }


    next(error);
  }
}