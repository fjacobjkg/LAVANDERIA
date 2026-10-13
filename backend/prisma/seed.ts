import { prisma } from "../src/lib/prisma.js";
import { ACTIVE_ROLES } from "../src/lib/roles.js";
import { seedInitialOwner } from "./bootstrap-owner.js";

async function main() {
  for (const role of ACTIVE_ROLES) {
    await prisma.rol.upsert({
      where: { nombre: role }, update: {},
      create: { nombre: role, descripcion: role === "PROPIETARIO" ? "Propietario de la lavandería" : "Operador de la lavandería" },
    });
  }
  // ADMIN/ADMINISTRADOR existentes se conservan y no se recrean.
  console.info(await seedInitialOwner());
  console.info("Seed completado correctamente.");
}

main().catch((error) => {
  console.error("Error ejecutando seed:", error instanceof Error ? error.message : "Error de configuración.");
  process.exitCode = 1;
}).finally(async () => { await prisma.$disconnect(); });
