import {
  prisma,
} from "../src/lib/prisma.js";

import {
  hashPassword,
} from "../src/lib/password.js";


const SYSTEM_ROLES = [
  {
    nombre:
      "ADMIN",

    descripcion:
      "Administrador del sistema",
  },

  {
    nombre:
      "OPERADOR",

    descripcion:
      "Operador de la lavandería",
  },

  {
    nombre:
      "PROPIETARIO",

    descripcion:
      "Propietario de la lavandería",
  },
];


function validatePassword(
  password: string,
) {
  if (
    password.length < 10
  ) {
    throw new Error(
      "La contraseña inicial debe tener al menos 10 caracteres.",
    );
  }


  if (
    !/[A-Z]/.test(
      password,
    )
  ) {
    throw new Error(
      "La contraseña inicial debe contener una letra mayúscula.",
    );
  }


  if (
    !/[a-z]/.test(
      password,
    )
  ) {
    throw new Error(
      "La contraseña inicial debe contener una letra minúscula.",
    );
  }


  if (
    !/[0-9]/.test(
      password,
    )
  ) {
    throw new Error(
      "La contraseña inicial debe contener un número.",
    );
  }


  if (
    !/[^A-Za-z0-9]/.test(
      password,
    )
  ) {
    throw new Error(
      "La contraseña inicial debe contener un carácter especial.",
    );
  }
}


async function seedRoles() {
  for (
    const role of
    SYSTEM_ROLES
  ) {
    await prisma.rol.upsert({
      where: {
        nombre:
          role.nombre,
      },

      update: {
        descripcion:
          role.descripcion,
      },

      create: {
        nombre:
          role.nombre,

        descripcion:
          role.descripcion,
      },
    });
  }


  console.log(
    "Roles del sistema verificados.",
  );
}


async function seedInitialAdmin() {
  const username =
    process.env
      .INITIAL_ADMIN_USERNAME
      ?.trim();


  const name =
    process.env
      .INITIAL_ADMIN_NAME
      ?.trim();


  /*
   * Primero revisamos si ya existe
   * el administrador configurado.
   *
   * Esto evita pedir la contraseña
   * nuevamente en cada despliegue.
   */
  if (username) {
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

            nombre_usuario:
              true,
          },
        });


    if (existingUser) {
      console.log(
        `El usuario inicial "${username}" ya existe. No se modificó.`,
      );

      return;
    }
  }


  /*
   * Si todavía no existe,
   * las variables son obligatorias.
   */
  const password =
    process.env
      .INITIAL_ADMIN_PASSWORD;


  if (
    !username ||
    !name ||
    !password
  ) {
    throw new Error(
      [
        "No existe el administrador inicial.",
        "",
        "Debes configurar:",
        "INITIAL_ADMIN_NAME",
        "INITIAL_ADMIN_USERNAME",
        "INITIAL_ADMIN_PASSWORD",
      ].join("\n"),
    );
  }


  validatePassword(
    password,
  );


  const adminRole =
    await prisma.rol
      .findUnique({
        where: {
          nombre:
            "ADMIN",
        },

        select: {
          id_rol:
            true,
        },
      });


  if (!adminRole) {
    throw new Error(
      "No fue posible encontrar el rol ADMIN.",
    );
  }


  const passwordHash =
    await hashPassword(
      password,
    );


  await prisma.usuario.create({
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
        adminRole.id_rol,
    },
  });


  console.log(
    `Administrador inicial "${username}" creado correctamente.`,
  );
}


async function main() {
  await seedRoles();

  await seedInitialAdmin();

  console.log(
    "Seed completado correctamente.",
  );
}


main()
  .catch(
    (error) => {
      console.error(
        "Error ejecutando seed:",
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