import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  deliveryQrSchema,
  serviceIdParamsSchema,
} from "../service.schema.js";

import {
  confirmServiceDelivery,
  getDeliveryService,
  getDeliveryServiceOptions,
  validateDeliveryQr,
} from "../service.service.js";

import {
  ServiceError,
} from "../service.errors.js";


export async function getDeliveryServiceOptionsController(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const services =
      await getDeliveryServiceOptions();


    return response
      .status(200)
      .json({
        services,
      });

  } catch (error) {
    next(error);
  }
}


export async function getDeliveryServiceController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedParams =
    serviceIdParamsSchema.safeParse(
      request.params,
    );


  if (!parsedParams.success) {
    return response
      .status(400)
      .json({
        message:
          "El identificador del servicio no es válido.",
      });
  }


  try {
    const service =
      await getDeliveryService(
        parsedParams.data.id,
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


export async function validateDeliveryQrController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedParams =
    serviceIdParamsSchema.safeParse(
      request.params,
    );


  const parsedBody =
    deliveryQrSchema.safeParse(
      request.body,
    );


  if (
    !parsedParams.success ||
    !parsedBody.success
  ) {
    return response
      .status(400)
      .json({
        message:
          "Los datos de validación del QR no son válidos.",
      });
  }


  try {
    const result =
      await validateDeliveryQr(
        parsedParams.data.id,
        parsedBody.data.qrToken,
      );


    return response
      .status(200)
      .json(
        result,
      );

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


export async function confirmServiceDeliveryController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const parsedParams =
    serviceIdParamsSchema.safeParse(
      request.params,
    );


  const parsedBody =
    deliveryQrSchema.safeParse(
      request.body,
    );


  if (
    !parsedParams.success ||
    !parsedBody.success
  ) {
    return response
      .status(400)
      .json({
        message:
          "Los datos para confirmar la entrega no son válidos.",
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
      await confirmServiceDelivery(
        parsedParams.data.id,
        operatorId,
        parsedBody.data.qrToken,
      );


    return response
      .status(200)
      .json({
        message:
          "Entrega confirmada correctamente.",

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