import type { RequestHandler } from "express";
import { monthlyDeliveriesQuerySchema } from "../owner.schema.js";
import { getMonthlyDeliveries } from "./monthly.service.js";

export const getMonthlyDeliveriesController: RequestHandler = async (request, response, next) => {
  const parsed = monthlyDeliveriesQuerySchema.safeParse(request.query);
  if (!parsed.success) {
    response.status(400).json({ message: parsed.error.issues[0]?.message ?? "Los parámetros de consulta no son válidos." });
    return;
  }
  try { response.json(await getMonthlyDeliveries(parsed.data.month, parsed.data.page)); }
  catch (error) { next(error); }
};
