import { z } from "zod";

import {
  servicio_estado,
} from "../../../generated/prisma/client.js";

const phoneSchema = z
  .string()
  .trim()
  .regex(
    /^\d{8}$/,
    "El teléfono debe contener exactamente 8 dígitos.",
  );

const newClientSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1)
    .max(25),

  telefono:
    phoneSchema
      .nullable()
      .optional(),
});


export const createServiceSchema = z
  .object({
    idCliente: z
      .number()
      .int()
      .positive()
      .nullable()
      .optional(),

    clienteNuevo: newClientSchema
      .nullable()
      .optional(),

    totalPrendas: z
      .number()
      .int()
      .min(
        1,
        "Debe registrarse al menos una prenda.",
      )
      .max(
        100,
        "No pueden registrarse más de 100 prendas.",
      ),

    observaciones: z
      .string()
      .trim()
      .min(
        1,
        "Las observaciones son obligatorias.",
      )
      .max(
        150,
        "Las observaciones no pueden superar los 150 caracteres.",
      ),
  })
  .superRefine((data, context) => {
    if (data.idCliente && data.clienteNuevo) {
      context.addIssue({
        code: "custom",
        message:
          "No se puede seleccionar un cliente existente y crear uno nuevo al mismo tiempo.",
      });
    }
  });

export type CreateServiceInput =
  z.infer<typeof createServiceSchema>;


export const listServicesQuerySchema =
  z.object({
    search: z
      .string()
      .trim()
      .optional(),

    status: z
      .enum(servicio_estado)
      .optional(),

    page: z.coerce
      .number()
      .int()
      .min(1)
      .default(1),
  });

export type ListServicesQuery =
  z.infer<
    typeof listServicesQuerySchema
  >;

export const serviceIdParamsSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive(),
});

export const deliveryQrSchema =
  z.object({
    qrToken:
      z.string()
        .trim()
        .min(
          1,
          "El código QR es obligatorio.",
        )
        .max(
          100,
          "El código QR no es válido.",
        ),
  });


export type DeliveryQrInput =
  z.infer<
    typeof deliveryQrSchema
  >;

