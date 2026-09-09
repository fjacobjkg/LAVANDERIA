import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  serviceIdParamsSchema,
} from "../service.schema.js";

import {
  advanceServiceStatus,
} from "../service.service.js";

import {
  ServiceError,
} from "../service.errors.js";


export async function advanceServiceStatusController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsed =
    serviceIdParamsSchema.safeParse(
      request.params,
    );


  if (!parsed.success) {
    return response
      .status(400)
      .json({
        message:
          "El identificador del servicio no es válido.",
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
      await advanceServiceStatus(
        parsed.data.id,
        operatorId,
      );


    return response
      .status(200)
      .json({
        message:
          "Estado del servicio actualizado correctamente.",

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