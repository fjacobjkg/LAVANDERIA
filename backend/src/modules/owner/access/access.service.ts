import type { z } from "zod";
import { prisma } from "../../../lib/prisma.js";
import { hashPassword, verifyPassword } from "../../../lib/password.js";
import { OwnerError } from "../owner.errors.js";
import { accountSelect, mapAccount, mapOperator, operatorSelect } from "./access.mapper.js";
import type { createOperatorSchema } from "./access.schema.js";

export async function getAccount(ownerId: number) {
  const user = await prisma.usuario.findUnique({ where: { id_usuario: ownerId }, select: accountSelect });
  if (!user) throw new OwnerError(401, "La sesión no es válida.");
  return mapAccount(user);
}
async function verifyOwnerPassword(ownerId: number, password: string) {
  const user = await prisma.usuario.findUnique({ where: { id_usuario: ownerId }, include: { rol: true } });
  if (!user?.activo) throw new OwnerError(401, "La sesión no es válida.");
  if (user.rol.nombre !== "PROPIETARIO") throw new OwnerError(403, "Esta operación requiere el rol PROPIETARIO.");
  if (!await verifyPassword(password, user.password_hash)) throw new OwnerError(400, "La contraseña actual es incorrecta.");
  return user;
}
function audit(actor: number, target: number, action: string) {
  return { id_usuario: actor, tabla_afectada: "usuario", id_registro: BigInt(target), accion: action };
}
function handleDuplicate(error: unknown): never {
  if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
    throw new OwnerError(409, "El nombre de usuario ya está ocupado.");
  }
  throw error;
}
export async function changeUsername(ownerId: number, username: string, currentPassword: string) {
  const owner = await verifyOwnerPassword(ownerId, currentPassword);
  if (owner.nombre_usuario === username) throw new OwnerError(400, "Elige un nombre de usuario diferente.");
  try {
    return await prisma.$transaction(async (tx) => {
      const updated = await tx.usuario.updateMany({
        where: { id_usuario: ownerId, activo: true, password_hash: owner.password_hash, rol: { nombre: "PROPIETARIO" } },
        data: { nombre_usuario: username },
      });
      if (updated.count !== 1) throw new OwnerError(409, "La cuenta cambió. Inicia sesión nuevamente.");
      await tx.bitacora.create({ data: audit(ownerId, ownerId, "CAMBIAR_NOMBRE_USUARIO") });
      return mapAccount(await tx.usuario.findUniqueOrThrow({ where: { id_usuario: ownerId }, select: accountSelect }));
    });
  } catch (error) { handleDuplicate(error); }
}
export async function changePassword(ownerId: number, currentPassword: string, newPassword: string) {
  const owner = await verifyOwnerPassword(ownerId, currentPassword);
  if (await verifyPassword(newPassword, owner.password_hash)) throw new OwnerError(400, "La nueva contraseña debe ser diferente de la actual.");
  const passwordHash = await hashPassword(newPassword);
  await prisma.$transaction(async (tx) => {
    const updated = await tx.usuario.updateMany({
      where: { id_usuario: ownerId, activo: true, password_hash: owner.password_hash, rol: { nombre: "PROPIETARIO" } },
      data: { password_hash: passwordHash },
    });
    if (updated.count !== 1) throw new OwnerError(409, "La cuenta cambió. Inicia sesión nuevamente.");
    await tx.bitacora.create({ data: audit(ownerId, ownerId, "CAMBIAR_PASSWORD") });
  });
}
export async function listOperators(page: number) {
  const where = { rol: { nombre: "OPERADOR" } };
  return prisma.$transaction(async (tx) => {
    const totalItems = await tx.usuario.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalItems / 10));
    const currentPage = Math.min(page, totalPages);
    const users = await tx.usuario.findMany({
      where, select: operatorSelect, orderBy: { id_usuario: "desc" },
      take: 10, skip: (currentPage - 1) * 10,
    });
    return { operators: users.map(mapOperator), pagination: { currentPage, totalItems, totalPages } };
  }, { isolationLevel: "RepeatableRead" });
}
export async function createOperator(ownerId: number, input: z.infer<typeof createOperatorSchema>) {
  const passwordHash = await hashPassword(input.password);
  try {
    return await prisma.$transaction(async (tx) => {
      const role = await tx.rol.findUnique({ where: { nombre: "OPERADOR" } });
      if (!role) throw new OwnerError(409, "El rol OPERADOR no está configurado.");
      const user = await tx.usuario.create({
        data: { nombre: input.name, nombre_usuario: input.username, password_hash: passwordHash, id_rol: role.id_rol, activo: true },
        select: operatorSelect,
      });
      await tx.bitacora.create({ data: audit(ownerId, user.id_usuario, "CREAR_USUARIO_OPERADOR") });
      return mapOperator(user);
    });
  } catch (error) { handleDuplicate(error); }
}
export async function setOperatorStatus(ownerId: number, operatorId: number, active: boolean) {
  await prisma.$transaction(async (tx) => {
    const operator = await tx.usuario.findFirst({ where: { id_usuario: operatorId, rol: { nombre: "OPERADOR" } }, select: operatorSelect });
    if (!operator) throw new OwnerError(404, "El operador no existe.");
    if (operator.activo === active) return;
    const updated = await tx.usuario.updateMany({
      where: { id_usuario: operatorId, activo: operator.activo, rol: { nombre: "OPERADOR" } }, data: { activo: active },
    });
    if (updated.count !== 1) throw new OwnerError(409, "La cuenta cambió. Actualiza la lista e inténtalo nuevamente.");
    await tx.bitacora.create({ data: {
      ...audit(ownerId, operatorId, active ? "ACTIVAR_USUARIO_OPERADOR" : "DESACTIVAR_USUARIO_OPERADOR"),
      estado_anterior: operator.activo ? "ACTIVO" : "INACTIVO", estado_nuevo: active ? "ACTIVO" : "INACTIVO",
    } });
  });
}

export async function changeOperatorPassword(ownerId: number, operatorId: number, password: string) {
  const passwordHash = await hashPassword(password);
  await prisma.$transaction(async (tx) => {
    const owner = await tx.usuario.findFirst({
      where: { id_usuario: ownerId, activo: true, rol: { nombre: "PROPIETARIO" } },
      select: { id_usuario: true },
    });
    if (!owner) throw new OwnerError(403, "Esta operación requiere un propietario activo.");
    // El filtro se aplica a la escritura: incluye operadores inactivos y excluye cualquier otro rol.
    const updated = await tx.usuario.updateMany({
      where: { id_usuario: operatorId, rol: { nombre: "OPERADOR" } }, data: { password_hash: passwordHash },
    });
    if (updated.count !== 1) throw new OwnerError(404, "El operador no existe.");
    await tx.bitacora.create({ data: audit(ownerId, operatorId, "CAMBIAR_PASSWORD_OPERADOR") });
  });
}
