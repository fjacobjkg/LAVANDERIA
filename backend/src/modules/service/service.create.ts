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

import {
  mapRegisteredService,
} from "./service.mapper.js";


export async function registerService(
  input: CreateServiceInput,
  operatorId: number,
) {
  return prisma.$transaction(
    async (transaction) => {
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


      if (
        !clientId &&
        input.clienteNuevo
      ) {
        const newClient =
          await transaction.cliente.create({
            data: {
              nombre:
                input.clienteNuevo.nombre,

              telefono:
                normalizeOptionalText(
                  input.clienteNuevo.telefono,
                ),
            },
          });

        clientId =
          newClient.id_cliente;
      }


      const service =
        await transaction.servicio.create({
          data: {
            id_cliente:
              clientId,

            id_operador:
              operatorId,

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


      await transaction.bitacora.create({
        data: {
          id_usuario:
            operatorId,

          id_servicio:
            service.id_servicio,

          accion:
            "CREAR_SERVICIO",

          tabla_afectada:
            "servicio",

          id_registro:
            BigInt(
              service.id_servicio,
            ),

          estado_nuevo:
            "RECIBIDA",

          descripcion:
            `Servicio ${service.codigo_servicio} registrado.`,
        },
      });


      return mapRegisteredService(
        service,
      );
    },
  );
}