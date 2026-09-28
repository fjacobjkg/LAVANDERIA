import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  historyPageQuerySchema,
  registerIncidentSchema,
} from "./history-control.schema.js";

import {
  HistoryControlError,
} from "./history-control.errors.js";

import {
  getIncidents,
  getIncidentServiceOptions,
  registerIncident,
} from "./incident.service.js";


export async function getIncidentServiceOptionsController(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const services =
      await getIncidentServiceOptions();


    return response
      .status(200)
      .json({
        services,
      });

  } catch (error) {
    next(error);
  }
}


export async function getIncidentsController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsed =
    historyPageQuerySchema
      .safeParse(
        request.query,
      );


  if (!parsed.success) {
    return response
      .status(400)
      .json({
        message:
          "La paginación no es válida.",
      });
  }


  try {
    const result =
      await getIncidents(
        parsed.data.page,
      );


    return response
      .status(200)
      .json(result);

  } catch (error) {
    if (
      error instanceof
      HistoryControlError
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


export async function registerIncidentController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsed =
    registerIncidentSchema
      .safeParse(
        request.body,
      );


  if (!parsed.success) {
    return response
      .status(400)
      .json({
        message:
          "Los datos del incidente no son válidos.",

        errors:
          parsed.error
            .flatten()
            .fieldErrors,
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
    const incident =
      await registerIncident(
        parsed.data,
        operatorId,
      );


    return response
      .status(201)
      .json({
        message:
          "Incidente registrado correctamente.",

        incident,
      });

  } catch (error) {
    if (
      error instanceof
      HistoryControlError
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