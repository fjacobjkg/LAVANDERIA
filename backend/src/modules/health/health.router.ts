import { Router } from "express";
import type { DatabaseProbe } from "./health.types.js";

async function checkWithTimeout(databaseProbe: DatabaseProbe, timeoutMilliseconds = 3_000): Promise<void> {
  let timeout: NodeJS.Timeout | undefined;

  try {
    await Promise.race([
      databaseProbe.check(),
      new Promise<never>((_resolve, reject) => {
        timeout = setTimeout(
          () => reject(new Error("La comprobación de MySQL excedió el tiempo permitido.")),
          timeoutMilliseconds,
        );
      }),
    ]);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
}

export function createHealthRouter(databaseProbe: DatabaseProbe): Router {
  const router = Router();

  router.get("/live", (_request, response) => {
    response.status(200).json({
      status: "ok",
      service: "lavanderia-api",
      timestamp: new Date().toISOString(),
    });
  });

  router.get("/ready", async (_request, response) => {
    try {
      await checkWithTimeout(databaseProbe);

      response.status(200).json({
        status: "ok",
        service: "lavanderia-api",
        services: {
          api: "ok",
          database: "ok",
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("La verificación de MySQL falló:", error);

      response.status(503).json({
        status: "error",
        service: "lavanderia-api",
        services: {
          api: "ok",
          database: "error",
        },
        timestamp: new Date().toISOString(),
        message: "La API está activa, pero MySQL no está disponible.",
      });
    }
  });

  return router;
}
