import { prisma } from "../../lib/prisma.js";

export async function getActiveClients() {
  const clients =
    await prisma.cliente.findMany({
      where: {
        activo: true,
      },

      select: {
        id_cliente: true,
        nombre: true,
        telefono: true,
      },

      orderBy: {
        nombre: "asc",
      },
    });

  return clients.map((client) => ({
    id: client.id_cliente,
    name: client.nombre,
    phone: client.telefono,
  }));
}