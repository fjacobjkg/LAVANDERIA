import { z } from "zod";
import { passwordPolicy as password } from "../../../lib/password-policy.js";

const username = z.string().trim().min(1, "El usuario es obligatorio.").max(50);
const currentPassword = z.string().min(1, "La contraseña actual es obligatoria.").max(255);

export const changeUsernameSchema = z.object({ username, currentPassword });
export const changePasswordSchema = z.object({ currentPassword, newPassword: password, confirmPassword: z.string() })
  .refine((data) => data.newPassword === data.confirmPassword, { message: "Las contraseñas no coinciden." })
  .refine((data) => data.newPassword !== data.currentPassword, { message: "La nueva contraseña debe ser diferente de la actual." });
// Los campos adicionales (incluido role/id_rol) no se utilizan.
export const createOperatorSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio.").max(100),
  username, password, confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, { message: "Las contraseñas no coinciden." });
export const operatorIdSchema = z.coerce.number().int().positive().max(2_147_483_647);
export const statusSchema = z.object({ active: z.boolean() });
export const operatorPasswordSchema = z.object({ password, passwordConfirmation: z.string() })
  .refine((data) => data.password === data.passwordConfirmation, { message: "Las contraseñas no coinciden." });
export const operatorsQuerySchema = z.object({ page: z.coerce.number().int().positive().max(1_000_000).default(1) });
