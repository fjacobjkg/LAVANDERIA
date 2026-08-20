import { randomBytes } from "node:crypto";

export function generateServiceCode(): string {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(
    now.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    now.getDate(),
  ).padStart(2, "0");

  const randomPart = randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `SRV-${year}${month}${day}-${randomPart}`;
}

export function generateQrToken(): string {
  return randomBytes(32).toString("base64url");
}

export function normalizeOptionalText(
  value?: string | null,
): string | null {
  const normalized = value?.trim();

  return normalized
    ? normalized
    : null;
}