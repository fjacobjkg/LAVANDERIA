import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { verifyToken } from "../lib/jwt.js";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Se requiere autenticación.",
    });
  }

  const token = authorization.substring(7);

  try {
    const payload = verifyToken(token);

    res.locals.user = payload;

    next();
  } catch {
    return res.status(401).json({
      message: "La sesión es inválida o ha expirado.",
    });
  }
}