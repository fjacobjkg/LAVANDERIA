import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMonthRange } from "./monthly.range.js";
import { getMonthlyDeliveries } from "./monthly.service.js";

const db = vi.hoisted(() => ({ servicio: { aggregate: vi.fn(), findMany: vi.fn() }, $transaction: vi.fn() }));
vi.mock("../../../lib/prisma.js", () => ({ prisma: db }));

describe("Consulta mensual", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    db.$transaction.mockImplementation(async (callback: (tx: typeof db) => unknown) => callback(db));
  });
  it.each([
    ["2026-10", "2026-10-01T06:00:00.000Z", "2026-11-01T06:00:00.000Z"],
    ["2026-12", "2026-12-01T06:00:00.000Z", "2027-01-01T06:00:00.000Z"],
    ["2024-02", "2024-02-01T06:00:00.000Z", "2024-03-01T06:00:00.000Z"],
  ])("rango Guatemala %s, incluido inicio y excluido siguiente mes", (month, start, end) => {
    expect(getMonthRange(month)).toEqual({ start: new Date(start), end: new Date(end) });
  });
  it("suma todo el período aunque la página contenga menos servicios", async () => {
    db.servicio.aggregate.mockResolvedValue({ _count: 21, _sum: { total_prendas: 230 } });
    db.servicio.findMany.mockResolvedValue([{
      id_servicio: 21, codigo_servicio: "TEST-21", total_prendas: 5, cliente: null,
      fecha_recepcion: new Date("2026-10-01T08:00:00Z"), fecha_entrega: new Date("2026-10-12T18:00:00Z"),
    }]);
    const result = await getMonthlyDeliveries("2026-10", 3);
    expect(result.summary).toEqual({ deliveredServices: 21, totalGarments: 230 });
    expect(result.pagination).toEqual({ currentPage: 3, totalPages: 3, totalItems: 21 });
    expect(result.deliveries).toHaveLength(1);
    expect(db.servicio.findMany.mock.calls[0]![0]).toMatchObject({
      skip: 20, take: 10,
      where: { estado: "ENTREGADA", fecha_entrega: { gte: new Date("2026-10-01T06:00:00Z"), lt: new Date("2026-11-01T06:00:00Z") } },
    });
    expect(db.servicio.aggregate.mock.calls[0]![0].where).toEqual(db.servicio.findMany.mock.calls[0]![0].where);
  });
  it("devuelve estado vacío y ajusta páginas inexistentes", async () => {
    db.servicio.aggregate.mockResolvedValue({ _count: 0, _sum: { total_prendas: null } });
    db.servicio.findMany.mockResolvedValue([]);
    const result = await getMonthlyDeliveries("2026-11", 999);
    expect(result.summary).toEqual({ deliveredServices: 0, totalGarments: 0 });
    expect(result.pagination).toEqual({ currentPage: 1, totalPages: 1, totalItems: 0 });
    expect(result.deliveries).toEqual([]);
  });
});
