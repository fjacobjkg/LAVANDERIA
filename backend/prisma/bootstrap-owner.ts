import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/lib/password.js";
import { validatePasswordPolicy } from "../src/lib/password-policy.js";

export async function seedInitialOwner(environment: NodeJS.ProcessEnv = process.env) {
  const username = environment.INITIAL_OWNER_USERNAME?.trim();
  const name = environment.INITIAL_OWNER_NAME?.trim();
  if (username) {
    const existing = await prisma.usuario.findUnique({
      where: { nombre_usuario: username }, select: { rol: { select: { nombre: true } } },
    });
    if (existing) {
      if (existing.rol.nombre !== "PROPIETARIO") {
        throw new Error("INITIAL_OWNER_USERNAME está ocupado por otra cuenta. Elige un usuario distinto; no se modificó la cuenta existente.");
      }
      return "El propietario inicial ya existe. No se modificaron su contraseña ni su estado.";
    }
  } else {
    const owner = await prisma.usuario.findFirst({
      where: { activo: true, rol: { nombre: "PROPIETARIO" } }, select: { id_usuario: true },
    });
    if (owner) return "Ya existe un propietario activo. No se modificó ninguna cuenta.";
  }

  const password = environment.INITIAL_OWNER_PASSWORD;
  if (!name || !username || !password) {
    throw new Error("Configura INITIAL_OWNER_NAME, INITIAL_OWNER_USERNAME e INITIAL_OWNER_PASSWORD para crear el propietario inicial. Las variables INITIAL_ADMIN_* ya no crean cuentas; las cuentas legacy se conservan.");
  }
  if (name.length > 100 || username.length > 50) throw new Error("El nombre admite 100 caracteres y el usuario 50.");
  validatePasswordPolicy(password);
  const role = await prisma.rol.findUnique({ where: { nombre: "PROPIETARIO" }, select: { id_rol: true } });
  if (!role) throw new Error("No se encontró el rol PROPIETARIO.");
  const passwordHash = await hashPassword(password);
  // Upsert sin actualización: tampoco restablece credenciales ante un seed concurrente.
  const user = await prisma.usuario.upsert({
    where: { nombre_usuario: username }, update: {},
    create: { nombre: name, nombre_usuario: username, password_hash: passwordHash, activo: true, id_rol: role.id_rol },
    select: { rol: { select: { nombre: true } } },
  });
  if (user.rol.nombre !== "PROPIETARIO") throw new Error("El usuario configurado pertenece a otra cuenta. No se modificó.");
  return "Propietario inicial verificado. No se modificaron cuentas existentes.";
}
