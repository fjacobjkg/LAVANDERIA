import type {
  HistoryPagination,
  IncidentRecord,
  IncidentServiceOption,
  OperationHistoryRecord,
  RegisterIncidentInput,
} from "../types/history-control.types";


interface IncidentsResponse {
  incidents:
    IncidentRecord[];

  pagination:
    HistoryPagination;
}


interface ServiceHistoryResponse {
  history:
    OperationHistoryRecord[];

  pagination:
    HistoryPagination;
}


interface RegisterIncidentResponse {
  message: string;

  incident:
    IncidentRecord;
}


async function getErrorMessage(
  response: Response,
) {
  try {
    const body =
      await response.json() as {
        message?: string;
      };


    return (
      body.message ??
      "No fue posible completar la operación."
    );

  } catch {
    return "No fue posible completar la operación.";
  }
}


/* ========================================
   SERVICIOS DISPONIBLES
======================================== */

export async function getHistoryServiceOptions():
Promise<IncidentServiceOption[]> {

  const response =
    await fetch(
      "/api/history-control/service-options",
      {
        credentials:
          "include",
      },
    );


  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
      ),
    );
  }


  const data =
    await response.json() as {
      services:
        IncidentServiceOption[];
    };


  return data.services;
}


/* ========================================
   INCIDENTES
======================================== */

export async function getIncidents(
  page: number,
):
Promise<IncidentsResponse> {

  const response =
    await fetch(
      `/api/history-control/incidents?page=${page}`,
      {
        credentials:
          "include",
      },
    );


  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
      ),
    );
  }


  return (
    await response.json()
  ) as IncidentsResponse;
}


/* ========================================
   HISTORIAL POR SERVICIO
======================================== */

export async function getServiceHistory(
  serviceId: number,
  page: number,
):
Promise<ServiceHistoryResponse> {

  const response =
    await fetch(
      `/api/history-control/services/${serviceId}/history?page=${page}`,
      {
        credentials:
          "include",
      },
    );


  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
      ),
    );
  }


  return (
    await response.json()
  ) as ServiceHistoryResponse;
}


/* ========================================
   REGISTRAR INCIDENTE
======================================== */

export async function createIncident(
  input:
    RegisterIncidentInput,
):
Promise<RegisterIncidentResponse> {

  const response =
    await fetch(
      "/api/history-control/incidents",
      {
        method:
          "POST",

        credentials:
          "include",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            input,
          ),
      },
    );


  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
      ),
    );
  }


  return (
    await response.json()
  ) as RegisterIncidentResponse;
}