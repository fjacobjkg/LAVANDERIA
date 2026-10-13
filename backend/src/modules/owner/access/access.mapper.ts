import type { Prisma } from "../../../../generated/prisma/client.js";

export const accountSelect = {
  id_usuario: true, nombre: true, nombre_usuario: true, rol: { select: { nombre: true } },
} satisfies Prisma.usuarioSelect;
export const operatorSelect = {
  id_usuario: true, nombre: true, nombre_usuario: true, activo: true, fecha_creacion: true,
} satisfies Prisma.usuarioSelect;
export function mapAccount(user: Prisma.usuarioGetPayload<{ select: typeof accountSelect }>) {
  return { id: user.id_usuario, name: user.nombre, username: user.nombre_usuario, role: user.rol.nombre };
}
export function mapOperator(user: Prisma.usuarioGetPayload<{ select: typeof operatorSelect }>) {
  return { id: user.id_usuario, name: user.nombre, username: user.nombre_usuario, active: user.activo, createdAt: user.fecha_creacion.toISOString() };
}
