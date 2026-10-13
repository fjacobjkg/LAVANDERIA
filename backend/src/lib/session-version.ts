import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../config/env.js";

// No expone el hash de contraseña ni requiere persistir sesiones nuevas.
export function getSessionVersion(passwordHash: string): string {
  return createHmac("sha256", env.JWT_SECRET).update(`session:${passwordHash}`).digest("hex");
}
export function matchesSessionVersion(version: unknown, passwordHash: string): boolean {
  if (typeof version !== "string") return false;
  const actual = Buffer.from(version);
  const expected = Buffer.from(getSessionVersion(passwordHash));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
