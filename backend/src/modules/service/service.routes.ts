import {
  Router,
} from "express";

import {
  requireAuth,
} from "../../middleware/auth.js";

import {
  advanceServiceStatusController,

  confirmServiceDeliveryController,
  confirmServiceLabelPrintController,

  createServiceController,

  getDeliveryServiceController,
  getDeliveryServiceOptionsController,

  getServiceLabelController,
  getServicesController,
  getServicesForLabelController,

  validateDeliveryQrController,
} from "./service.controller.js";


export const serviceRouter =
  Router();


/* ========================================
   CONSULTA Y REGISTRO
======================================== */

serviceRouter.get(
  "/",
  requireAuth,
  getServicesController,
);


serviceRouter.post(
  "/",
  requireAuth,
  createServiceController,
);


/* ========================================
   OPCIONES
   Rutas estáticas antes de las dinámicas
======================================== */

serviceRouter.get(
  "/label-options",
  requireAuth,
  getServicesForLabelController,
);


serviceRouter.get(
  "/delivery-options",
  requireAuth,
  getDeliveryServiceOptionsController,
);


/* ========================================
   SEGUIMIENTO
======================================== */

serviceRouter.patch(
  "/:id/next-status",
  requireAuth,
  advanceServiceStatusController,
);


/* ========================================
   ETIQUETA QR
======================================== */

serviceRouter.get(
  "/:id/label",
  requireAuth,
  getServiceLabelController,
);


serviceRouter.post(
  "/:id/label/print-confirmation",
  requireAuth,
  confirmServiceLabelPrintController,
);


/* ========================================
   CONFIRMAR ENTREGA
======================================== */

serviceRouter.get(
  "/:id/delivery",
  requireAuth,
  getDeliveryServiceController,
);


serviceRouter.post(
  "/:id/delivery/validate-qr",
  requireAuth,
  validateDeliveryQrController,
);


serviceRouter.post(
  "/:id/delivery/confirm",
  requireAuth,
  confirmServiceDeliveryController,
);