import { prisma } from "../../../lib/prisma.js";
import { getMonthRange } from "./monthly.range.js";

const DELIVERIES_PER_PAGE = 10;

export async function getMonthlyDeliveries(month: string, page: number) {
  const { start, end } = getMonthRange(month);
  const where = { estado: "ENTREGADA" as const, fecha_entrega: { gte: start, lt: end } };
  return prisma.$transaction(async (tx) => {
    const totals = await tx.servicio.aggregate({ where, _count: true, _sum: { total_prendas: true } });
    const totalItems = totals._count;
    const totalPages = Math.max(1, Math.ceil(totalItems / DELIVERIES_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const services = await tx.servicio.findMany({
      where, include: { cliente: true },
      orderBy: [{ fecha_entrega: "desc" }, { id_servicio: "desc" }],
      skip: (currentPage - 1) * DELIVERIES_PER_PAGE, take: DELIVERIES_PER_PAGE,
    });
    return {
      summary: { deliveredServices: totalItems, totalGarments: totals._sum.total_prendas ?? 0 },
      deliveries: services.map((service) => ({
        id: service.id_servicio, code: service.codigo_servicio,
        client: service.cliente?.nombre ?? null, phone: service.cliente?.telefono ?? null,
        garments: service.total_prendas, receivedAt: service.fecha_recepcion.toISOString(),
        deliveredAt: service.fecha_entrega!.toISOString(),
      })),
      pagination: { currentPage, totalPages, totalItems },
    };
  }, { isolationLevel: "RepeatableRead" });
}
