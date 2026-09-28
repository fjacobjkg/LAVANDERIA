import {
  prisma,
} from "../../lib/prisma.js";

import {
  INCIDENTS_PER_PAGE,
} from "./history-control.constants.js";

import {
  HistoryControlError,
} from "./history-control.errors.js";

import {
  mapIncidentApiType,
  mapIncidentDatabaseType,
} from "./history-control.mapper.js";

import type {
  RegisterIncidentInput,
} from "./history-control.schema.js";


export async function getIncidentServiceOptions() {
  const services =
    await prisma.servicio.findMany({
      orderBy: {
        fecha_recepcion:
          "desc",
      },

      select: {
        id_servicio:
          true,

        codigo_servicio:
          true,
      },
    });


  return services.map(
    (service) => ({
      id:
        service.id_servicio,

      code:
        service.codigo_servicio,
    }),
  );
}


export async function getIncidents(
  page: number,
) {
  const skip =
    (page - 1) *
    INCIDENTS_PER_PAGE;


  const [
    totalItems,
    incidents,
  ] =
    await prisma.$transaction([
      prisma.incidente.count(),

      prisma.incidente.findMany({
        orderBy: {
          fecha:
            "desc",
        },

        skip,

        take:
          INCIDENTS_PER_PAGE,

        include: {
          servicio: {
            select: {
              codigo_servicio:
                true,
            },
          },

          usuario: {
            select: {
              nombre:
                true,
            },
          },
        },
      }),
    ]);


  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalItems /
        INCIDENTS_PER_PAGE,
      ),
    );


  /*
   * Si desde el navegador llega una
   * página que ya no existe.
   */
  if (
    page > totalPages &&
    totalItems > 0
  ) {
    throw new HistoryControlError(
      "La página solicitada no existe.",
      400,
    );
  }


  return {
    incidents:
      incidents.map(
        (incident) => ({
          id:
            Number(
              incident.id_incidente,
            ),

          serviceId:
            incident.id_servicio,

          serviceCode:
            incident.servicio
              .codigo_servicio,

          type:
            mapIncidentApiType(
              incident.tipo,
            ),

          reason:
            incident.motivo,

          detail:
            incident.detalle,

          occurredAt:
            incident.fecha,

          responsible:
            incident.usuario
              ?.nombre ??
            "Sistema",
        }),
      ),

    pagination: {
      currentPage:
        page,

      totalPages,

      totalItems,
    },
  };
}


export async function registerIncident(
  input:
    RegisterIncidentInput,

  operatorId:
    number,
) {
  const databaseType =
    mapIncidentDatabaseType(
      input.type,
    );


  if (!databaseType) {
    throw new HistoryControlError(
      "El tipo de incidente no es válido.",
      400,
    );
  }


  return prisma.$transaction(
    async (transaction) => {

      const operator =
        await transaction.usuario
          .findFirst({
            where: {
              id_usuario:
                operatorId,

              activo:
                true,
            },

            select: {
              id_usuario:
                true,

              nombre:
                true,
            },
          });


      if (!operator) {
        throw new HistoryControlError(
          "El usuario autenticado no es válido.",
          401,
        );
      }


      const service =
        await transaction.servicio
          .findUnique({
            where: {
              id_servicio:
                input.serviceId,
            },

            select: {
              id_servicio:
                true,

              codigo_servicio:
                true,
            },
          });


      if (!service) {
        throw new HistoryControlError(
          "El servicio seleccionado no existe.",
          404,
        );
      }


      const incident =
        await transaction.incidente
          .create({
            data: {
              id_servicio:
                service.id_servicio,

              id_usuario:
                operator.id_usuario,

              tipo:
                databaseType,

              motivo:
                input.reason,

              detalle:
                input.detail,
            },
          });


      /*
       * Todo incidente también forma
       * parte de la trazabilidad
       * del servicio.
       */
      await transaction.bitacora
        .create({
          data: {
            id_usuario:
              operator.id_usuario,

            id_servicio:
              service.id_servicio,

            accion:
              "REGISTRAR_INCIDENTE",

            tabla_afectada:
              "incidente",

            id_registro:
              incident.id_incidente,

            descripcion:
              `${input.reason}: ${input.detail}`,
          },
        });


      return {
        id:
          Number(
            incident.id_incidente,
          ),

        serviceId:
          service.id_servicio,

        serviceCode:
          service.codigo_servicio,

        type:
          input.type,

        reason:
          input.reason,

        detail:
          input.detail,

        occurredAt:
          incident.fecha,

        responsible:
          operator.nombre,
      };
    },
  );
}