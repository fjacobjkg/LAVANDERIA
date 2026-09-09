import { prisma } from "../../lib/prisma.js";

import {
  servicio_estado,
  type Prisma,
} from "../../../generated/prisma/client.js";

import {
  ServiceError,
} from "./service.errors.js";


type DeliveryServiceRecord =
  Prisma.servicioGetPayload<{
    include: {
      cliente: true;
    };
  }>;


function mapDeliveryService(
  service: DeliveryServiceRecord,
) {
  return {
    id:
      service.id_servicio,

    code:
      service.codigo_servicio,

    client:
      service.cliente?.nombre ??
      null,

    phone:
      service.cliente?.telefono ??
      null,

    garments:
      service.total_prendas,

    status:
      service.estado,

    receivedAt:
      service.fecha_recepcion,
  };
}


/*
 * Servicios disponibles para entrega.
 *
 * Solo aparecen aquellos que ya están
 * LISTA_PARA_RECOGER.
 */
export async function getDeliveryServiceOptions() {
  const services =
    await prisma.servicio.findMany({
      where: {
        estado:
          servicio_estado.LISTA_PARA_RECOGER,
      },

      include: {
        cliente: true,
      },

      orderBy: {
        fecha_actualizacion:
          "asc",
      },
    });


  return services.map(
    (service) => ({
      id:
        service.id_servicio,

      code:
        service.codigo_servicio,

      client:
        service.cliente?.nombre ??
        null,
    }),
  );
}


/*
 * Consultar información del
 * servicio seleccionado.
 */
export async function getDeliveryService(
  serviceId: number,
) {
  const service =
    await prisma.servicio.findUnique({
      where: {
        id_servicio:
          serviceId,
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


  if (
    service.estado !==
    servicio_estado.LISTA_PARA_RECOGER
  ) {
    throw new ServiceError(
      409,
      "El servicio no está disponible para entrega.",
    );
  }


  return mapDeliveryService(
    service,
  );
}


/*
 * Validación previa del QR.
 *
 * Esta operación NO entrega el servicio.
 */
export async function validateDeliveryQr(
  serviceId: number,
  qrToken: string,
) {
  const service =
    await prisma.servicio.findUnique({
      where: {
        id_servicio:
          serviceId,
      },
    });


  if (!service) {
    throw new ServiceError(
      404,
      "El servicio no existe.",
    );
  }


  if (
    service.estado !==
    servicio_estado.LISTA_PARA_RECOGER
  ) {
    throw new ServiceError(
      409,
      "El servicio no está disponible para entrega.",
    );
  }


  if (
    service.token_qr !==
    qrToken.trim()
  ) {
    throw new ServiceError(
      409,
      "El código QR no corresponde al servicio seleccionado.",
    );
  }


  return {
    valid: true,
  };
}


/*
 * Confirmar entrega.
 *
 * El backend vuelve a validar el QR
 * antes de cambiar el estado.
 */
export async function confirmServiceDelivery(
  serviceId: number,
  operatorId: number,
  qrToken: string,
) {
  return prisma.$transaction(
    async (transaction) => {

      /*
       * 1. Validar operador.
       */
      const operator =
        await transaction.usuario.findFirst({
          where: {
            id_usuario:
              operatorId,

            activo:
              true,
          },
        });


      if (!operator) {
        throw new ServiceError(
          403,
          "El usuario no está autorizado para confirmar entregas.",
        );
      }


      /*
       * 2. Consultar servicio.
       */
      const service =
        await transaction.servicio.findUnique({
          where: {
            id_servicio:
              serviceId,
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
       * 3. Comprobar estado.
       */
      if (
        service.estado !==
        servicio_estado.LISTA_PARA_RECOGER
      ) {
        throw new ServiceError(
          409,
          "El servicio no está disponible para entrega.",
        );
      }


      /*
       * 4. Comprobar nuevamente QR.
       */
      if (
        service.token_qr !==
        qrToken.trim()
      ) {
        throw new ServiceError(
          409,
          "El código QR no corresponde al servicio seleccionado.",
        );
      }


      const now =
        new Date();


      /*
       * 5. Confirmar entrega.
       */
      const updatedService =
        await transaction.servicio.update({
          where: {
            id_servicio:
              serviceId,
          },

          data: {
            estado:
              servicio_estado.ENTREGADA,

            fecha_entrega:
              now,

            fecha_actualizacion:
              now,
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
            "CONFIRMAR_ENTREGA",

          tabla_afectada:
            "servicio",

          id_registro:
            BigInt(
              updatedService.id_servicio,
            ),

          estado_anterior:
            "LISTA_PARA_RECOGER",

          estado_nuevo:
            "ENTREGADA",

          descripcion:
            `Entrega del servicio ${updatedService.codigo_servicio} confirmada mediante validación QR.`,
        },
      });


      return mapDeliveryService(
        updatedService,
      );
    },
  );
}