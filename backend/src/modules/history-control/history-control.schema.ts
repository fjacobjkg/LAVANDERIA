import {
  z,
} from "zod";


export const historyPageQuerySchema =
  z.object({
    page:
      z.coerce
        .number()
        .int()
        .positive()
        .default(1),
  });


export const historyServiceParamsSchema =
  z.object({
    id:
      z.coerce
        .number()
        .int()
        .positive(),
  });


export const registerIncidentSchema =
  z.object({
    serviceId:
      z.number()
        .int()
        .positive(),

    type:
      z.enum([
        "QR_DAMAGED",
        "CORRECTION",
        "NO_CONTACT",
        "CANCELLATION",
        "OTHER",
      ]),

    reason:
      z.string()
        .trim()
        .min(
          1,
          "El motivo es obligatorio.",
        )
        .max(
          120,
          "El motivo no puede superar 120 caracteres.",
        ),

    detail:
      z.string()
        .trim()
        .min(
          1,
          "El detalle es obligatorio.",
        )
        .max(
          255,
          "El detalle no puede superar 255 caracteres.",
        ),
  });


export type RegisterIncidentInput =
  z.infer<
    typeof registerIncidentSchema
  >;