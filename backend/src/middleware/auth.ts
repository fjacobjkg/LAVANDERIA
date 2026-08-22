import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  verifyToken,
} from "../lib/jwt.js";

import {
  readAuthCookie,
} from "../modules/auth/auth.cookie.js";

export function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const token =
    readAuthCookie(request);

  if (!token) {
    return response
      .status(401)
      .json({
        message:
          "Se requiere autenticación.",
      });
  }

  try {
    const payload =
      verifyToken(token);

    response.locals.user =
      payload;

    next();

  } catch {

    return response
      .status(401)
      .json({
        message:
          "La sesión es inválida o ha expirado.",
      });
  }
}