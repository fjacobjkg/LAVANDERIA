import { prisma } from "../../lib/prisma.js";

import { ServiceError } from "./service.errors.js";

import type {
  CreateServiceInput,
  ListServicesQuery,
} from "./service.schema.js";

import {
  generateQrToken,
  generateServiceCode,
  normalizeOptionalText,
} from "./service.utils.js";

import {
  servicio_estado,
  type Prisma,
} from "../../../generated/prisma/client.js";

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

const SERVICES_PER_PAGE = 10;

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


  /*
   * Filtrar por estado.
   */
  if (filters.status) {
    where.estado =
      filters.status as servicio_estado;
  }


  /*
   * Buscar por:
   * - código
   * - cliente
   * - teléfono
   */
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


  /*
   * Ejecutamos:
   *
   * 1. Consulta de los 10 servicios.
   * 2. Conteo total con el mismo filtro.
   */
  const [
    services,
    totalItems,
  ] =
    await prisma.$transaction([
      prisma.servicio.findMany({
        where,

        include: {
          cliente: true,
        },

        orderBy: {
          fecha_recepcion:
            "desc",
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
        (service) => ({
          id:
            service.id_servicio,

          code:
            service.codigo_servicio,

          client:
            service.cliente
              ?.nombre ??
            "Sin cliente",

          phone:
            service.cliente
              ?.telefono ??
            null,

          garments:
            service.total_prendas,

          status:
            service.estado,

          receivedAt:
            service.fecha_recepcion,
        }),
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