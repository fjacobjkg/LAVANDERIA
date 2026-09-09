import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  serviceIdParamsSchema,
} from "../service.schema.js";

import {
  confirmServiceLabelPrint,
  getServiceLabel,
  getServicesForLabel,
} from "../service.service.js";

import {
  ServiceError,
} from "../service.errors.js";


export async function getServicesForLabelController(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const services =
      await getServicesForLabel();


    return response
      .status(200)
      .json({
        services,
      });

  } catch (error) {
    next(error);
  }
}


export async function getServiceLabelController(
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


  try {
    const service =
      await getServiceLabel(
        parsed.data.id,
      );


    return response
      .status(200)
      .json({
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


export async function confirmServiceLabelPrintController(
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
          "La sesión no es válida.",
      });
  }


  try {
    const service =
      await confirmServiceLabelPrint(
        parsed.data.id,
        operatorId,
      );


    return response
      .status(200)
      .json({
        message:
          "Impresión de etiqueta confirmada.",

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