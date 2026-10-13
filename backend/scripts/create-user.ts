import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/lib/password.js";
import { ACTIVE_ROLES, isActiveRole } from "../src/lib/roles.js";
import { validatePasswordPolicy } from "../src/lib/password-policy.js";

function getArgument(name: string) {
  const prefix = `--${name}=`;
  return process.argv.find((item) => item.startsWith(prefix))?.slice(prefix.length).trim();
}

async function main() {
  const name = getArgument("name");
  const username = getArgument("username");
  const roleName = getArgument("role")?.toUpperCase();
  if (!name || !username || !roleName) {
    throw new Error('Uso: npx tsx scripts/create-user.ts --name="Nombre" --username=usuario --role=OPERADOR');
  }
  if (!isActiveRole(roleName)) throw new Error(`Rol no permitido. Roles disponibles: ${ACTIVE_ROLES.join(", ")}.`);
  if (name.length > 100 || username.length > 50) throw new Error("El nombre admite 100 caracteres y el usuario 50.");
  const password = process.env.NEW_USER_PASSWORD;
  if (!password) throw new Error("La variable NEW_USER_PASSWORD es obligatoria.");
  validatePasswordPolicy(password);
  if (await prisma.usuario.findUnique({ where: { nombre_usuario: username }, select: { id_usuario: true } })) {
    throw new Error("El nombre de usuario ya existe.");
  }
  const role = await prisma.rol.findUnique({ where: { nombre: roleName }, select: { id_rol: true } });
  if (!role) throw new Error("El rol no existe. Ejecuta primero el seed.");
  const user = await prisma.usuario.create({
    data: { nombre: name, nombre_usuario: username, password_hash: await hashPassword(password), activo: true, id_rol: role.id_rol },
    select: { id_usuario: true, nombre: true, nombre_usuario: true, activo: true },
  });
  console.info("Usuario creado correctamente.", { id: user.id_usuario, nombre: user.nombre, usuario: user.nombre_usuario, rol: roleName, activo: user.activo });
}

main().catch((error) => {
  console.error("Error creando usuario:", error instanceof Error ? error.message : "No fue posible crear la cuenta.");
  process.exitCode = 1;
}).finally(async () => { await prisma.$disconnect(); });
