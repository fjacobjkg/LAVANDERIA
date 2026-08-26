import { prisma } from "../../lib/prisma.js";

import type {
  Prisma,
} from "../../../generated/prisma/client.js";

import type {
  ListServicesQuery,
} from "./service.schema.js";

import {
  SERVICES_PER_PAGE,
} from "./service.constants.js";

import {
  mapTrackingService,
} from "./service.mapper.js";


export async function getServices(
  filters: ListServicesQuery,
) {
  const search =
    filters.search?.trim();

  const page =
    filters.page;

  const skip =
    (page - 1) *
    SERVICES_PER_PAGE;


  const where:
    Prisma.servicioWhereInput = {};


  if (filters.status) {
    where.estado =
      filters.status;
  }


  if (search) {
    where.OR = [
      {
        codigo_servicio: {
          contains: search,
        },
      },

      {
        cliente: {
          is: {
            nombre: {
              contains: search,
            },
          },
        },
      },

      {
        cliente: {
          is: {
            telefono: {
              contains: search,
            },
          },
        },
      },
    ];
  }


  const [
    services,
    totalItems,
  ] = await prisma.$transaction([
    prisma.servicio.findMany({
      where,

      include: {
        cliente: true,
      },

      orderBy: {
        fecha_recepcion: "desc",
      },

      skip,

      take:
        SERVICES_PER_PAGE,
    }),

    prisma.servicio.count({
      where,
    }),
  ]);


  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalItems /
        SERVICES_PER_PAGE,
      ),
    );


  return {
    services:
      services.map(
        mapTrackingService,
      ),

    pagination: {
      page,

      pageSize:
        SERVICES_PER_PAGE,

      totalItems,

      totalPages,
    },
  };
}