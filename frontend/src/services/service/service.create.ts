import type {
  CreateServiceRequest,
  CreateServiceResponse,
} from "../../types/service.types";


export async function createService(
  payload: CreateServiceRequest,
): Promise<CreateServiceResponse> {
  const response =
    await fetch(
      "/api/services",
      {
        method: "POST",

        credentials:
          "include",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(
            payload,
          ),
      },
    );


  const data =
    await response.json();


  if (!response.ok) {
    throw new Error(
      data.message ??
        "No fue posible registrar el servicio.",
    );
  }


  return data;
}