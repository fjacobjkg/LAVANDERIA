import { prisma } from "../../lib/prisma.js";

import {
  servicio_estado,
} from "../../../generated/prisma/client.js";

import {
  ServiceError,
} from "./service.errors.js";

import {
  mapTrackingService,
} from "./service.mapper.js";


function resolveNextStatus(
  currentStatus: servicio_estado,
) {
  switch (currentStatus) {
    case servicio_estado.RECIBIDA:
      return servicio_estado.EN_PROCESO;

    case servicio_estado.EN_PROCESO:
      return servicio_estado.LISTA_PARA_RECOGER;

    case servicio_estado.LISTA_PARA_RECOGER:
      throw new ServiceError(
        409,
        "El servicio debe finalizarse desde Confirmar entrega.",
      );

    case servicio_estado.ENTREGADA:
      throw new ServiceError(
        409,
        "El servicio ya fue entregado.",
      );
  }
}

function getStatusLabel(
  status: servicio_estado,
) {
  switch (status) {
    case servicio_estado.RECIBIDA:
      return "Recepción";

    case servicio_estado.EN_PROCESO:
      return "En proceso";

    case servicio_estado.LISTA_PARA_RECOGER:
      return "Lista para recoger";

    case servicio_estado.ENTREGADA:
      return "Entregada";
  }
}


export async function advanceServiceStatus(
  serviceId: number,
  operatorId: number,
) {
  return prisma.$transaction(
    async (transaction) => {

      /*
       * 1. Validar operador.
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
          "El usuario no está autorizado para actualizar servicios.",
        );
      }


      /*
       * 2. Consultar servicio actual.
       */
      const service =
        await transaction.servicio.findUnique({
          where: {
            id_servicio: serviceId,
          },

          include: {
            cliente: true,
          },
        });

      if (!service) {
        throw new ServiceError(
          404,
          "El servicio no existe.",
        );
      }


      /*
       * 3. Determinar siguiente estado.
       *
       * Este módulo únicamente permite:
       *
       * RECIBIDA
       *     ↓
       * EN_PROCESO
       *     ↓
       * LISTA_PARA_RECOGER
       */
      const transition =
        service.estado ===
        servicio_estado.RECIBIDA
          ? {
              nextStatus:
                servicio_estado.EN_PROCESO,

              previousLabel:
                "Recepción",

              nextLabel:
                "En proceso",

              createNotification:
                false,
            }

          : service.estado ===
            servicio_estado.EN_PROCESO
            ? {
                nextStatus:
                  servicio_estado.LISTA_PARA_RECOGER,

                previousLabel:
                  "En proceso",

                nextLabel:
                  "Lista para recoger",

                createNotification:
                  true,
              }

            : null;


      /*
       * 4. Bloquear transiciones
       * que no pertenecen al módulo.
       */
      if (!transition) {

        if (
          service.estado ===
          servicio_estado.LISTA_PARA_RECOGER
        ) {
          throw new ServiceError(
            409,
            "El servicio está listo para recoger. La entrega debe confirmarse desde el módulo Confirmar entrega.",
          );
        }

        throw new ServiceError(
          409,
          "El servicio ya fue entregado.",
        );
      }


      /*
       * 5. Actualizar servicio.
       */
      const updatedService =
        await transaction.servicio.update({
          where: {
            id_servicio: serviceId,
          },

          data: {
            estado:
              transition.nextStatus,

            fecha_actualizacion:
              new Date(),
          },

          include: {
            cliente: true,
          },
        });


      /*
       * 6. Registrar trazabilidad.
       */
      await transaction.bitacora.create({
        data: {
          id_usuario:
            operatorId,

          id_servicio:
            updatedService.id_servicio,

          accion:
            "CAMBIAR_ESTADO_SERVICIO",

          tabla_afectada:
            "servicio",

          id_registro:
            BigInt(
              updatedService.id_servicio,
            ),

          estado_anterior:
            service.estado,

          estado_nuevo:
            transition.nextStatus,

          descripcion:
            `Servicio ${updatedService.codigo_servicio} actualizado de ${transition.previousLabel} a ${transition.nextLabel}.`,
        },
      });


      /*
       * 7. Preparar notificación.
       *
       * Se crea únicamente cuando:
       *
       * EN_PROCESO
       *     ↓
       * LISTA_PARA_RECOGER
       *
       * El envío real por WhatsApp
       * se implementará posteriormente.
       */
      if (
        transition.createNotification &&
        updatedService.cliente?.telefono
      ) {
        await transaction.notificacion.create({
          data: {
            id_servicio:
              updatedService.id_servicio,

            telefono_destino:
              updatedService.cliente.telefono,

            /*
             * estado_envio no es necesario
             * porque Prisma utiliza el
             * default PENDIENTE.
             */
            detalle_respuesta:
              "Pendiente de envío por WhatsApp.",
          },
        });
      }


      /*
       * 8. Respuesta.
       */
      return mapTrackingService(
        updatedService,
      );
    },
  );
}