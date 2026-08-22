import type {
  CookieOptions,
  Request,
} from "express";

import { env } from "../../config/env.js";

export const AUTH_COOKIE_NAME =
  "lavanderia_session";

export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,

    secure:
      env.NODE_ENV === "production",

    sameSite: "lax",

    path: "/",

    maxAge:
      env.JWT_EXPIRES_IN * 1000,
  };
}

export function getClearAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,

    secure:
      env.NODE_ENV === "production",

    sameSite: "lax",

    path: "/",
  };
}

export function readAuthCookie(
  request: Request,
): string | null {
  const cookieHeader =
    request.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookies =
    cookieHeader.split(";");

  for (const cookie of cookies) {
    const [name, ...valueParts] =
      cookie.trim().split("=");

    if (name === AUTH_COOKIE_NAME) {
      const value =
        valueParts.join("=");

      return value
        ? decodeURIComponent(value)
        : null;
    }
  }

  return null;
}