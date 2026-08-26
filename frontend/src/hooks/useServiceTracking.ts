import type {
  TrackingService,
} from "../types/service-tracking.types";

import {
  useServiceDetail,
} from "./service-tracking/useServiceDetail";

import {
  useServiceList,
} from "./service-tracking/useServiceList";

import {
  useServiceStatusUpdate,
} from "./service-tracking/useServiceStatusUpdate";


export function useServiceTracking() {
  const list =
    useServiceList();


  const detail =
    useServiceDetail();


  function handleServiceUpdated(
    service: TrackingService,
  ) {
    list.replaceService(
      service,
    );

    detail.updateSelectedService(
      service,
    );
  }


  const status =
    useServiceStatusUpdate({
      selectedService:
        detail.selectedService,

      onUpdated:
        handleServiceUpdated,
    });


  function handleConsult(
    service: TrackingService,
  ) {
    status.clearStatusError();

    detail.handleConsult(
      service,
    );
  }


  function handleCloseDetail() {
    status.clearStatusError();

    detail.handleCloseDetail();
  }


  return {
    services:
      list.services,

    selectedService:
      detail.selectedService,

    isDetailOpen:
      detail.isDetailOpen,

    search:
      list.search,

    statusFilter:
      list.statusFilter,

    pagination:
      list.pagination,

    isLoading:
      list.isLoading,

    error:
      status.statusError ??
      list.error,

    isUpdatingStatus:
      status.isUpdatingStatus,

    setSearch:
      list.setSearch,

    setStatusFilter:
      list.setStatusFilter,

    handleSearch:
      list.handleSearch,

    handlePageChange:
      list.handlePageChange,

    handleConsult,

    handleCloseDetail,

    handleAdvanceStatus:
      status.handleAdvanceStatus,
  };
}