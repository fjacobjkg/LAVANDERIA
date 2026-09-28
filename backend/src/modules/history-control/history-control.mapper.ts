const STATUS_LABELS:
Record<string, string> = {
  RECIBIDA:
    "Recibida",

  EN_PROCESO:
    "En proceso",

  LISTA_PARA_RECOGER:
    "Lista para recoger",

  ENTREGADA:
    "Entregada",
};


const ACTION_TITLES:
Record<string, string> = {
  REGISTRAR_SERVICIO:
    "Servicio registrado",

  CAMBIAR_ESTADO_SERVICIO:
    "Estado actualizado",

  IMPRIMIR_ETIQUETA_QR:
    "Etiqueta QR impresa",

  REIMPRIMIR_ETIQUETA_QR:
    "Etiqueta QR reimpresa",

  CONFIRMAR_ENTREGA:
    "Entrega confirmada",

  REGISTRAR_INCIDENTE:
    "Incidente registrado",
};


export function getActionTitle(
  action: string,
) {
  return (
    ACTION_TITLES[action] ??
    action
      .toLowerCase()
      .replaceAll(
        "_",
        " ",
      )
      .replace(
        /^./,
        (character) =>
          character.toUpperCase(),
      )
  );
}


export function getHistoryDescription(
  record: {
    accion: string;

    descripcion:
      string | null;

    estado_anterior:
      string | null;

    estado_nuevo:
      string | null;
  },
) {
  if (
    record.accion ===
      "CAMBIAR_ESTADO_SERVICIO" &&
    record.estado_anterior &&
    record.estado_nuevo
  ) {
    const previous =
      STATUS_LABELS[
        record.estado_anterior
      ] ??
      record.estado_anterior;


    const next =
      STATUS_LABELS[
        record.estado_nuevo
      ] ??
      record.estado_nuevo;


    return `Cambió de ${previous} a ${next}.`;
  }


  return (
    record.descripcion ??
    "Operación registrada sobre el servicio."
  );
}


export function mapIncidentApiType(
  databaseType: string,
) {
  const types:
  Record<string, string> = {
    QR_DANADO:
      "QR_DAMAGED",

    CORRECCION:
      "CORRECTION",

    FALTA_CONTACTO:
      "NO_CONTACT",

    CANCELACION:
      "CANCELLATION",

    OTRO:
      "OTHER",
  };


  return (
    types[databaseType] ??
    "OTHER"
  );
}


export function mapIncidentDatabaseType(
  apiType: string,
) {
  const types = {
    QR_DAMAGED:
      "QR_DANADO",

    CORRECTION:
      "CORRECCION",

    NO_CONTACT:
      "FALTA_CONTACTO",

    CANCELLATION:
      "CANCELACION",

    OTHER:
      "OTRO",
  } as const;


  return types[
    apiType as keyof
      typeof types
  ];
}