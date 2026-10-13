import { beforeEach, describe, expect, it, vi } from "vitest";
import { hashPassword, verifyPassword } from "../../../lib/password.js";
import { login } from "../../auth/auth.service.js";
import { changeUsername, changePassword, createOperator, setOperatorStatus, listOperators } from "./access.service.js";
import { createOperatorSchema, changePasswordSchema } from "./access.schema.js";
import { matchesSessionVersion, getSessionVersion } from "../../../lib/session-version.js";

const db = vi.hoisted(() => ({
  usuario: { findUnique: vi.fn(), findUniqueOrThrow: vi.fn(), updateMany: vi.fn(), create: vi.fn(), findFirst: vi.fn(), count: vi.fn(), findMany: vi.fn() },
  rol: { findUnique: vi.fn() }, bitacora: { create: vi.fn() }, $transaction: vi.fn(),
}));
vi.mock("../../../lib/prisma.js", () => ({ prisma: db }));

const currentPassword = "ActualClave123!";
const newPassword = "NuevaClave123!";
let owner: { id_usuario: number; activo: boolean; nombre: string; nombre_usuario: string; password_hash: string; rol: { nombre: string } };

beforeEach(async () => {
  vi.resetAllMocks();
  owner = { id_usuario: 1, activo: true, nombre: "Propietario", nombre_usuario: "owner",
    password_hash: await hashPassword(currentPassword), rol: { nombre: "PROPIETARIO" } };
  db.usuario.findUnique.mockResolvedValue(owner);
  db.usuario.findUniqueOrThrow.mockResolvedValue({ ...owner, nombre_usuario: "nuevo" });
  db.usuario.updateMany.mockResolvedValue({ count: 1 });
  db.$transaction.mockImplementation(async (callback: (tx: typeof db) => unknown) => callback(db));
});

