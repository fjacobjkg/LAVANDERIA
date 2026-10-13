import type { RequestHandler } from "express";
import { verifyToken } from "../lib/jwt.js";
import { prisma } from "../lib/prisma.js";
import { matchesSessionVersion } from "../lib/session-version.js";
import { readAuthCookie } from "../modules/auth/auth.cookie.js";
import { isActiveRole } from "../lib/roles.js";

export const requireAuth: RequestHandler = async (request, response, next) => {
  let payload: ReturnType<typeof verifyToken>;
  try {
    const token = readAuthCookie(request);
    if (!token) { response.status(401).json({ message: "Se requiere autenticación." }); return; }
    payload = verifyToken(token);
    if (!Number.isSafeInteger(payload.sub) || payload.sub <= 0) throw new Error("INVALID_SESSION");
  } catch {
    response.status(401).json({ message: "La sesión es inválida o ha expirado." }); return;
  }
  try {
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: payload.sub }, select: { activo: true, password_hash: true, rol: { select: { nombre: true } } },
    });
    if (!user?.activo || !matchesSessionVersion(payload.sessionVersion, user.password_hash)) {
      response.status(401).json({ message: "La sesión es inválida o ha expirado. Inicia sesión nuevamente." }); return;
    }
    if (!isActiveRole(user.rol.nombre)) {
      response.status(403).json({ message: "El rol de esta cuenta ya no tiene acceso al sistema." }); return;
    }
    response.locals.user = { ...payload, role: user.rol.nombre };
    next();
  } catch (error) { next(error); }
};

export const requireOperator: RequestHandler = (_request, response, next) => {
  if (response.locals.user?.role !== "OPERADOR") {
    response.status(403).json({ message: "Esta operación requiere el rol OPERADOR." }); return;
  }
  next();
};
