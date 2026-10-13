# Lavandería

Sistema web para el control interno de servicios de lavandería por bolsa o canasto. La aplicación permite registrar servicios, identificar cada bolsa mediante código QR, dar seguimiento a su estado, validar la entrega, registrar incidencias y conservar un historial de las operaciones realizadas.

El proyecto utiliza una arquitectura separada en frontend, backend y base de datos, con soporte para ejecución local y mediante Docker.

---

## Estado actual

El sistema cuenta con los siguientes módulos y capacidades:

- Autenticación mediante sesión en cookie `HttpOnly`.
- Control de acceso por roles.
- Registro y consulta de clientes.
- Registro de servicios.
- Seguimiento del ciclo de vida del servicio.
- Generación de etiquetas QR con identificador interno único.
- Lectura de QR mediante cámara.
- Validación del QR antes de confirmar una entrega.
- Confirmación de entrega.
- Registro de incidencias y correcciones.
- Historial cronológico de operaciones por servicio.
- Paginación reutilizable.
- Interfaz responsive para escritorio, laptop, tablet y móvil.
- Sidebar dinámico según el rol autenticado.
- Vista administrativa del propietario para consulta mensual de entregas.

### Flujo principal del servicio

```text
RECIBIDA
   ↓
EN_PROCESO
   ↓
LISTA_PARA_RECOGER
   ↓
Validación del QR
   ↓
ENTREGADA
```

La transición a `ENTREGADA` se realiza únicamente desde el módulo de confirmación de entrega y requiere validar el código QR correspondiente al servicio seleccionado.

---

## Tecnologías

### Frontend

- React
- Vite
- TypeScript
- React Router
- CSS organizado por componente y pantalla
- `qrcode.react` para generación de códigos QR
- `@zxing/browser` para lectura de códigos QR mediante cámara

### Backend

- Node.js
- Express
- TypeScript
- Zod para validación de datos
- Prisma ORM
- Cookies `HttpOnly` para autenticación

### Base de datos

- MySQL 8.4 LTS
- Prisma ORM
- Migraciones y seed administrados desde el backend

### Infraestructura

- Docker
- Docker Compose
- Nginx para servir el frontend y redirigir `/api` al backend dentro del entorno Docker

---

## Requisitos

Para ejecutar el proyecto localmente:

- Node.js 24 o superior.
- npm.
- MySQL 8.4 o compatible.
- Git.
- Docker Desktop o Docker Engine con Docker Compose, si se utilizará el entorno contenerizado.

Para utilizar el escáner QR desde el navegador también se requiere acceso a una cámara y permisos de cámara habilitados.

---

## Estructura general

```text
lavanderia/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── scripts/
│   │   └── create-user.ts
│   └── src/
│       ├── config/
│       ├── lib/
│       ├── middleware/
│       └── modules/
│           ├── auth/
│           ├── client/
│           ├── service/
│           ├── history-control/
│           └── health/
│
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── hooks/
│       ├── layout/
│       ├── pages/
│       │   ├── operator/
│       │   └── owner/
│       ├── services/
│       ├── styles/
│       ├── types/
│       └── utils/
│
├── docker-compose.yml
└── README.md
```

---

## Roles del sistema

El flujo activo utiliza únicamente **OPERADOR** y **PROPIETARIO**, almacenados en MySQL.

### OPERADOR

Realiza la operación diaria: clientes, servicios, estados, etiquetas QR, entregas, incidencias e historial. Las rutas operativas requieren sesión válida, usuario activo y rol OPERADOR comprobado en MySQL.

### PROPIETARIO

Consulta entregas mensuales, administra su propia cuenta y crea, activa/desactiva o cambia la contraseña de operadores en /owner/accounts. No hay selector de rol ni eliminación de cuentas en la interfaz.

ADMIN y ADMINISTRADOR son roles legacy: no pueden iniciar sesión ni utilizar sesiones previas para acceder a rutas protegidas, no comparten la UI del operador y no se crean mediante el seed ni scripts internos. Los registros y sus relaciones históricas se conservan. No se convierten ni eliminan cuentas automáticamente.

La interfaz mantiene navegaciones separadas y genera los avatares OP y PR a partir del rol.

---

## Autenticación

La autenticación utiliza cookies `HttpOnly`.

Principales endpoints:

