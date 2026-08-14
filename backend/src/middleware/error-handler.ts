import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error("Error no controlado:", error);

  response.status(500).json({
    status: "error",
    message: "Ocurrió un error interno.",
  });
};
