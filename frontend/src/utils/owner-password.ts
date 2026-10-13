export const PASSWORD_HELP = "Mínimo 10 caracteres, con mayúscula, minúscula, número y carácter especial.";
export function validateOwnerPassword(password: string, confirmation: string) {
  if (password.length < 10 || password.length > 255 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) || !/[^A-Za-z0-9\s]/.test(password)) throw new Error(PASSWORD_HELP);
  if (password !== confirmation) throw new Error("Las contraseñas no coinciden.");
}
