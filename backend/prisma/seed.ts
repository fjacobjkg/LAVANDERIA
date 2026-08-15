import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/lib/password.js";

async function main() {
  const adminRole = await prisma.rol.upsert({
    where: {
      nombre: "ADMIN",
    },

    update: {},

    create: {
      nombre: "ADMIN",
      descripcion: "Administrador del sistema",
    },
  });

  const passwordHash = await hashPassword("Admin123!");

  await prisma.usuario.upsert({
    where: {
      nombre_usuario: "admin",
    },

    update: {
      nombre: "Administrador",
      id_rol: adminRole.id_rol,
      password_hash: passwordHash,
      activo: true,
    },

    create: {
      nombre: "Administrador",
      nombre_usuario: "admin",
      password_hash: passwordHash,
      activo: true,
      id_rol: adminRole.id_rol,
    },
  });

  console.log("Seed completado.");
  console.log("Usuario: admin");
  console.log("Contraseña: Admin123!");
}

main()
  .catch((error) => {
    console.error("Error ejecutando seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });