import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { createHealthRouter } from "./modules/health/health.router.js";
import { prismaDatabaseProbe } from "./modules/health/prisma-database.probe.js";
import type { DatabaseProbe } from "./modules/health/health.types.js";

interface AppDependencies {
  databaseProbe?: DatabaseProbe;
}

export function createApp(dependencies: AppDependencies = {}): Express {
  const app = express();
  const databaseProbe = dependencies.databaseProbe ?? prismaDatabaseProbe;

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api", (_request, response) => {
    response.status(200).json({
      name: "API Lavanderia Sol y Espuma",
      version: "0.1.0",
      documentation: "/api/health/live",
    });
  });
  app.use("/api/health", createHealthRouter(databaseProbe));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

