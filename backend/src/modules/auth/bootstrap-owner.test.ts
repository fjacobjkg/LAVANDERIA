import { beforeEach, describe, expect, it, vi } from "vitest";
import { seedInitialOwner } from "../../../prisma/bootstrap-owner.js";

const db = vi.hoisted(() => ({
  usuario: { findUnique: vi.fn(), findFirst: vi.fn(), upsert: vi.fn() }, rol: { findUnique: vi.fn() },
}));
vi.mock("../../lib/prisma.js", () => ({ prisma: db }));
const environment = { INITIAL_OWNER_NAME: "Propietario", INITIAL_OWNER_USERNAME: "propietario", INITIAL_OWNER_PASSWORD: "Propietario123!" };

beforeEach(() => {
  vi.resetAllMocks();
  db.usuario.findUnique.mockResolvedValue(null);
  db.usuario.findFirst.mockResolvedValue(null);
  db.rol.findUnique.mockResolvedValue({ id_rol: 3 });
  db.usuario.upsert.mockResolvedValue({ rol: { nombre: "PROPIETARIO" } });
});

describe("Bootstrap compatible del propietario", () => {
  it("crea propietario con hash y sin actualizar una cuenta existente concurrente", async () => {
    await seedInitialOwner(environment);
    const input = db.usuario.upsert.mock.calls[0]![0];
    expect(input.create.id_rol).toBe(3);
    expect(input.create.password_hash).not.toBe(environment.INITIAL_OWNER_PASSWORD);
    expect(input.update).toEqual({});
  });
  it("conserva contraseña/estado del propietario existente incluso sin contraseña configurada", async () => {
    db.usuario.findUnique.mockResolvedValue({ rol: { nombre: "PROPIETARIO" } });
    await seedInitialOwner({ INITIAL_OWNER_USERNAME: "propietario" });
    expect(db.usuario.upsert).not.toHaveBeenCalled();
  });
  it("permite instalaciones con propietario activo sin exigir variables nuevas", async () => {
    db.usuario.findFirst.mockResolvedValue({ id_usuario: 3 });
    await seedInitialOwner({});
    expect(db.usuario.upsert).not.toHaveBeenCalled();
  });
  it.each(["ADMIN", "ADMINISTRADOR", "OPERADOR"])("no convierte ni modifica una cuenta %s con el mismo usuario", async (role) => {
    db.usuario.findUnique.mockResolvedValue({ rol: { nombre: role } });
    await expect(seedInitialOwner(environment)).rejects.toThrow("ocupado");
    expect(db.usuario.upsert).not.toHaveBeenCalled();
  });
  it("las variables legacy no crean ADMIN ni convierten cuentas", async () => {
    await expect(seedInitialOwner({ INITIAL_ADMIN_NAME: "Legacy", INITIAL_ADMIN_USERNAME: "admin", INITIAL_ADMIN_PASSWORD: "Legacy123!" })).rejects.toThrow("INITIAL_OWNER_NAME");
    expect(db.usuario.upsert).not.toHaveBeenCalled();
  });
  it("rechaza configuraciones incompletas y contraseñas débiles", async () => {
    await expect(seedInitialOwner({ INITIAL_OWNER_USERNAME: "propietario" })).rejects.toThrow("INITIAL_OWNER");
    await expect(seedInitialOwner({ ...environment, INITIAL_OWNER_PASSWORD: "debil" })).rejects.toThrow("10 caracteres");
    expect(db.usuario.upsert).not.toHaveBeenCalled();
  });
});
