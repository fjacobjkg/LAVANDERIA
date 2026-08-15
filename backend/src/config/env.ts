import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  PORT: z.coerce.number().int().positive().max(65_535).default(3000),

  CORS_ORIGIN: z.string().url().default("http://localhost:5173"),

  DATABASE_HOST: z.string().min(1).default("localhost"),
  DATABASE_PORT: z.coerce.number().int().positive().max(65_535).default(3306),
  DATABASE_USER: z.string().min(1).default("lavanderia_app"),
  DATABASE_PASSWORD: z.string().min(1).default("lavanderia_dev"),
  DATABASE_NAME: z.string().min(1).default("lavanderia"),

  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.coerce.number().int().positive().default(3600),
});

const parsedEnvironment = environmentSchema.safeParse(process.env);

if (!parsedEnvironment.success) {
  console.error(
    "La configuración del entorno no es válida:",
    parsedEnvironment.error.flatten().fieldErrors
  );

  throw new Error("Configuración de entorno inválida.");
}

export const env = parsedEnvironment.data;