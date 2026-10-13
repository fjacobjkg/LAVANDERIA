import { prisma } from "../../lib/prisma.js";

import {
  servicio_estado,
} from "../../../generated/prisma/client.js";

import {
  ServiceError,
} from "./service.errors.js";



function mapServiceLabel(
  service: {
    id_servicio: number;
    codigo_servicio: string;
    token_qr: string;
    total_prendas: number;
    estado: servicio_estado;
    fecha_recepcion: Date;
    qr_impreso: boolean;
    fecha_ultima_impresion_qr: Date | null;

    cliente: {
      nombre: string;
    } | null;
  },
) {
  return {
    id:
      service.id_servicio,

    code:
      service.codigo_servicio,

    qrToken:
      service.token_qr,

    client:
      service.cliente?.nombre ??
      null,

    garments:
      service.total_prendas,

    status:
      service.estado,

    receivedAt:
      service.fecha_recepcion,

    qrPrinted:
      service.qr_impreso,

    lastQrPrintAt:
      service.fecha_ultima_impresion_qr,
  };
}


export async function getServicesForLabel() {
  const services =
    await prisma.servicio.findMany({
      where: {
        estado: {
          in: [
            servicio_estado.RECIBIDA,
            servicio_estado.EN_PROCESO,
            servicio_estado.LISTA_PARA_RECOGER,
          ],
        },
      },

      include: {
        cliente: true,
      },

      orderBy: {
        fecha_recepcion:
          "desc",
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


export async function getServiceLabel(
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
    service.estado ===
    servicio_estado.ENTREGADA
  ) {
    throw new ServiceError(
      409,
      "No se puede gestionar la etiqueta de un servicio entregado.",
    );
  }


  return {
    id:
      service.id_servicio,

    code:
      service.codigo_servicio,

    qrToken:
      service.token_qr,

    client:
      service.cliente?.nombre ??
      null,

    garments:
      service.total_prendas,

    status:
      service.estado,

    receivedAt:
      service.fecha_recepcion,

    qrPrinted:
      service.qr_impreso,

    lastQrPrintAt:
      service.fecha_ultima_impresion_qr,
  };
}

export async function confirmServiceLabelPrint(
  serviceId: number,
  operatorId: number,
) {
  return prisma.$transaction(
    async (transaction) => {

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
          "El usuario no está autorizado para confirmar impresiones.",
        );
      }


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
      
      if (
        service.estado ===
        servicio_estado.ENTREGADA
      ) {
        throw new ServiceError(
          409,
          "No se puede imprimir la etiqueta de un servicio entregado.",
        );
      }

      const wasPrinted =
        service.qr_impreso;


      const printedAt =
        new Date();


      const updatedService =
        await transaction.servicio.update({
          where: {
            id_servicio:
              serviceId,
          },

          data: {
            qr_impreso:
              true,

            fecha_ultima_impresion_qr:
              printedAt,
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
            updatedService.id_servicio,

          accion:
            wasPrinted
              ? "REIMPRIMIR_ETIQUETA_QR"
              : "IMPRIMIR_ETIQUETA_QR",

          tabla_afectada:
            "servicio",

          id_registro:
            BigInt(
              updatedService.id_servicio,
            ),

          descripcion:
            wasPrinted
              ? `Etiqueta QR del servicio ${updatedService.codigo_servicio} reimpresa.`
              : `Etiqueta QR del servicio ${updatedService.codigo_servicio} impresa.`,
        },
      });


      return mapServiceLabel(
        updatedService,
      );
    },
  );
}