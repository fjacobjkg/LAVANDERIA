import {
  prisma,
} from "../../lib/prisma.js";

import {
  HISTORY_PER_PAGE,
} from "./history-control.constants.js";

import {
  HistoryControlError,
} from "./history-control.errors.js";

import {
  getActionTitle,
  getHistoryDescription,
} from "./history-control.mapper.js";


export async function getServiceHistory(
  serviceId: number,
  page: number,
) {
  const service =
    await prisma.servicio
      .findUnique({
        where: {
          id_servicio:
            serviceId,
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


  const skip =
    (page - 1) *
    HISTORY_PER_PAGE;


  const [
    totalItems,
    records,
  ] =
    await prisma.$transaction([
      prisma.bitacora.count({
        where: {
          id_servicio:
            serviceId,
        },
      }),

      prisma.bitacora.findMany({
        where: {
          id_servicio:
            serviceId,
        },

        orderBy: {
          fecha:
            "desc",
        },

        skip,

        take:
          HISTORY_PER_PAGE,

        select: {
          id_bitacora:
            true,

          id_usuario:
            true,

          accion:
            true,

          descripcion:
            true,

          estado_anterior:
            true,

          estado_nuevo:
            true,

          fecha:
            true,
        },
      }),
    ]);


  const userIds =
    [
      ...new Set(
        records
          .map(
            (record) =>
              record.id_usuario,
          )
          .filter(
            (
              id,
            ): id is number =>
              id !== null,
          ),
      ),
    ];


  const users =
    userIds.length > 0
      ? await prisma.usuario.findMany({
          where: {
            id_usuario: {
              in:
                userIds,
            },
          },

          select: {
            id_usuario:
              true,

            nombre:
              true,
          },
        })
      : [];


  const userNames =
    new Map(
      users.map(
        (user) => [
          user.id_usuario,
          user.nombre,
        ],
      ),
    );


  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalItems /
        HISTORY_PER_PAGE,
      ),
    );


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
    service: {
      id:
        service.id_servicio,

      code:
        service.codigo_servicio,
    },

    history:
      records.map(
        (record) => ({
          id:
            Number(
              record.id_bitacora,
            ),

          serviceId:
            service.id_servicio,

          occurredAt:
            record.fecha,

          title:
            getActionTitle(
              record.accion,
            ),

          description:
            getHistoryDescription(
              record,
            ),

          responsible:
            record.id_usuario
              ? (
                  userNames.get(
                    record.id_usuario,
                  ) ??
                  "Usuario"
                )
              : "Sistema",
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