```text
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

El frontend realiza las solicitudes autenticadas con:

```ts
credentials: "include"
```

Las credenciales y datos sensibles no deben almacenarse en el código fuente.

---

## Rutas principales del frontend

### Pública

```text
/login
```

### Operación

```text
/services/new
/services
/services/qr-label
/services/delivery-confirmation
/services/incidents-history
```

### Propietario

```text
/owner/monthly-deliveries
```

La ruta inicial después del login se determina según el rol autenticado.

---

## Registro de servicios

Cada servicio representa una bolsa o canasto recibido por la lavandería.

Entre los datos principales se almacenan:

- cliente asociado, si fue proporcionado;
- operador que registró el servicio;
- código único del servicio;
- token QR único;
- total de prendas;
- observaciones;
- estado actual;
- fecha de recepción;
- fecha de última actualización;
- fecha de entrega;
- información relacionada con impresión del QR.

El sistema controla la bolsa o canasto como una unidad de servicio. No registra individualmente cada prenda.

---

## Estados del servicio

Los estados persistidos son:

```text
RECIBIDA
EN_PROCESO
LISTA_PARA_RECOGER
ENTREGADA
```

En la interfaz se muestran como:

```text
RECIBIDA              → Recepción
EN_PROCESO            → En proceso
LISTA_PARA_RECOGER    → Lista para recoger
ENTREGADA             → Entregada
```

El backend es la autoridad sobre las transiciones permitidas.

---

## Seguimiento de servicios

El módulo de consulta y seguimiento permite:

- búsqueda por código, cliente o teléfono;
- filtrado por estado;
- consulta del detalle del servicio;
- avance controlado de estados;
- paginación;
- visualización del progreso mediante stepper;
- badges reutilizables para los estados.

La transición a `ENTREGADA` no se realiza desde este módulo.

---

## Código QR

Cada servicio recibe un `token_qr` único.

El QR contiene únicamente ese identificador interno. No incluye nombre, teléfono ni otros datos personales.

La generación utiliza:

```text
qrcode.react
```

El token permanece estable durante la vida del servicio.

### Impresión

Actualmente el sistema permite generar la etiqueta y utilizar la impresión del navegador.

La integración directa con una impresora térmica física se mantiene separada de la lógica principal. Guardar un PDF o abrir el diálogo de impresión no se considera prueba de una impresión física exitosa.

---

## Confirmación de entrega

La entrega utiliza el QR como mecanismo de validación.

```text
Seleccionar servicio
      ↓
Servicio en LISTA_PARA_RECOGER
      ↓
Abrir cámara
      ↓
Leer token QR
      ↓
Validar token en backend
      ↓
QR correcto
      ↓
Habilitar confirmación
      ↓
Confirmar entrega
      ↓
ENTREGADA
```

El backend vuelve a validar el estado y el token al confirmar la entrega. La validación realizada en el frontend no se considera suficiente por sí sola.

Al entregar se actualizan:

- `estado`;
- `fecha_entrega`;
- `fecha_actualizacion`;
- bitácora de la operación.

---

## Incidentes e historial

El módulo de historial y control está dividido en dos apartados.

### Incidentes y correcciones

Permite registrar excepciones asociadas a un servicio, por ejemplo:

- QR dañado;
- corrección;
- falta de contacto;
- cancelación;
- otros casos operativos.

Los incidentes se muestran paginados.

### Historial por servicio

Permite seleccionar un servicio y consultar únicamente las operaciones relacionadas con él.

El historial se obtiene desde la bitácora y se presenta cronológicamente con paginación.

Ejemplos de eventos:

```text
Servicio registrado
Estado actualizado
Etiqueta QR impresa
Etiqueta QR reimpresa
Incidente registrado
Entrega confirmada
```

Las operaciones relevantes conservan fecha, servicio y responsable cuando corresponde.

---

## Notificaciones

Cuando un servicio pasa de:

```text
EN_PROCESO
    ↓
LISTA_PARA_RECOGER
```

y el cliente cuenta con teléfono, el backend crea un registro de notificación con estado:

```text
PENDIENTE
```

Estados disponibles:

```text
PENDIENTE
ENVIADO
FALLIDO
```

La integración con un proveedor real de WhatsApp puede conectarse posteriormente a estos registros pendientes sin alterar el flujo principal del servicio.

Si un cliente no tiene teléfono registrado, el cambio de estado continúa normalmente y no se crea la notificación.

---

## Consulta mensual del propietario

La vista del propietario está separada de la navegación operativa.

Permite consultar servicios entregados durante un mes determinado utilizando la fecha de entrega almacenada en cada servicio.

La interfaz contempla:

- selector de mes;
- cantidad de servicios entregados;
- total de prendas;
- tabla de entregas;
- navegación exclusiva para el rol `PROPIETARIO`.

---

## Base de datos

Entidades principales:

```text
rol
usuario
cliente
servicio
bitacora
notificacion
incidente
```

Relaciones principales:

```text
rol
 └── usuario

usuario
 ├── servicio
 ├── bitacora
 └── incidente

cliente
 └── servicio

servicio
 ├── bitacora
 ├── notificacion
 └── incidente
