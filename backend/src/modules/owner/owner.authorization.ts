import type { RequestHandler } from "express";
import { prisma } from "../../lib/prisma.js";

// El rol del JWT no autoriza: se comprueba la cuenta actual en MySQL.
export const requireOwner: RequestHandler = async (_request, response, next) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: response.locals.user.sub },
      select: { activo: true, rol: { select: { nombre: true } } },
    });
    if (!user?.activo) { response.status(401).json({ message: "La sesión no es válida." }); return; }
    if (user.rol.nombre !== "PROPIETARIO") {
      response.status(403).json({ message: "Esta operación requiere el rol PROPIETARIO." }); return;
    }
    next();
  } catch (error) { next(error); }
};
