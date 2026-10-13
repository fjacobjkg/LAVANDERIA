import { z } from "zod";

// Política compartida por bootstrap, herramientas internas y administración.
export const passwordPolicy = z.string().min(10, "La contraseña debe tener al menos 10 caracteres.").max(255)
  .regex(/[A-Z]/, "Debe incluir una mayúscula.")
  .regex(/[a-z]/, "Debe incluir una minúscula.")
  .regex(/[0-9]/, "Debe incluir un número.")
  .regex(/[^A-Za-z0-9\s]/, "Debe incluir un carácter especial.");

export function validatePasswordPolicy(password: string) {
  const result = passwordPolicy.safeParse(password);
  if (!result.success) throw new Error(result.error.issues[0]?.message ?? "La contraseña no es válida.");
}
