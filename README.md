# Lavandería Sol y Espuma

Base técnica del sistema web definido en los documentos DERCAS para identificar, dar seguimiento y entregar bolsas o canastos mediante código QR.

## Estado del proyecto

La fase 1 deja preparada y comprobable la comunicación entre:

- React, Vite, TypeScript y Tailwind CSS 4.
- Node.js, Express y TypeScript.
- Prisma ORM 7 y MySQL 8.4 LTS.
- Los contenedores `frontend`, `backend` y `mysql` administrados por Docker Compose.

Todavía no se implementan usuarios, órdenes ni reglas de negocio. Esos modelos comenzarán en la fase 2 para mantener el aprendizaje incremental.

## Requisitos

- Node.js 24 o superior.
- Docker Desktop o Docker Engine con el complemento Compose.
- Git, recomendado pero no obligatorio.

## Inicio rápido con Docker

Desde la carpeta raíz del proyecto:

```bash
cp .env.example .env
docker compose up --build
```

Después abre:

- Interfaz: <http://localhost:5173>
- Información de la API: <http://localhost:3000/api>
- Estado de la API: <http://localhost:3000/api/health/live>
- Estado de la API y MySQL: <http://localhost:3000/api/health/ready>

La primera descarga de imágenes y dependencias puede tardar algunos minutos. Cuando la pantalla muestre las tres capas como conectadas, el recorrido completo `React -> Express -> Prisma -> MySQL` está funcionando.

Para detener el proyecto:

```bash
docker compose down
```

Este comando conserva los datos. Para eliminar también el volumen de desarrollo de MySQL usa `docker compose down --volumes`; hazlo únicamente cuando quieras reiniciar la base de datos.

## Ejecución sin Docker

Necesitas una instancia de MySQL accesible en `localhost:3306` y una base llamada `lavanderia`.

```bash
cp backend/.env.example backend/.env
npm run install:all
npm --prefix backend run db:generate
```

En dos terminales diferentes:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

Vite enviará las solicitudes `/api` al backend local mediante su proxy de desarrollo.

## Verificaciones

```bash
npm run check
npm run test
npm run build
```

Las pruebas del backend verifican:

- API activa.
- API y base de datos listas mediante una dependencia simulada.
- Respuesta `503` cuando MySQL no está disponible.
- Respuestas JSON para rutas inexistentes.

La comprobación real de MySQL se realiza al ejecutar `GET /api/health/ready` con los contenedores activos.

## Estructura

```text
lavanderia/
├── backend/
│   ├── prisma/
│   └── src/
│       ├── config/
│       ├── lib/
│       ├── middleware/
│       └── modules/health/
├── frontend/
│   └── src/
│       ├── api/
│       └── components/
├── docker-compose.yml
└── README.md
```

## Decisiones de la fase 1

1. El frontend consume `/api` y Vite lo redirige al backend. Esto evita acoplar los componentes a una dirección local concreta.
2. `GET /api/health/live` confirma que Express funciona; `GET /api/health/ready` confirma además la conexión real con MySQL.
3. Prisma usa su generador ESM y el adaptador oficial de MySQL/MariaDB.
4. MySQL queda expuesto solamente en `127.0.0.1` durante desarrollo y conserva los datos en un volumen.
5. Las credenciales reales se guardan en `.env`, archivo excluido del control de versiones.

## Próxima fase

La fase 2 incorporará el esquema inicial del dominio, la primera migración y los datos semilla para `Rol`, `Usuario`, `Cliente`, `Servicio`, `Notificación`, `Incidente`, `ImpresionQr` y `Bitácora`.
