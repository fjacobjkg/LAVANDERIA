import type {
  ServiceLabel,
  ServiceLabelOption,
} from "../../types/service-label.types";


interface LabelOptionsResponse {
  services:
    ServiceLabelOption[];
}


interface ServiceLabelResponse {
  service:
    ServiceLabel;
}


export async function getServiceLabelOptions():
Promise<ServiceLabelOption[]> {
  const response =
    await fetch(
      "/api/services/label-options",
      {
        method: "GET",

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
        "No se pudieron consultar los servicios.",
    );
  }


  const result =
    data as LabelOptionsResponse;


  return result.services;
}


export async function getServiceLabel(
  serviceId: number,
): Promise<ServiceLabel> {
  const response =
    await fetch(
      `/api/services/${serviceId}/label`,
      {
        method: "GET",

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
        "No se pudo consultar la etiqueta.",
    );
  }


  const result =
    data as ServiceLabelResponse;


  return result.service;
}