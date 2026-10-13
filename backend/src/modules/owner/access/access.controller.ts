import type { RequestHandler } from "express";
import { z } from "zod";
import { AUTH_COOKIE_NAME, getClearAuthCookieOptions } from "../../auth/auth.cookie.js";
import { OwnerError } from "../owner.errors.js";
import * as service from "./access.service.js";
import * as schema from "./access.schema.js";

function endpoint(handler: RequestHandler): RequestHandler {
  return async (request, response, next) => {
    try { await handler(request, response, next); }
    catch (error) {
      if (error instanceof z.ZodError) response.status(400).json({ message: error.issues[0]?.message ?? "Datos inválidos." });
      else if (error instanceof OwnerError) response.status(error.statusCode).json({ message: error.message });
      else next(error);
    }
  };
}
export const getAccountController = endpoint(async (_request, response) => {
  response.json({ account: await service.getAccount(response.locals.user.sub) });
});
export const changeUsernameController = endpoint(async (request, response) => {
  const input = schema.changeUsernameSchema.parse(request.body);
  response.json({ account: await service.changeUsername(response.locals.user.sub, input.username, input.currentPassword) });
});
export const changePasswordController = endpoint(async (request, response) => {
  const input = schema.changePasswordSchema.parse(request.body);
  await service.changePassword(response.locals.user.sub, input.currentPassword, input.newPassword);
  response.clearCookie(AUTH_COOKIE_NAME, getClearAuthCookieOptions());
  response.json({ message: "Contraseña actualizada. Inicia sesión con tu nueva contraseña." });
});
export const listOperatorsController = endpoint(async (request, response) => {
  const { page } = schema.operatorsQuerySchema.parse(request.query);
  response.json(await service.listOperators(page));
});
export const createOperatorController = endpoint(async (request, response) => {
  const input = schema.createOperatorSchema.parse(request.body);
  response.status(201).json({ operator: await service.createOperator(response.locals.user.sub, input) });
});
export const setOperatorStatusController = endpoint(async (request, response) => {
  const id = schema.operatorIdSchema.parse(request.params.id);
  const { active } = schema.statusSchema.parse(request.body);
  await service.setOperatorStatus(response.locals.user.sub, id, active);
  response.json({ message: active ? "Operador activado." : "Operador desactivado." });
});

export const changeOperatorPasswordController = endpoint(async (request, response) => {
  const id = schema.operatorIdSchema.parse(request.params.id);
  const { password } = schema.operatorPasswordSchema.parse(request.body);
  await service.changeOperatorPassword(response.locals.user.sub, id, password);
  response.json({ message: "Contraseña del operador actualizada correctamente." });
});
