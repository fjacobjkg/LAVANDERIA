import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  listServicesQuerySchema,
} from "../service.schema.js";

import {
  getServices,
} from "../service.service.js";


export async function getServicesController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsed =
    listServicesQuerySchema.safeParse(
      request.query,
    );


  if (!parsed.success) {
    return response
      .status(400)
      .json({
        message:
          "Los filtros de búsqueda no son válidos.",
      });
  }


  try {
    const result =
      await getServices(
        parsed.data,
      );


    return response
      .status(200)
      .json(
        result,
      );

  } catch (error) {
    next(error);
  }
}