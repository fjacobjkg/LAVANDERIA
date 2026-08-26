import {
  useState,
} from "react";

import {
  advanceServiceStatus,
} from "../../services/service.service";

import type {
  TrackingService,
} from "../../types/service-tracking.types";


interface UseServiceStatusUpdateOptions {
  selectedService:
    TrackingService | null;

  onUpdated:
    (
      service:
        TrackingService,
    ) => void;
}


export function useServiceStatusUpdate({
  selectedService,
  onUpdated,
}: UseServiceStatusUpdateOptions) {
  const [
    isUpdatingStatus,
    setIsUpdatingStatus,
  ] = useState(false);


  const [
    statusError,
    setStatusError,
  ] =
    useState<string | null>(
      null,
    );


  async function handleAdvanceStatus() {
    if (!selectedService) {
      return;
    }


    try {
      setIsUpdatingStatus(
        true,
      );

      setStatusError(
        null,
      );


      const updatedService =
        await advanceServiceStatus(
          selectedService.id,
        );


      onUpdated(
        updatedService,
      );

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el servicio.";


      setStatusError(
        message,
      );


      console.error(
        "Error al actualizar estado:",
        error,
      );

    } finally {
      setIsUpdatingStatus(
        false,
      );
    }
  }


  function clearStatusError() {
    setStatusError(
      null,
    );
  }


  return {
    isUpdatingStatus,
    statusError,

    handleAdvanceStatus,
    clearStatusError,
  };
}