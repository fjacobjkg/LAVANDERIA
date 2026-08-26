import {
  useState,
} from "react";

import type {
  TrackingService,
} from "../../types/service-tracking.types";


export function useServiceDetail() {
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
  ] = useState(false);


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


  function updateSelectedService(
    service: TrackingService,
  ) {
    setSelectedService(
      service,
    );
  }


  return {
    selectedService,
    isDetailOpen,

    handleConsult,
    handleCloseDetail,

    updateSelectedService,
  };
}