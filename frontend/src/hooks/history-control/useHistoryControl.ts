import {
  useMemo,
  useState,
} from "react";

import type {
  HistoryControlTab,
  IncidentRecord,
  IncidentServiceOption,
  OperationHistoryRecord,
  RegisterIncidentInput,
} from "../../types/history-control.types";


const INCIDENTS_PAGE_SIZE =
  4;

const HISTORY_PAGE_SIZE =
  4;


/* ==============================
   MOCK SERVICES
============================== */

const MOCK_SERVICES:
IncidentServiceOption[] = [
  {
    id: 125,
    code:
      "SRV-000125",
  },

  {
    id: 118,
    code:
      "SRV-000118",
  },

  {
    id: 115,
    code:
      "SRV-000115",
  },
];


/* ==============================
   MOCK INCIDENTS
============================== */

const INITIAL_INCIDENTS:
IncidentRecord[] = [
  {
    id: 18,

    serviceId: 118,

    serviceCode:
      "SRV-000118",

    type:
      "QR_DAMAGED",

    reason:
      "Etiqueta deteriorada",

    detail:
      "Etiqueta deteriorada; se realizó reimpresión.",

    occurredAt:
      "2026-08-11T14:08:00",

    responsible:
      "Operador",
  },

  {
    id: 17,

    serviceId: 115,

    serviceCode:
      "SRV-000115",

    type:
      "CORRECTION",

    reason:
      "Corrección de observación",

    detail:
      "Se corrigió una observación registrada en recepción.",

    occurredAt:
      "2026-08-10T11:24:00",

    responsible:
      "Operador",
  },
];


/* ==============================
   MOCK HISTORY
============================== */

const INITIAL_HISTORY:
OperationHistoryRecord[] = [
  {
    id: 1,

    serviceId: 125,

    occurredAt:
      "2026-08-13T12:41:00",

    title:
      "Aviso de WhatsApp enviado",

    description:
      "Resultado de envío registrado correctamente.",

    responsible:
      "Sistema",
  },

  {
    id: 2,

    serviceId: 125,

    occurredAt:
      "2026-08-13T12:40:00",

    title:
      "Estado actualizado",

    description:
      "Cambió de En proceso a Lista para recoger.",

    responsible:
      "Operador",
  },

  {
    id: 3,

    serviceId: 125,

    occurredAt:
      "2026-08-13T10:18:00",

    title:
      "Estado actualizado",

    description:
      "Cambió de Recibida a En proceso.",

    responsible:
      "Operador",
  },

  {
    id: 4,

    serviceId: 125,

    occurredAt:
      "2026-08-13T08:35:00",

    title:
      "Servicio registrado",

    description:
      "Servicio registrado con 12 prendas.",

    responsible:
      "Operador",
  },

  {
    id: 5,

    serviceId: 118,

    occurredAt:
      "2026-08-11T14:08:00",

    title:
      "Etiqueta QR reimpresa",

    description:
      "Se generó nuevamente la etiqueta QR del servicio.",

    responsible:
      "Operador",
  },

  {
    id: 6,

    serviceId: 118,

    occurredAt:
      "2026-08-11T13:50:00",

    title:
      "Estado actualizado",

    description:
      "Cambió de Recibida a En proceso.",

    responsible:
      "Operador",
  },

  {
    id: 7,

    serviceId: 118,

    occurredAt:
      "2026-08-11T13:20:00",

    title:
      "Servicio registrado",

    description:
      "Servicio registrado con 8 prendas.",

    responsible:
      "Operador",
  },
];


