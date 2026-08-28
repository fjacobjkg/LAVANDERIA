import {
  useEffect,
  useState,
} from "react";

import {
  getServiceLabel,
  getServiceLabelOptions,
} from "../../services/service.service";

import type {
  ServiceLabel,
  ServiceLabelOption,
} from "../../types/service-label.types";


export function useServiceLabel() {
  const [
    services,
    setServices,
  ] =
    useState<ServiceLabelOption[]>(
      [],
    );


  const [
    selectedServiceId,
    setSelectedServiceId,
  ] =
    useState<number | null>(
      null,
    );


  const [
    selectedService,
    setSelectedService,
  ] =
    useState<ServiceLabel | null>(
      null,
    );


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


  async function loadService(
    serviceId: number,
  ) {
    try {
      setIsLoading(true);
      setError(null);


      const service =
        await getServiceLabel(
          serviceId,
        );


      setSelectedService(
        service,
      );

      setSelectedServiceId(
        serviceId,
      );

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo consultar la etiqueta.";


      setError(
        message,
      );

      setSelectedService(
        null,
      );

    } finally {
      setIsLoading(
        false,
      );
    }
  }


  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        setError(null);


        const result =
          await getServiceLabelOptions();


        setServices(
          result,
        );


        if (
          result.length > 0
        ) {
          await loadService(
            result[0].id,
          );
        }

      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No se pudieron consultar los servicios.";


        setError(
          message,
        );

      } finally {
        setIsLoading(
          false,
        );
      }
    }


    void loadInitialData();
  }, []);


  function handleServiceChange(
    serviceId: number,
  ) {
    void loadService(
      serviceId,
    );
  }


  return {
    services,

    selectedService,
    selectedServiceId,

    isLoading,
    error,

    handleServiceChange,
  };
}