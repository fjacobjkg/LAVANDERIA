import type {
  CreateServiceRequest,
  CreateServiceResponse,
} from "../types/service.types";

import type {
  ServicePagination,
  ServiceStatus,
  ServiceStatusFilter,
  TrackingService,
} from "../types/service-tracking.types";


export async function createService(
  payload: CreateServiceRequest,
): Promise<CreateServiceResponse> {

 

  const response = await fetch(
  "/api/services",
  {
    method: "POST",

    credentials: "include",

    headers: {
      "Content-Type":
        "application/json",
    },

    body:
      JSON.stringify(payload),
  },
);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "No fue posible registrar el servicio.",
    );
  }

  return data;
}





interface ServiceApiResponse {
  id: number;
  code: string;
  client: string;
  phone: string | null;
  garments: number;
  status: ServiceStatus;
  receivedAt: string;
}

interface GetServicesApiResponse {
  services: ServiceApiResponse[];

  pagination: ServicePagination;
}

interface GetServicesParams {
  search?: string;

  status?: ServiceStatusFilter;

  page?: number;
}

export interface GetServicesResult {
  services: TrackingService[];

  pagination: ServicePagination;
}


function formatReceptionDate(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "es-GT",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",

      hour: "2-digit",
      minute: "2-digit",

      hour12: false,
    },
  ).format(
    new Date(date),
  );
}


export async function getServices(
  params: GetServicesParams = {},
): Promise<GetServicesResult> {
  const query =
    new URLSearchParams();

  const search =
    params.search?.trim();

  if (search) {
    query.set(
      "search",
      search,
    );
  }

  if (
    params.status &&
    params.status !== "ALL"
  ) {
    query.set(
      "status",
      params.status,
    );
  }

  query.set(
    "page",
    String(
      params.page ?? 1,
    ),
  );

  const response =
    await fetch(
      `/api/services?${query.toString()}`,
      {
        method: "GET",

        credentials:
          "include",
      },
    );

  if (!response.ok) {
    const data =
      await response
        .json()
        .catch(() => null);

    throw new Error(
      data?.message ??
        "No se pudieron consultar los servicios.",
    );
  }

  const data:
    GetServicesApiResponse =
      await response.json();

  return {
    services:
      data.services.map(
        (service) => ({
          id:
            service.id,

          code:
            service.code,

          client:
            service.client,

          phone:
            service.phone,

          garments:
            service.garments,

          status:
            service.status,

          receptionDate:
            formatReceptionDate(
              service.receivedAt,
            ),
        }),
      ),

    pagination:
      data.pagination,
  };
}