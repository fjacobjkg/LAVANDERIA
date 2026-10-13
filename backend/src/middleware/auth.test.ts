import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../app.js";
import { signToken } from "../lib/jwt.js";
import { getSessionVersion } from "../lib/session-version.js";
import { hashPassword } from "../lib/password.js";

const db = vi.hoisted(() => ({ usuario: { findUnique: vi.fn() } }));
vi.mock("../lib/prisma.js", () => ({ prisma: db }));
const password = "Credenciales123!";
let hash: string;
function cookie(role = "OPERADOR") {
  return `lavanderia_session=${signToken({ sub: 1, username: "legacy", role, sessionVersion: getSessionVersion(hash) })}`;
}
beforeEach(async () => { vi.resetAllMocks(); hash = await hashPassword(password); });

describe("Roles activos y permisos operativos", () => {
  it.each(["ADMIN", "ADMINISTRADOR", "OTRO"])("rechaza login y tokens de %s sin modificar la cuenta", async (role) => {
    db.usuario.findUnique.mockResolvedValue({ id_usuario: 1, nombre_usuario: "legacy", activo: true, password_hash: hash, rol: { nombre: role } });
    const app = createApp();
    expect((await request(app).post("/api/auth/login").send({ username: "legacy", password })).status).toBe(403);
    expect((await request(app).post("/api/auth/login").send({ username: "legacy", password: "incorrecta" })).status).toBe(401);
    for (const path of ["/api/auth/me", "/api/services", "/api/clients", "/api/history-control/service-options", "/api/owner/account"]) {
      expect((await request(app).get(path).set("Cookie", cookie("OPERADOR"))).status).toBe(403);
    }
  });
  it("mantiene operación del OPERADOR usando el rol de MySQL aunque JWT diga ADMIN", async () => {
    db.usuario.findUnique.mockResolvedValue({ activo: true, password_hash: hash, rol: { nombre: "OPERADOR" } });
    const response = await request(createApp()).post("/api/services").set("Cookie", cookie("ADMIN")).send({});
    expect(response.status).toBe(400); // Llega al validador existente, sin modificar el servicio.
  });
  it("separa el área operativa del propietario aunque el claim indique OPERADOR", async () => {
    db.usuario.findUnique.mockResolvedValue({ activo: true, password_hash: hash, rol: { nombre: "PROPIETARIO" } });
    for (const path of ["/api/services", "/api/clients", "/api/history-control/service-options"]) {
      expect((await request(createApp()).get(path).set("Cookie", cookie())).status).toBe(403);
    }
  });
});
