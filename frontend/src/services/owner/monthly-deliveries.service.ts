import type { MonthlyDeliveriesResponse } from "../../types/monthly-deliveries.types";

export async function getMonthlyDeliveries(month: string, page: number, signal?: AbortSignal): Promise<MonthlyDeliveriesResponse> {
  const params = new URLSearchParams({ month, page: String(page) });
  const response = await fetch(`/api/owner/monthly-deliveries?${params}`, {
    credentials: "include", ...(signal ? { signal } : {}),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message ?? "No fue posible consultar las entregas mensuales.");
  return data as MonthlyDeliveriesResponse;
}
