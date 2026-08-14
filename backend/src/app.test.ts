import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import type { DatabaseProbe } from "./modules/health/health.types.js";

describe("endpoints de salud", () => {
  it("confirma que la API esta activa", async () => {
    const response = await request(createApp()).get("/api/health/live");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "ok",
      service: "lavanderia-api",
    });
  });

  it("confirma que la API y la base de datos estan listas", async () => {
    const databaseProbe: DatabaseProbe = {
      check: async () => undefined,
    };

    const response = await request(createApp({ databaseProbe })).get("/api/health/ready");

    expect(response.status).toBe(200);
    expect(response.body.services).toEqual({ api: "ok", database: "ok" });
  });

  it("responde 503 cuando MySQL no esta disponible", async () => {
    const databaseProbe: DatabaseProbe = {
      check: async () => {
        throw new Error("MySQL no disponible");
      },
    };

    const response = await request(createApp({ databaseProbe })).get("/api/health/ready");

    expect(response.status).toBe(503);
    expect(response.body.services).toEqual({ api: "ok", database: "error" });
  });

  it("devuelve JSON para rutas inexistentes", async () => {
    const response = await request(createApp()).get("/api/no-existe");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe("error");
  });
});

