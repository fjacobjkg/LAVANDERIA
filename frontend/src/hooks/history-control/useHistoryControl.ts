import {
  useEffect,
  useState,
} from "react";

import {
  createIncident,
  getHistoryServiceOptions,
  getIncidents,
  getServiceHistory,
} from "../../services/history-control.service";

import type {
  HistoryControlTab,
  IncidentRecord,
  IncidentServiceOption,
  OperationHistoryRecord,
  RegisterIncidentInput,
} from "../../types/history-control.types";


export function useHistoryControl() {

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<HistoryControlTab>(
      "incidents",
    );


  /* ========================================
     SERVICIOS
  ======================================== */

  const [
    services,
    setServices,
  ] =
    useState<
      IncidentServiceOption[]
    >([]);


  const [
    selectedHistoryServiceId,
    setSelectedHistoryServiceId,
  ] =
    useState<number | null>(
      null,
    );


  /* ========================================
     INCIDENTES
  ======================================== */

  const [
    incidents,
    setIncidents,
  ] =
    useState<
      IncidentRecord[]
    >([]);


  const [
    incidentsPage,
    setIncidentsPage,
  ] =
    useState(1);


  const [
    incidentsTotalPages,
    setIncidentsTotalPages,
  ] =
    useState(1);


  const [
    incidentsTotalRecords,
    setIncidentsTotalRecords,
  ] =
    useState(0);


  /* ========================================
     HISTORIAL
  ======================================== */

  const [
    history,
    setHistory,
  ] =
    useState<
      OperationHistoryRecord[]
    >([]);


  const [
    historyPage,
    setHistoryPage,
  ] =
    useState(1);


  const [
    historyTotalPages,
    setHistoryTotalPages,
  ] =
    useState(1);


  const [
    historyTotalRecords,
    setHistoryTotalRecords,
  ] =
    useState(0);


  /* ========================================
     UI
  ======================================== */

  const [
    isRegisterModalOpen,
    setIsRegisterModalOpen,
  ] =
    useState(false);


  const [
    isLoadingIncidents,
    setIsLoadingIncidents,
  ] =
    useState(false);


  const [
    isLoadingHistory,
    setIsLoadingHistory,
  ] =
    useState(false);


  const [
    isSubmittingIncident,
    setIsSubmittingIncident,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );


  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState<string | null>(
      null,
    );


  const [
    refreshKey,
    setRefreshKey,
  ] =
    useState(0);


  /* ========================================
     CARGAR SERVICIOS
  ======================================== */

  useEffect(() => {
    let cancelled =
      false;


    async function loadServices() {
      try {
        const result =
          await getHistoryServiceOptions();


        if (cancelled) {
          return;
        }


        setServices(
          result,
        );


        setSelectedHistoryServiceId(
          (current) =>
            current ??
            result[0]?.id ??
            null,
        );

      } catch (loadError) {
        if (cancelled) {
          return;
        }


        setError(
          loadError instanceof Error
            ? loadError.message
            : "No se pudieron cargar los servicios.",
        );
      }
    }


    void loadServices();


    return () => {
      cancelled =
        true;
    };
  }, []);


  /* ========================================
     CARGAR INCIDENTES
  ======================================== */

  useEffect(() => {
    let cancelled =
      false;


    async function loadIncidents() {
      setIsLoadingIncidents(
        true,
      );


      try {
        const result =
          await getIncidents(
            incidentsPage,
          );


        if (cancelled) {
          return;
        }


        setIncidents(
          result.incidents,
        );


        setIncidentsTotalPages(
          result.pagination
            .totalPages,
        );


        setIncidentsTotalRecords(
          result.pagination
            .totalItems,
        );

      } catch (loadError) {
        if (cancelled) {
          return;
        }


        setError(
          loadError instanceof Error
            ? loadError.message
            : "No se pudieron cargar los incidentes.",
        );

      } finally {
        if (!cancelled) {
          setIsLoadingIncidents(
            false,
          );
        }
      }
    }


    void loadIncidents();


    return () => {
      cancelled =
        true;
    };

  }, [
    incidentsPage,
    refreshKey,
  ]);


  /* ========================================
     CARGAR HISTORIAL
  ======================================== */

  useEffect(() => {
    if (
      selectedHistoryServiceId ===
      null
    ) {
      setHistory(
        [],
      );

      setHistoryTotalRecords(
        0,
      );

      setHistoryTotalPages(
        1,
      );

      return;
    }


    let cancelled =
      false;


    async function loadHistory() {
      setIsLoadingHistory(
        true,
      );


      try {
        const result =
          await getServiceHistory(
            selectedHistoryServiceId!,
            historyPage,
          );


        if (cancelled) {
          return;
        }


        setHistory(
          result.history,
        );


        setHistoryTotalPages(
          result.pagination
            .totalPages,
        );


        setHistoryTotalRecords(
          result.pagination
            .totalItems,
        );

      } catch (loadError) {
        if (cancelled) {
          return;
        }


        setError(
          loadError instanceof Error
            ? loadError.message
            : "No se pudo cargar el historial.",
        );

      } finally {
        if (!cancelled) {
          setIsLoadingHistory(
            false,
          );
        }
      }
    }


    void loadHistory();


    return () => {
      cancelled =
        true;
    };

  }, [
    selectedHistoryServiceId,
    historyPage,
    refreshKey,
  ]);


  /* ========================================
     CAMBIO DE SERVICIO
  ======================================== */

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


  /* ========================================
     REGISTRAR INCIDENTE
  ======================================== */

  async function handleRegisterIncident(
    input:
      RegisterIncidentInput,
  ) {
    setIsSubmittingIncident(
      true,
    );

    setError(
      null,
    );

    setSuccessMessage(
      null,
    );


    try {
      const result =
        await createIncident(
          input,
        );


      setIsRegisterModalOpen(
        false,
      );


      setIncidentsPage(
        1,
      );


      setSuccessMessage(
        result.message,
      );


      setRefreshKey(
        (current) =>
          current + 1,
      );

    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No fue posible registrar el incidente.",
      );

    } finally {
      setIsSubmittingIncident(
        false,
      );
    }
  }


  return {
    activeTab,

    services,

    selectedHistoryServiceId,


    incidents,

    incidentsPage,

    incidentsTotalPages,

    incidentsTotalRecords,


    history,

    historyPage,

    historyTotalPages,

    historyTotalRecords,


    isRegisterModalOpen,

    isLoadingIncidents,

    isLoadingHistory,

    isSubmittingIncident,

    error,

    successMessage,


    setActiveTab,

    handleIncidentsPageChange:
      setIncidentsPage,

    handleHistoryPageChange:
      setHistoryPage,

    handleHistoryServiceChange,


    handleOpenRegisterModal:
      () => {
        setError(
          null,
        );

        setIsRegisterModalOpen(
          true,
        );
      },


    handleCloseRegisterModal:
      () =>
        setIsRegisterModalOpen(
          false,
        ),


    handleRegisterIncident,


    handleCloseError:
      () =>
        setError(
          null,
        ),


    handleCloseSuccessMessage:
      () =>
        setSuccessMessage(
          null,
        ),
  };
}