describe("Credenciales y operadores", () => {
  it("lista únicamente operadores, sin hashes y ajusta la página al total", async () => {
    db.usuario.count.mockResolvedValue(11);
    db.usuario.findMany.mockResolvedValue([{
      id_usuario: 2, nombre: "Operador", nombre_usuario: "operador", activo: true,
      fecha_creacion: new Date("2026-10-13T14:00:00Z"), password_hash: "never-return",
    }]);
    const result = await listOperators(999);
    expect(result.pagination).toEqual({ currentPage: 2, totalPages: 2, totalItems: 11 });
    expect(result.operators[0]).not.toHaveProperty("password_hash");
    expect(db.usuario.findMany.mock.calls[0]![0]).toMatchObject({ where: { rol: { nombre: "OPERADOR" } }, skip: 10, take: 10 });
  });
  it("verifica contraseña antes de cambiar usuario y rechaza duplicados", async () => {
    await expect(changeUsername(1, "nuevo", "incorrecta")).rejects.toMatchObject({ statusCode: 400 });
    expect(db.$transaction).not.toHaveBeenCalled();
    db.usuario.updateMany.mockRejectedValue({ code: "P2002" });
    await expect(changeUsername(1, "ocupado", currentPassword)).rejects.toMatchObject({ statusCode: 409 });
    expect(db.bitacora.create).not.toHaveBeenCalled();
  });
  it("cambia usuario y registra actor/objetivo en la misma transacción", async () => {
    expect(await changeUsername(1, "nuevo", currentPassword)).toEqual({ id: 1, name: "Propietario", username: "nuevo", role: "PROPIETARIO" });
    expect(db.bitacora.create).toHaveBeenCalledWith({ data: {
      id_usuario: 1, tabla_afectada: "usuario", id_registro: 1n, accion: "CAMBIAR_NOMBRE_USUARIO",
    } });
    expect(db.$transaction).toHaveBeenCalledTimes(1);
  });
  it("cambia contraseña con el algoritmo existente e invalida JWT anteriores", async () => {
    const version = getSessionVersion(owner.password_hash);
    await changePassword(1, currentPassword, newPassword);
    const updatedHash = db.usuario.updateMany.mock.calls[0]![0].data.password_hash as string;
    expect(await verifyPassword(newPassword, updatedHash)).toBe(true);
    expect(updatedHash).not.toBe(newPassword);
    expect(matchesSessionVersion(version, updatedHash)).toBe(false);
    expect(matchesSessionVersion(undefined, updatedHash)).toBe(false);
    expect(db.bitacora.create.mock.calls[0]![0].data.accion).toBe("CAMBIAR_PASSWORD");
    expect(JSON.stringify(db.bitacora.create.mock.calls, (_, value) => typeof value === "bigint" ? String(value) : value)).not.toContain(newPassword);
    expect(db.$transaction).toHaveBeenCalledTimes(1);
  });
  it("no cambia credenciales si la contraseña actual es incorrecta o la nueva es igual", async () => {
    await expect(changePassword(1, "incorrecta", newPassword)).rejects.toMatchObject({ statusCode: 400 });
    await expect(changePassword(1, currentPassword, currentPassword)).rejects.toMatchObject({ statusCode: 400 });
    expect(db.usuario.updateMany).not.toHaveBeenCalled();
  });
  it("propaga fallos de bitácora desde la transacción y detecta cambios concurrentes", async () => {
    db.bitacora.create.mockRejectedValue(new Error("AUDIT_FAILURE"));
    await expect(changeUsername(1, "nuevo", currentPassword)).rejects.toThrow("AUDIT_FAILURE");
    db.usuario.updateMany.mockResolvedValue({ count: 0 });
    await expect(changePassword(1, currentPassword, newPassword)).rejects.toMatchObject({ statusCode: 409 });
  });
  it.each(["corta", "minuscula123!", "MAYUSCULA123!", "SinNumerosClave!", "SinEspecial123", "Espacios 123"])("rechaza contraseña débil: %s", (password) => {
    expect(createOperatorSchema.safeParse({ name: "Operador", username: "operador", password, confirmPassword: password }).success).toBe(false);
  });
  it("valida confirmación y diferencia en backend", () => {
    expect(changePasswordSchema.safeParse({ currentPassword, newPassword, confirmPassword: "distinta" }).success).toBe(false);
    expect(changePasswordSchema.safeParse({ currentPassword, newPassword: currentPassword, confirmPassword: currentPassword }).success).toBe(false);
  });
  it("ignora roles enviados, crea siempre OPERADOR y la cuenta resultante puede iniciar sesión", async () => {
    db.rol.findUnique.mockResolvedValue({ id_rol: 2, nombre: "OPERADOR" });
    db.usuario.create.mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
      ...data, id_usuario: 2, fecha_creacion: new Date("2026-10-13T08:00:00Z"),
    }));
    const input = createOperatorSchema.parse({ name: "Operador", username: "nuevo.operador", password: newPassword, confirmPassword: newPassword, role: "ADMIN", id_rol: 99 });
    const result = await createOperator(1, input);
    const created = db.usuario.create.mock.calls[0]![0].data;
    expect(created.id_rol).toBe(2);
    expect(created.role).toBeUndefined();
    expect(result).not.toHaveProperty("password_hash");
    db.usuario.findUnique.mockResolvedValue({ ...created, id_usuario: 2, rol: { nombre: "OPERADOR" } });
    const session = await login({ username: input.username, password: newPassword });
    expect(session.user.role).toBe("OPERADOR");
    expect(session.user).not.toHaveProperty("password_hash");
    expect(db.bitacora.create.mock.calls[0]![0].data).toMatchObject({ id_usuario: 1, id_registro: 2n, accion: "CREAR_USUARIO_OPERADOR" });
  });
  it("rechaza username duplicado al crear operador", async () => {
    db.rol.findUnique.mockResolvedValue({ id_rol: 2 });
    db.usuario.create.mockRejectedValue({ code: "P2002" });
    await expect(createOperator(1, { name: "Operador", username: "ocupado", password: newPassword, confirmPassword: newPassword })).rejects.toMatchObject({ statusCode: 409 });
    expect(db.bitacora.create).not.toHaveBeenCalled();
  });
  it("no afecta otras cuentas al cambiar estado y registra ambos cambios", async () => {
    db.usuario.findFirst.mockResolvedValue(null);
    await expect(setOperatorStatus(1, 99, false)).rejects.toMatchObject({ statusCode: 404 });
    expect(db.usuario.updateMany).not.toHaveBeenCalled();
    db.usuario.findFirst.mockResolvedValue({ id_usuario: 2, activo: true });
    await setOperatorStatus(1, 2, false);
    expect(db.usuario.updateMany).toHaveBeenCalledWith({ where: { id_usuario: 2, activo: true, rol: { nombre: "OPERADOR" } }, data: { activo: false } });
    expect(db.bitacora.create.mock.calls[0]![0].data.accion).toBe("DESACTIVAR_USUARIO_OPERADOR");
    db.usuario.findFirst.mockResolvedValue({ id_usuario: 2, activo: false });
    await setOperatorStatus(1, 2, true);
    expect(db.bitacora.create.mock.calls[1]![0].data.accion).toBe("ACTIVAR_USUARIO_OPERADOR");
  });
});