export function useHistoryControl() {

  /* ==============================
     PESTAÑA
  ============================== */

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<HistoryControlTab>(
      "incidents",
    );


  /* ==============================
     INCIDENTES
  ============================== */

  const [
    incidents,
    setIncidents,
  ] =
    useState<IncidentRecord[]>(
      INITIAL_INCIDENTS,
    );


  const [
    incidentsPage,
    setIncidentsPage,
  ] =
    useState(1);


  const incidentsTotalPages =
    Math.max(
      1,
      Math.ceil(
        incidents.length /
        INCIDENTS_PAGE_SIZE,
      ),
    );


  const paginatedIncidents =
    useMemo(
      () => {
        const start =
          (
            incidentsPage -
            1
          ) *
          INCIDENTS_PAGE_SIZE;


        return incidents.slice(
          start,
          start +
          INCIDENTS_PAGE_SIZE,
        );
      },

      [
        incidents,
        incidentsPage,
      ],
    );


  function handleIncidentsPageChange(
    page: number,
  ) {
    if (
      page < 1 ||
      page >
        incidentsTotalPages
    ) {
      return;
    }


    setIncidentsPage(
      page,
    );
  }


  /* ==============================
     MODAL
  ============================== */

  const [
    isRegisterModalOpen,
    setIsRegisterModalOpen,
  ] =
    useState(false);


  /* ==============================
     HISTORIAL POR SERVICIO
  ============================== */

  const [
    selectedHistoryServiceId,
    setSelectedHistoryServiceId,
  ] =
    useState<number | null>(
      MOCK_SERVICES[0]?.id ??
      null,
    );


  const [
    historyPage,
    setHistoryPage,
  ] =
    useState(1);


  const filteredHistory =
    useMemo(
      () => {
        if (
          selectedHistoryServiceId ===
          null
        ) {
          return [];
        }


        return INITIAL_HISTORY
          .filter(
            (record) =>
              record.serviceId ===
              selectedHistoryServiceId,
          )
          .sort(
            (a, b) =>
              new Date(
                b.occurredAt,
              ).getTime() -
              new Date(
                a.occurredAt,
              ).getTime(),
          );
      },

      [
        selectedHistoryServiceId,
      ],
    );


  const historyTotalPages =
    Math.max(
      1,
      Math.ceil(
        filteredHistory.length /
        HISTORY_PAGE_SIZE,
      ),
    );


  const paginatedHistory =
    useMemo(
      () => {
        const start =
          (
            historyPage -
            1
          ) *
          HISTORY_PAGE_SIZE;


        return filteredHistory.slice(
          start,
          start +
          HISTORY_PAGE_SIZE,
        );
      },

      [
        filteredHistory,
        historyPage,
      ],
    );


  function handleHistoryServiceChange(
    serviceId: number,
  ) {
    setSelectedHistoryServiceId(
      serviceId,
    );


    setHistoryPage(
      1,
    );
  }


  function handleHistoryPageChange(
    page: number,
  ) {
    if (
      page < 1 ||
      page >
        historyTotalPages
    ) {
      return;
    }


    setHistoryPage(
      page,
    );
  }


  /* ==============================
     REGISTRAR INCIDENTE
  ============================== */

  function handleRegisterIncident(
    input:
      RegisterIncidentInput,
  ) {

    const service =
      MOCK_SERVICES.find(
        (item) =>
          item.id ===
          input.serviceId,
      );


    if (!service) {
      return;
    }


    const nextId =
      incidents.reduce(
        (
          highest,
          incident,
        ) =>
          Math.max(
            highest,
            incident.id,
          ),

        0,
      ) + 1;


    const newIncident:
      IncidentRecord = {
        id:
          nextId,

        serviceId:
          service.id,

        serviceCode:
          service.code,

        type:
          input.type,

        reason:
          input.reason,

        detail:
          input.detail,

        occurredAt:
          new Date()
            .toISOString(),

        responsible:
          "Operador",
      };


    setIncidents(
      (current) => [
        newIncident,
        ...current,
      ],
    );


    /*
     * El incidente recién creado
     * aparecerá en la primera página.
     */
    setIncidentsPage(
      1,
    );


    setIsRegisterModalOpen(
      false,
    );
  }


  return {
    activeTab,


    /* Incidentes */

    incidents:
      paginatedIncidents,

    incidentsPage,

    incidentsTotalPages,

    incidentsTotalRecords:
      incidents.length,


    /* Servicios */

    services:
      MOCK_SERVICES,


    /* Modal */

    isRegisterModalOpen,


    /* Historial */

    selectedHistoryServiceId,

    history:
      paginatedHistory,

    historyPage,

    historyTotalPages,

    historyTotalRecords:
      filteredHistory.length,


    /* Acciones */

    setActiveTab,

    handleIncidentsPageChange,

    handleHistoryServiceChange,
    handleHistoryPageChange,

    handleOpenRegisterModal:
      () =>
        setIsRegisterModalOpen(
          true,
        ),

    handleCloseRegisterModal:
      () =>
        setIsRegisterModalOpen(
          false,
        ),

    handleRegisterIncident,
  };
}