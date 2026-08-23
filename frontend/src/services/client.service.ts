import type { Client } from "../types/service.types";

interface ClientsResponse {
  clients: Client[];
}

interface CreateClientResponse {
  message: string;
  client: Client;
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

export async function createClient(
  name: string,
  phone: string,
): Promise<Client> {

  const response = await fetch(
    "http://localhost:3000/api/clients",
    {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify({
          name,
          phone,
        }),
    },
  );


  const data =
    await response.json();


  if (!response.ok) {
    throw new Error(
      data.message ??
        "No fue posible registrar el cliente.",
    );
  }


  return (
    data as CreateClientResponse
  ).client;
}