import {
  Router,
} from "express";

import {
  requireAuth,
  requireOperator,
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
  requireOperator,
  getServicesController,
);


serviceRouter.post(
  "/",
  requireAuth,
  requireOperator,
  createServiceController,
);


/* ========================================
   OPCIONES
   Rutas estáticas antes de las dinámicas
======================================== */

serviceRouter.get(
  "/label-options",
  requireAuth,
  requireOperator,
  getServicesForLabelController,
);


serviceRouter.get(
  "/delivery-options",
  requireAuth,
  requireOperator,
  getDeliveryServiceOptionsController,
);


/* ========================================
   SEGUIMIENTO
======================================== */

serviceRouter.patch(
  "/:id/next-status",
  requireAuth,
  requireOperator,
  advanceServiceStatusController,
);


/* ========================================
   ETIQUETA QR
======================================== */

serviceRouter.get(
  "/:id/label",
  requireAuth,
  requireOperator,
  getServiceLabelController,
);


serviceRouter.post(
  "/:id/label/print-confirmation",
  requireAuth,
  requireOperator,
  confirmServiceLabelPrintController,
);


/* ========================================
   CONFIRMAR ENTREGA
======================================== */

serviceRouter.get(
  "/:id/delivery",
  requireAuth,
  requireOperator,
  getDeliveryServiceController,
);


serviceRouter.post(
  "/:id/delivery/validate-qr",
  requireAuth,
  requireOperator,
  validateDeliveryQrController,
);


serviceRouter.post(
  "/:id/delivery/confirm",
  requireAuth,
  requireOperator,
  confirmServiceDeliveryController,
);