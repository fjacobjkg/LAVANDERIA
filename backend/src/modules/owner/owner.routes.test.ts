import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../../app.js";
import { signToken } from "../../lib/jwt.js";
import { getSessionVersion } from "../../lib/session-version.js";
import { AUTH_COOKIE_NAME } from "../auth/auth.cookie.js";

const db = vi.hoisted(() => ({
  usuario: { findUnique: vi.fn() }, servicio: { aggregate: vi.fn(), findMany: vi.fn() },
  $transaction: vi.fn(),
}));
vi.mock("../../lib/prisma.js", () => ({ prisma: db }));
const hash = "existing-test-hash";
function cookie(claimRole = "PROPIETARIO", version = getSessionVersion(hash)) {
  return `${AUTH_COOKIE_NAME}=${signToken({ sub: 1, username: "owner", role: claimRole, sessionVersion: version })}`;
}
const routes = [
  ["get", "/monthly-deliveries?month=2026-10"],
  ["get", "/account"], ["patch", "/account/username"], ["patch", "/account/password"],
  ["get", "/operators"], ["post", "/operators"], ["patch", "/operators/2/status"],
  ["patch", "/operators/2/password"],
] as const;

describe("Autorización y montaje /api/owner", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    db.usuario.findUnique.mockResolvedValue({
      id_usuario: 1, activo: true, password_hash: hash, rol: { nombre: "PROPIETARIO" },
      nombre: "Propietario", nombre_usuario: "owner",
    });
    db.$transaction.mockImplementation(async (callback: (tx: typeof db) => unknown) => callback(db));
  });
  it.each(routes)("rechaza acceso anónimo %s %s", async (method, path) => {
    const response = await request(createApp())[method](`/api/owner${path}`);
    expect(response.status).toBe(401);
  });
  it.each(["ADMIN", "ADMINISTRADOR", "OPERADOR"])("rechaza %s en todas las rutas incluso con rol PROPIETARIO en JWT", async (role) => {
    db.usuario.findUnique.mockResolvedValue({ activo: true, password_hash: hash, rol: { nombre: role } });
    for (const [method, path] of routes) {
      const response = await request(createApp())[method](`/api/owner${path}`).set("Cookie", cookie());
      expect(response.status).toBe(403);
    }
  });
  it.each([null, { activo: false, password_hash: hash }])("rechaza cuenta inexistente/inactiva", async (user) => {
    db.usuario.findUnique.mockResolvedValue(user);
    const response = await request(createApp()).get("/api/owner/account").set("Cookie", cookie());
    expect(response.status).toBe(401);
  });
  it("rechaza la sesión después de cambiar el hash y no depende del rol del JWT", async () => {
    const oldCookie = cookie("OPERADOR");
    db.usuario.findUnique.mockResolvedValue({ activo: true, password_hash: "changed-hash", rol: { nombre: "PROPIETARIO" } });
    expect((await request(createApp()).get("/api/owner/account").set("Cookie", oldCookie)).status).toBe(401);
  });
  it("permite el propietario actual sin devolver hashes", async () => {
    const response = await request(createApp()).get("/api/owner/account").set("Cookie", cookie("ADMIN"));
    expect(response.status).toBe(200);
    expect(response.body.account).toEqual({ id: 1, name: "Propietario", username: "owner", role: "PROPIETARIO" });
    expect(JSON.stringify(response.body)).not.toContain(hash);
    expect(JSON.stringify(response.body)).not.toContain("password_hash");
  });
  it("alcanza la consulta mensual (no 404), valida fechas y devuelve errores del módulo", async () => {
    db.servicio.aggregate.mockResolvedValue({ _count: 0, _sum: { total_prendas: null } });
    db.servicio.findMany.mockResolvedValue([]);
    const response = await request(createApp()).get("/api/owner/monthly-deliveries?month=2026-10").set("Cookie", cookie());
    expect(response.status).toBe(200);
    expect(response.body.summary).toEqual({ deliveredServices: 0, totalGarments: 0 });
    for (const month of ["2026-13", "2006-10-06", "0000-10"]) {
      expect((await request(createApp()).get(`/api/owner/monthly-deliveries?month=${month}`).set("Cookie", cookie())).status).toBe(400);
    }
  });
});
