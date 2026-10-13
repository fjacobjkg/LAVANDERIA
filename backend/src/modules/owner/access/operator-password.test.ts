import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../../../app.js";
import { hashPassword, verifyPassword } from "../../../lib/password.js";
import { getSessionVersion } from "../../../lib/session-version.js";
import { signToken } from "../../../lib/jwt.js";
import { changeOperatorPassword } from "./access.service.js";

const db = vi.hoisted(() => ({
  usuario: { findUnique: vi.fn(), findFirst: vi.fn(), updateMany: vi.fn() },
  bitacora: { create: vi.fn() }, $transaction: vi.fn(),
}));
vi.mock("../../../lib/prisma.js", () => ({ prisma: db }));
const password = "NuevaOperador123!";
let ownerHash: string;
let cookie: string;
beforeEach(async () => {
  vi.resetAllMocks();
  ownerHash = await hashPassword("Propietario123!");
  cookie = `lavanderia_session=${signToken({ sub: 1, username: "owner", role: "PROPIETARIO", sessionVersion: getSessionVersion(ownerHash) })}`;
  db.usuario.findUnique.mockResolvedValue({ activo: true, password_hash: ownerHash, rol: { nombre: "PROPIETARIO" } });
  db.usuario.findFirst.mockResolvedValue({ id_usuario: 1 });
  db.usuario.updateMany.mockResolvedValue({ count: 1 });
  db.$transaction.mockImplementation(async (callback: (tx: typeof db) => unknown) => callback(db));
});

describe("Contraseña de operador", () => {
  it("cambia el hash del objetivo, conserva sesión del propietario y registra actor/objetivo", async () => {
    const response = await request(createApp()).patch("/api/owner/operators/2/password")
      .set("Cookie", cookie).send({ password, passwordConfirmation: password });
    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]).toBeUndefined();
    expect(response.body).toEqual({ message: "Contraseña del operador actualizada correctamente." });
    const update = db.usuario.updateMany.mock.calls[0]![0];
    expect(update.where).toEqual({ id_usuario: 2, rol: { nombre: "OPERADOR" } });
    expect(await verifyPassword(password, update.data.password_hash)).toBe(true);
    expect(update.data.password_hash).not.toBe(ownerHash);
    expect(db.bitacora.create).toHaveBeenCalledWith({ data: { id_usuario: 1, tabla_afectada: "usuario", id_registro: 2n, accion: "CAMBIAR_PASSWORD_OPERADOR" } });
    expect(db.$transaction).toHaveBeenCalledTimes(1);
  });
  it("rechaza objetivos inexistentes o de otros roles sin registrar cambio", async () => {
    // MySQL no encuentra un objetivo OPERADOR; no debe relajarse ese filtro.
    db.usuario.updateMany.mockResolvedValue({ count: 0 });
    await expect(changeOperatorPassword(1, 99, password)).rejects.toMatchObject({ statusCode: 404 });
    expect(db.bitacora.create).not.toHaveBeenCalled();
  });
  it("revalida el actor dentro de la transacción", async () => {
    db.usuario.findFirst.mockResolvedValue(null);
    await expect(changeOperatorPassword(1, 2, password)).rejects.toMatchObject({ statusCode: 403 });
    expect(db.usuario.updateMany).not.toHaveBeenCalled();
  });
  it("propaga el fallo de bitácora para que Prisma revierta la actualización", async () => {
    db.bitacora.create.mockRejectedValue(new Error("AUDIT_FAILURE"));
    await expect(changeOperatorPassword(1, 2, password)).rejects.toThrow("AUDIT_FAILURE");
  });
  it.each([
    ["corta", "corta"], ["minusculas123!", "minusculas123!"], ["MAYUSCULAS123!", "MAYUSCULAS123!"],
    ["SinNumeroClave!", "SinNumeroClave!"], ["SinEspecial123", "SinEspecial123"], [password, "distinta"],
  ])("rechaza contraseña/confirmación inválidas", async (passwordValue, confirmation) => {
    const result = await request(createApp()).patch("/api/owner/operators/2/password").set("Cookie", cookie)
      .send({ password: passwordValue, passwordConfirmation: confirmation });
    expect(result.status).toBe(400);
    expect(db.usuario.updateMany).not.toHaveBeenCalled();
  });
});
