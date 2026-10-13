import { prisma } from "../../lib/prisma.js";
import { getSessionVersion } from "../../lib/session-version.js";
import { isActiveRole } from "../../lib/roles.js";

import {
 verifyPassword,
} from "../../lib/password.js";

import {
  signToken,
} from "../../lib/jwt.js";

interface LoginInput {
  username: string;
  password: string;
}

export async function login({
  username,
  password,
}: LoginInput) {
  const user =
    await prisma.usuario.findUnique({
      where: {
        nombre_usuario: username,
      },

      include: {
        rol: true,
      },
    });

  if (!user) {
  throw new Error(
    "INVALID_CREDENTIALS",
  );
}

if (
  user.nombre_usuario !== username
) {
  throw new Error(
    "INVALID_CREDENTIALS",
  );
}

if (!user.activo) {
  throw new Error(
    "USER_DISABLED",
  );
}

  const passwordIsValid =
    await verifyPassword(
      password,
      user.password_hash,
    );

  if (!passwordIsValid) {
    throw new Error(
      "INVALID_CREDENTIALS",
    );
  }

  if (!isActiveRole(user.rol.nombre)) throw new Error("ROLE_DISABLED");

  const token =
    signToken({
      sub: user.id_usuario,
      sessionVersion: getSessionVersion(user.password_hash),
      username:
        user.nombre_usuario,
      role:
        user.rol.nombre,
    });

  return {
    token,

    user: {
      id:
        user.id_usuario,

      name:
        user.nombre,

      username:
        user.nombre_usuario,

      role:
        user.rol.nombre,
    },
  };
}

export async function getAuthenticatedUser(
  userId: number,
) {
  const user =
    await prisma.usuario.findUnique({
      where: {
        id_usuario: userId,
      },

      include: {
        rol: true,
      },
    });

  if (!user || !user.activo || !isActiveRole(user.rol.nombre)) {
    throw new Error(
      "INVALID_SESSION",
    );
  }

  return {
    id:
      user.id_usuario,

    name:
      user.nombre,

    username:
      user.nombre_usuario,

    role:
      user.rol.nombre,
  };
}
