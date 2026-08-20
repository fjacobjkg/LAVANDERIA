import { prisma } from "../../lib/prisma.js";

import { ServiceError } from "./service.errors.js";

import type {
  CreateServiceInput,
} from "./service.schema.js";

import {
  generateQrToken,
  generateServiceCode,
  normalizeOptionalText,
} from "./service.utils.js";

export async function registerService(
  input: CreateServiceInput,
  operatorId: number,
) {
  return prisma.$transaction(
    async (transaction) => {

      /*
       * 1. Comprobar que el operador
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
        throw new ServiceError(
          403,
          "El usuario no está autorizado para registrar servicios.",
        );
      }


      /*
       * 2. Resolver cliente.
       *
       * Puede existir:
       * - cliente registrado
       * - cliente nuevo
       * - ningún cliente
       */
      let clientId: number | null =
        input.idCliente ?? null;


      if (clientId) {
        const existingClient =
          await transaction.cliente.findFirst({
            where: {
              id_cliente: clientId,
              activo: true,
            },
          });

        if (!existingClient) {
          throw new ServiceError(
            404,
            "El cliente seleccionado no existe o está inactivo.",
          );
        }
      }


      if (!clientId && input.clienteNuevo) {
        const newClient =
          await transaction.cliente.create({
            data: {
              nombre: input.clienteNuevo.nombre,

              telefono: normalizeOptionalText(
                input.clienteNuevo.telefono,
              ),
            },
          });

        clientId = newClient.id_cliente;
      }


      /*
       * 3. Crear servicio.
       *
       * RECIBIDA se obtiene del
       * valor default de MySQL/Prisma.
       */
      const service =
        await transaction.servicio.create({
          data: {
            id_cliente: clientId,

            id_operador: operatorId,

            codigo_servicio:
              generateServiceCode(),

            token_qr:
              generateQrToken(),

            total_prendas:
              input.totalPrendas,

            observaciones:
              normalizeOptionalText(
                input.observaciones,
              ),
          },

          include: {
            cliente: true,
          },
        });


      /*
       * 4. Registrar trazabilidad.
       */
      await transaction.bitacora.create({
        data: {
          id_usuario: operatorId,

          id_servicio:
            service.id_servicio,

          accion:
            "CREAR_SERVICIO",

          tabla_afectada:
            "servicio",

          id_registro:
            BigInt(service.id_servicio),

          estado_nuevo:
            "RECIBIDA",

          descripcion:
            `Servicio ${service.codigo_servicio} registrado.`,
        },
      });


      /*
       * 5. Respuesta.
       *
       * No devolvemos la bitácora porque
       * contiene BigInt y no la necesita
       * el frontend.
       */
      return {
        id: service.id_servicio,

        code:
          service.codigo_servicio,

        qrToken:
          service.token_qr,

        totalGarments:
          service.total_prendas,

        status:
          service.estado,

        observations:
          service.observaciones,

        receivedAt:
          service.fecha_recepcion,

        client: service.cliente
          ? {
              id:
                service.cliente.id_cliente,

              name:
                service.cliente.nombre,

              phone:
                service.cliente.telefono,
            }
          : null,
      };
    },
  );
}