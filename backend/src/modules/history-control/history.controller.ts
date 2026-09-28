import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  historyPageQuerySchema,
  historyServiceParamsSchema,
} from "./history-control.schema.js";

import {
  HistoryControlError,
} from "./history-control.errors.js";

import {
  getServiceHistory,
} from "./history.service.js";


export async function getServiceHistoryController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedParams =
    historyServiceParamsSchema
      .safeParse(
        request.params,
      );


  const parsedQuery =
    historyPageQuerySchema
      .safeParse(
        request.query,
      );


  if (
    !parsedParams.success ||
    !parsedQuery.success
  ) {
    return response
      .status(400)
      .json({
        message:
          "Los datos de consulta no son válidos.",
      });
  }


  try {
    const result =
      await getServiceHistory(
        parsedParams.data.id,
        parsedQuery.data.page,
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