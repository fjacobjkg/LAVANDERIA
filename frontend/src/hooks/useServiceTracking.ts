import {
  useEffect,
  useState,
} from "react";

import {
  getServices,
} from "../services/service.service";

import type {
  ServicePagination,
  ServiceStatusFilter,
  TrackingService,
} from "../types/service-tracking.types";


interface AppliedFilters {
  search: string;

  status:
    ServiceStatusFilter;
}


const initialFilters:
  AppliedFilters = {
    search: "",
    status: "ALL",
  };


export function useServiceTracking() {
  const [
    services,
    setServices,
  ] =
    useState<TrackingService[]>(
      [],
    );


  const [
    selectedService,
    setSelectedService,
  ] =
    useState<TrackingService | null>(
      null,
    );


  const [
    isDetailOpen,
    setIsDetailOpen,
  ] =
    useState(false);


  const [
    search,
    setSearch,
  ] =
    useState("");


  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<ServiceStatusFilter>(
      "ALL",
    );


  /*
   * Filtros que realmente
   * están aplicados.
   */
  const [
    appliedFilters,
    setAppliedFilters,
  ] =
    useState<AppliedFilters>(
      initialFilters,
    );


  const [
    pagination,
    setPagination,
  ] =
    useState<ServicePagination>({
      page: 1,

      pageSize: 10,

      totalItems: 0,

      totalPages: 1,
    });


  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);


  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );


  async function loadServices(
    page: number,
    filters: AppliedFilters,
  ) {
    try {
      setIsLoading(true);
      setError(null);

      const result =
        await getServices({
          search:
            filters.search,

          status:
            filters.status,

          page,
        });

      setServices(
        result.services,
      );

      setPagination(
        result.pagination,
      );

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron consultar los servicios.";

      setError(message);

      setServices([]);

    } finally {
      setIsLoading(false);
    }
  }


  /*
   * Primera carga.
   */
  useEffect(() => {
    void loadServices(
      1,
      initialFilters,
    );
  }, []);


  /*
   * Aplicar búsqueda y filtros.
   *
   * Cada búsqueda nueva
   * regresa a página 1.
   */
  function handleSearch() {
    const filters:
      AppliedFilters = {
        search:
          search.trim(),

        status:
          statusFilter,
      };

    setAppliedFilters(
      filters,
    );

    void loadServices(
      1,
      filters,
    );
  }


  /*
   * Cambiar únicamente de página,
   * conservando los filtros aplicados.
   */
  function handlePageChange(
    page: number,
  ) {
    if (
      page < 1 ||
      page >
        pagination.totalPages
    ) {
      return;
    }

    void loadServices(
      page,
      appliedFilters,
    );
  }


  function handleConsult(
    service: TrackingService,
  ) {
    setSelectedService(
      service,
    );

    setIsDetailOpen(
      true,
    );
  }


  function handleCloseDetail() {
    setIsDetailOpen(
      false,
    );
  }


  return {
    services,

    selectedService,
    isDetailOpen,

    search,
    statusFilter,

    pagination,

    isLoading,
    error,

    setSearch,
    setStatusFilter,

    handleSearch,
    handlePageChange,

    handleConsult,
    handleCloseDetail,
  };
}