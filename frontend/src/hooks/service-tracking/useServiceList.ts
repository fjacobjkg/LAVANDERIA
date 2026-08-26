import {
  useEffect,
  useState,
} from "react";

import {
  getServices,
} from "../../services/service.service";

import type {
  ServicePagination,
  ServiceStatusFilter,
  TrackingService,
} from "../../types/service-tracking.types";


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


const initialPagination:
  ServicePagination = {
    page: 1,
    pageSize: 7,
    totalItems: 0,
    totalPages: 1,
  };


export function useServiceList() {
  const [
    services,
    setServices,
  ] =
    useState<TrackingService[]>(
      [],
    );


  const [
    search,
    setSearch,
  ] = useState("");


  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<ServiceStatusFilter>(
      "ALL",
    );


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
    useState<ServicePagination>(
      initialPagination,
    );


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


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


  useEffect(() => {
    void loadServices(
      1,
      initialFilters,
    );
  }, []);


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


  function replaceService(
    updatedService:
      TrackingService,
  ) {
    setServices(
      (currentServices) =>
        currentServices.map(
          (service) =>
            service.id ===
            updatedService.id
              ? updatedService
              : service,
        ),
    );
  }


  return {
    services,

    search,
    statusFilter,

    pagination,

    isLoading,
    error,

    setSearch,
    setStatusFilter,

    handleSearch,
    handlePageChange,

    replaceService,
  };
}