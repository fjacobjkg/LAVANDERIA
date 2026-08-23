import { z } from "zod";

const alphabeticNameRegex =
  /^[\p{L}]+(?:\s+[\p{L}]+)*$/u;

export const createClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "El nombre debe contener al menos 2 caracteres.",
    )
    .max(
      25,
      "El nombre no puede superar los 25 caracteres.",
    )
    .regex(
      alphabeticNameRegex,
      "El nombre solo puede contener letras y espacios.",
    ),

  phone: z
    .string()
    .trim()
    .regex(
      /^\d{8}$/,
      "El teléfono debe contener exactamente 8 dígitos.",
    ),
});

export type CreateClientInput =
  z.infer<typeof createClientSchema>;