import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { clientRouter } from "./modules/client/client.routes.js";
import { serviceRouter } from "./modules/service/service.routes.js";
import {
  historyControlRouter,
} from "./modules/history-control/history-control.routes.js";

export function createApp(): Express {
  const app = express();

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
      name: "API Lavanderia ",
      version: "0.1.0",
    });
  });

  app.use("/api/auth", authRouter);
  
  app.use("/api/clients", clientRouter);
  app.use("/api/services", serviceRouter);
  app.use(
  "/api/history-control",
  historyControlRouter,
  );

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}