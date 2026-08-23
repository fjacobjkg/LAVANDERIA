import { prisma } from "../../lib/prisma.js";
import type { CreateClientInput } from "./client.schema.js";

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

export async function createClient(
  input: CreateClientInput,
  operatorId: number,
) {
  return prisma.$transaction(
    async (transaction) => {

      /*
       * Validar que el usuario de la sesión
       * continúa activo.
       */
      const operator =
        await transaction.usuario.findFirst({
          where: {
            id_usuario: operatorId,
            activo: true,
          },
        });

      if (!operator) {
        throw new Error(
          "OPERATOR_NOT_ALLOWED",
        );
      }


      /*
       * Crear cliente.
       */
      const client =
        await transaction.cliente.create({
          data: {
            nombre: input.name,
            telefono: input.phone,
          },
        });


      /*
       * Registrar acción en bitácora.
       */
      await transaction.bitacora.create({
        data: {
          id_usuario: operatorId,

          accion:
            "CREAR_CLIENTE",

          tabla_afectada:
            "cliente",

          id_registro:
            BigInt(
              client.id_cliente,
            ),

          descripcion:
            `Cliente ${client.nombre} registrado.`,
        },
      });


      return {
        id: client.id_cliente,
        name: client.nombre,
        phone: client.telefono,
      };
    },
  );
}