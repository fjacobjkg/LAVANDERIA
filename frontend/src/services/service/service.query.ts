import type {
  ServicePagination,
  ServiceStatusFilter,
  TrackingService,
} from "../../types/service-tracking.types";

import {
  mapTrackingService,
  type ServiceApiResponse,
} from "./service.mapper";


interface GetServicesApiResponse {
  services:
    ServiceApiResponse[];

  pagination:
    ServicePagination;
}


export interface GetServicesParams {
  search?: string;

  status?:
    ServiceStatusFilter;

  page?: number;
}


export interface GetServicesResult {
  services:
    TrackingService[];

  pagination:
    ServicePagination;
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
        mapTrackingService,
      ),

    pagination:
      data.pagination,
  };
}