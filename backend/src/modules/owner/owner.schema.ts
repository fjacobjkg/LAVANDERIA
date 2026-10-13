import { z } from "zod";

export const monthlyDeliveriesQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "El mes debe utilizar el formato YYYY-MM.")
    .refine((value) => Number(value.slice(0, 4)) >= 1000 && Number(value.slice(0, 4)) <= 9998, "El año debe estar entre 1000 y 9998."),
  page: z.coerce.number().int().positive().max(1_000_000).default(1),
});
