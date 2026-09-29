import {
  prisma,
} from "../src/lib/prisma.js";

import {
  hashPassword,
} from "../src/lib/password.js";


const ALLOWED_ROLES =
  new Set([
    "ADMIN",
    "OPERADOR",
    "PROPIETARIO",
  ]);


function getArgument(
  name: string,
) {
  const prefix =
    `--${name}=`;


  const argument =
    process.argv.find(
      (item) =>
        item.startsWith(
          prefix,
        ),
    );


  return argument
    ?.slice(
      prefix.length,
    )
    .trim();
}


function validatePassword(
  password: string,
) {
  if (
    password.length < 10
  ) {
    throw new Error(
      "La contraseña debe tener al menos 10 caracteres.",
    );
  }


  if (
    !/[A-Z]/.test(
      password,
    )
  ) {
    throw new Error(
      "La contraseña debe contener una letra mayúscula.",
    );
  }


  if (
    !/[a-z]/.test(
      password,
    )
  ) {
    throw new Error(
      "La contraseña debe contener una letra minúscula.",
    );
  }


  if (
    !/[0-9]/.test(
      password,
    )
  ) {
    throw new Error(
      "La contraseña debe contener un número.",
    );
  }


  if (
    !/[^A-Za-z0-9]/.test(
      password,
    )
  ) {
    throw new Error(
      "La contraseña debe contener un carácter especial.",
    );
  }
}


async function main() {
  const name =
    getArgument(
      "name",
    );


  const username =
    getArgument(
      "username",
    );


  const roleName =
    getArgument(
      "role",
    )
      ?.toUpperCase();


  const password =
    process.env
      .NEW_USER_PASSWORD;


  if (
    !name ||
    !username ||
    !roleName
  ) {
    throw new Error(
      [
        "Faltan parámetros.",
        "",
        "Uso:",
        'npx tsx scripts/create-user.ts --name="Nombre" --username=usuario --role=OPERADOR',
      ].join("\n"),
    );
  }


  if (!password) {
    throw new Error(
      "La variable NEW_USER_PASSWORD es obligatoria.",
    );
  }


  if (
    !ALLOWED_ROLES.has(
      roleName,
    )
  ) {
    throw new Error(
      [
        `Rol no permitido: ${roleName}`,
        "",
        "Roles permitidos:",
        "ADMIN",
        "OPERADOR",
        "PROPIETARIO",
      ].join("\n"),
    );
  }


  validatePassword(
    password,
  );


  const existingUser =
    await prisma.usuario
      .findUnique({
        where: {
          nombre_usuario:
            username,
        },

        select: {
          id_usuario:
            true,
        },
      });


  if (existingUser) {
    throw new Error(
      `Ya existe el usuario "${username}".`,
    );
  }


  const role =
    await prisma.rol
      .findUnique({
        where: {
          nombre:
            roleName,
        },

        select: {
          id_rol:
            true,

          nombre:
            true,
        },
      });


  if (!role) {
    throw new Error(
      `El rol "${roleName}" no existe. Ejecuta primero el seed.`,
    );
  }


  const passwordHash =
    await hashPassword(
      password,
    );


  const user =
    await prisma.usuario
      .create({
        data: {
          nombre:
            name,

          nombre_usuario:
            username,

          password_hash:
            passwordHash,

          activo:
            true,

          id_rol:
            role.id_rol,
        },

        select: {
          id_usuario:
            true,

          nombre:
            true,

          nombre_usuario:
            true,

          activo:
            true,
        },
      });


  console.log(
    "Usuario creado correctamente.",
  );


  console.log({
    id:
      user.id_usuario,

    nombre:
      user.nombre,

    usuario:
      user.nombre_usuario,

    rol:
      role.nombre,

    activo:
      user.activo,
  });
}


main()
  .catch(
    (error) => {
      console.error(
        "Error creando usuario:",
        error instanceof Error
          ? error.message
          : error,
      );

      process.exit(
        1,
      );
    },
  )
  .finally(
    async () => {
      await prisma
        .$disconnect();
    },
  );