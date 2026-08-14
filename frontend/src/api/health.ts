export type ServiceState = "ok" | "error";

export interface ReadinessResponse {
  status: ServiceState;
  service: string;
  services: {
    api: ServiceState;
    database: ServiceState;
  };
  timestamp: string;
  message?: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export async function getReadiness(signal?: AbortSignal): Promise<ReadinessResponse> {
  const response = await fetch(`${API_URL}/health/ready`, {
    headers: { Accept: "application/json" },
    signal,
  });

  const payload = (await response.json()) as ReadinessResponse;
  return payload;
}
