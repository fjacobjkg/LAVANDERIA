import type {
  Prisma,
} from "../../../generated/prisma/client.js";

type ServiceWithClient =
  Prisma.servicioGetPayload<{
    include: {
      cliente: true;
    };
  }>;


export function mapTrackingService(
  service: ServiceWithClient,
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

    observations:
      service.observaciones,

    receivedAt:
      service.fecha_recepcion,
  };
}


export function mapRegisteredService(
  service: ServiceWithClient,
) {
  return {
    id:
      service.id_servicio,

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

    client:
      service.cliente
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
}