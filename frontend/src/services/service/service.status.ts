import type {
  TrackingService,
} from "../../types/service-tracking.types";

import {
  mapTrackingService,
  type ServiceApiResponse,
} from "./service.mapper";


interface AdvanceServiceStatusResponse {
  message: string;

  service:
    ServiceApiResponse;
}


export async function advanceServiceStatus(
  serviceId: number,
): Promise<TrackingService> {
  const response =
    await fetch(
      `/api/services/${serviceId}/next-status`,
      {
        method: "PATCH",

        credentials:
          "include",
      },
    );


  const data =
    await response
      .json()
      .catch(() => null);


  if (!response.ok) {
    throw new Error(
      data?.message ??
        "No se pudo actualizar el estado del servicio.",
    );
  }


  const result =
    data as AdvanceServiceStatusResponse;


  return mapTrackingService(
    result.service,
  );
}