```

Prisma gestiona el acceso a la base de datos desde el backend.

---

## Creación de usuarios

No existe registro público. El propietario administra operadores desde **Cuentas y accesos**; el servidor siempre asigna OPERADOR, aunque la petición incluya otro rol.

### Propietario inicial

El seed garantiza únicamente los roles PROPIETARIO y OPERADOR. Para una instalación nueva configura:

```env
INITIAL_OWNER_NAME=Propietario
INITIAL_OWNER_USERNAME=propietario
INITIAL_OWNER_PASSWORD=UnaClaveInicial2026!
```

La contraseña debe tener al menos 10 caracteres, mayúscula, minúscula, número y carácter especial; se procesa con el hash existente.

Desde la raíz del proyecto:

```powershell
npm --prefix backend run db:seed
```

Si el usuario configurado ya es PROPIETARIO, el seed conserva su contraseña, nombre y estado, incluso si no se proporciona de nuevo la contraseña. Si no se indica INITIAL_OWNER_USERNAME y ya existe un propietario activo, no se modifica ninguna cuenta.

### Transición de instalaciones anteriores

INITIAL_ADMIN_* ya no crea cuentas y no se usa como alias de INITIAL_OWNER_*. Las cuentas y roles ADMIN/ADMINISTRADOR existentes se conservan con sus relaciones, pero pierden el acceso al flujo normal. No se eliminan roles ni se modifican cuentas legacy en MySQL.

En una instalación que sólo tenga administrador legacy, configura INITIAL_OWNER_* con un nombre de usuario distinto y ejecuta el seed para crear un propietario explícitamente. Si INITIAL_OWNER_USERNAME está ocupado por otro rol, el seed informa del conflicto y no modifica esa cuenta. No se restablecen contraseñas existentes.

### Herramienta técnica de creación

La herramienta backend/scripts/create-user.ts acepta únicamente PROPIETARIO y OPERADOR. No está expuesta en frontend. Desde la carpeta backend:

```powershell
$env:NEW_USER_PASSWORD="UnaClaveSegura2026!"
npx tsx scripts/create-user.ts --name="Operador principal" --username=operador --role=OPERADOR
Remove-Item Env:NEW_USER_PASSWORD
```

Para crear un propietario por esta herramienta técnica, usa --role=PROPIETARIO y un nombre de usuario disponible. El script valida contraseña y rol, rechaza duplicados y no imprime contraseñas ni hashes.

### Contraseña y estado de operadores

PATCH /api/owner/operators/:id/password recibe password y passwordConfirmation. Requiere propietario activo y objetivo OPERADOR, incluso para operadores inactivos. Usa una transacción para cambiar el hash y registrar CAMBIAR_PASSWORD_OPERADOR con el propietario como actor. No devuelve hashes ni borra cuentas. El propietario mantiene su sesión y las sesiones anteriores del operador dejan de ser válidas.

PATCH /api/owner/operators/:id/status usa active: true/false, exige objetivo OPERADOR y registra ACTIVAR_USUARIO_OPERADOR o DESACTIVAR_USUARIO_OPERADOR. La interfaz confirma antes de cambiar el estado y refresca la tabla desde el hook.

Los campos de contraseña de cuentas incluyen Mostrar/Ocultar mediante Input. El selector mensual ofrece únicamente 2026–2030; el año inicial se limita a ese rango y conserva el mes actual de Guatemala.

---

## Variables de entorno

No deben subirse archivos `.env` al repositorio.

Configura las variables documentadas a continuación en el entorno correspondiente.

Ejemplo conceptual para backend:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL=mysql://usuario:password@localhost:3306/lavanderia

INITIAL_OWNER_NAME=Propietario
INITIAL_OWNER_USERNAME=propietario
INITIAL_OWNER_PASSWORD=UnaClaveInicial2026!
```

Las credenciales reales deben configurarse directamente en el entorno donde se ejecute la aplicación.

---

## Ejecución local

### 1. Instalar dependencias

Desde la raíz:

```bash
npm run install:all
```

También pueden instalarse por proyecto:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

### 2. Configurar variables de entorno

Crea backend/.env con las variables de conexión, JWT y bootstrap documentadas en este README.

Configura la conexión a MySQL y las variables necesarias.

### 3. Generar Prisma Client

```bash
npm --prefix backend run db:generate
```

### 4. Ejecutar migraciones

Utiliza los scripts configurados en el backend para aplicar las migraciones correspondientes al entorno.

### 5. Ejecutar el seed inicial

```bash
npm --prefix backend run db:seed
```

### 6. Levantar backend

```bash
npm run dev:backend
```

### 7. Levantar frontend

En otra terminal:

```bash
npm run dev:frontend
```

Vite utiliza `/api` y redirige estas solicitudes al backend durante desarrollo.

