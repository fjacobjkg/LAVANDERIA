import type { Request, Response } from "express";
import { login } from "./auth.service.js";

export async function loginController(
  request: Request,
  response: Response,
) {
  try {
    const { username, password } = request.body;

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return response.status(400).json({
        message: "Usuario y contraseña son obligatorios.",
      });
    }

    const result = await login({
      username: username.trim(),
      password,
    });

    return response.status(200).json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      return response.status(401).json({
        message: "Usuario o contraseña incorrectos.",
      });
    }

    if (
      error instanceof Error &&
      error.message === "USER_DISABLED"
    ) {
      return response.status(403).json({
        message: "El usuario se encuentra deshabilitado.",
      });
    }

    console.error(error);

    return response.status(500).json({
      message: "Error interno del servidor.",
    });
  }
}