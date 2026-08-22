import type {
  Request,
  Response,
} from "express";

import {
  getAuthenticatedUser,
  login,
} from "./auth.service.js";

import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  getClearAuthCookieOptions,
} from "./auth.cookie.js";


export async function loginController(
  request: Request,
  response: Response,
) {
  try {
    const {
      username,
      password,
    } = request.body ?? {};

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return response
        .status(400)
        .json({
          message:
            "Usuario y contraseña son obligatorios.",
        });
    }

    const result =
      await login({
        username:
          username.trim(),

        password,
      });


    /*
     * El JWT se guarda en una cookie
     * HttpOnly.
     */
    response.cookie(
      AUTH_COOKIE_NAME,
      result.token,
      getAuthCookieOptions(),
    );


    /*
     * El JWT ya NO se devuelve
     * al frontend.
     */
    return response
      .status(200)
      .json({
        user: result.user,
      });

  } catch (error) {

    if (
      error instanceof Error &&
      error.message ===
        "INVALID_CREDENTIALS"
    ) {
      return response
        .status(401)
        .json({
          message:
            "Usuario o contraseña incorrectos.",
        });
    }

    if (
      error instanceof Error &&
      error.message ===
        "USER_DISABLED"
    ) {
      return response
        .status(403)
        .json({
          message:
            "El usuario se encuentra deshabilitado.",
        });
    }

    console.error(error);

    return response
      .status(500)
      .json({
        message:
          "Error interno del servidor.",
      });
  }
}


export async function meController(
  _request: Request,
  response: Response,
) {
  try {
    const userId =
      Number(
        response.locals.user?.sub,
      );

    if (!Number.isInteger(userId)) {
      return response
        .status(401)
        .json({
          message:
            "Sesión inválida.",
        });
    }

    const user =
      await getAuthenticatedUser(
        userId,
      );

    return response
      .status(200)
      .json({
        user,
      });

  } catch {

    return response
      .status(401)
      .json({
        message:
          "La sesión es inválida o ha expirado.",
      });
  }
}


export function logoutController(
  _request: Request,
  response: Response,
) {
  response.clearCookie(
    AUTH_COOKIE_NAME,
    getClearAuthCookieOptions(),
  );

  return response
    .status(200)
    .json({
      message:
        "Sesión cerrada correctamente.",
    });
}