---

## Docker

Desde la raíz:

```bash
docker compose up --build
```

Servicios:

```text
frontend
backend
mysql
```

Accesos de desarrollo:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:3000/api
```

Para detener:

```bash
docker compose down
```

Este comando conserva el volumen de MySQL.

Para eliminar también los volúmenes:

```bash
docker compose down --volumes
```

Utiliza este último comando únicamente cuando realmente quieras eliminar los datos persistidos del entorno Docker.

---

## Health checks

El backend dispone de comprobaciones de estado para distinguir entre disponibilidad del proceso y disponibilidad de sus dependencias.

```text
GET /api/health/live
GET /api/health/ready
```

`live` comprueba que Express está activo.

`ready` comprueba además las dependencias necesarias, incluida la conexión con MySQL.

---

## Verificación del proyecto

Antes de integrar cambios:

```bash
npm run check
npm run test
npm run build
```

También deben probarse manualmente los flujos principales:

```text
Login
  ↓
Registro de servicio
  ↓
Seguimiento
  ↓
Lista para recoger
  ↓
Generación / lectura QR
  ↓
Confirmación de entrega
  ↓
Historial
```

Para cambios visuales deben comprobarse:

- escritorio;
- laptop;
- tablet;
- móvil.

---

## Git

Flujo utilizado durante el desarrollo:

```text
main
  ↑
dev
  ↑
feature/*
```

`main` se mantiene como rama estable.

`dev` integra las funcionalidades terminadas.

Cada desarrollo importante se realiza en una rama corta.

Ejemplos:

```text
feature/service-tracking
feature/qr-label
feature/delivery-confirmation
feature/incidents-history
feature/owner-monthly-deliveries
```

Después de validar una funcionalidad:

```bash
git switch dev
git merge feature/nombre-de-la-funcionalidad
git branch -d feature/nombre-de-la-funcionalidad
```

---

## Seguridad

El proyecto aplica las siguientes decisiones:

- contraseñas almacenadas mediante hash;
- sesiones mediante cookies `HttpOnly`;
- rutas privadas protegidas en backend;
- frontend sin almacenamiento manual de contraseñas;
- QR sin información personal;
- validación de datos mediante Zod;
- reglas de negocio validadas en backend;
- credenciales mediante variables de entorno;
- `.env` excluido de Git;
- creación de usuarios mediante herramientas administrativas internas;
- bitácora para operaciones relevantes.

La interfaz no se considera una barrera de autorización. Los permisos y reglas críticas deben verificarse siempre en el backend.

---

## Arquitectura de desarrollo

### Frontend

```text
Page
 ↓
Hook
 ↓
Service HTTP
 ↓
API
```

Los componentes visuales reutilizables no contienen reglas críticas de negocio.

### Backend

```text
Route
 ↓
Controller
 ↓
Service / caso de uso
 ↓
Prisma
 ↓
MySQL
```

Los controladores deben mantenerse pequeños. La lógica específica de cada caso de uso se separa en archivos dedicados.

---

## Componentes reutilizables

Entre los componentes compartidos del frontend se encuentran:

```text
Button
Input
Textarea
Select
Modal
Notification
Pagination
ServiceStatusBadge
ServiceStatusStepper
```

Esto mantiene una apariencia y un comportamiento consistentes en todas las pantallas.

---

## Estado de integraciones externas

### Cámara QR

Implementada mediante el navegador y `@zxing/browser`.

### Impresora térmica

La interfaz y la etiqueta están preparadas para impresión. La integración con una impresora física debe validarse con el equipo real antes de considerarse completada.

### WhatsApp

La persistencia de notificaciones está preparada. El envío mediante un proveedor externo debe configurarse como una integración independiente.

---

## Consideraciones para producción

Antes de desplegar:

- configurar variables de entorno reales;
- utilizar contraseñas iniciales seguras;
- retirar secretos temporales del entorno una vez utilizados;
- ejecutar migraciones;
- crear o verificar el propietario inicial;
- comprobar permisos de roles;
- probar login y logout;
- probar el ciclo completo del servicio;
- habilitar HTTPS;
- validar la cámara en el navegador objetivo;
- validar físicamente impresora y etiquetas;
- configurar respaldos de MySQL;
- revisar logs y health checks.

Nunca deben subirse al repositorio:

```text
.env
contraseñas
cookies
tokens
credenciales de MySQL
credenciales de proveedores externos
```

---

## Objetivo del sistema

El sistema busca mantener identificada cada bolsa o canasto desde su recepción hasta su entrega, reducir errores de identificación y proporcionar trazabilidad de las acciones realizadas durante el servicio.

La arquitectura está preparada para continuar incorporando integraciones y mejoras sin concentrar toda la lógica en un único módulo.
