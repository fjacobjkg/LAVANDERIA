import type { Client } from "../types/service.types";

interface ClientsResponse {
  clients: Client[];
}

export async function getClients(): Promise<Client[]> {


  const response = await fetch(
  "http://localhost:3000/api/clients",
  {
    credentials: "include",
  },
);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "No fue posible obtener los clientes.",
    );
  }

  return (data as ClientsResponse).clients;
}