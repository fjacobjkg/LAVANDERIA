import {
  useEffect,
  useState,
} from "react";

import {
  confirmServiceLabelPrint,
  getServiceLabel,
  getServiceLabelOptions,
} from "../../services/service.service";

import type {
  ServiceLabel,
  ServiceLabelOption,
} from "../../types/service-label.types";


interface PrintNotification {
  title: string;

  message: string;
}


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
    isConfirmingPrint,
    setIsConfirmingPrint,
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
    printNotification,
    setPrintNotification,
  ] =
    useState<PrintNotification | null>(
      null,
    );


  async function loadService(
    serviceId: number,
  ) {

    try {
      setIsLoading(
        true,
      );

      setError(
        null,
      );


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
        setIsLoading(
          true,
        );

        setError(
          null,
        );


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

    setPrintNotification(
      null,
    );


    void loadService(
      serviceId,
    );
  }


  async function handlePrintConfirmation() {

    if (
      !selectedService
    ) {
      return;
    }


    const wasPrinted =
      selectedService.qrPrinted;


    try {

      setIsConfirmingPrint(
        true,
      );

      setError(
        null,
      );


      const updatedService =
        await confirmServiceLabelPrint(
          selectedService.id,
        );


      setSelectedService(
        updatedService,
      );


      setPrintNotification({
        title:
          wasPrinted
            ? "Etiqueta reimpresa"
            : "Etiqueta impresa",

        message:
          wasPrinted
            ? "La reimpresión de la etiqueta QR fue registrada correctamente."
            : "La impresión de la etiqueta QR fue registrada correctamente.",
      });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "No se pudo registrar la impresión de la etiqueta.";


      setError(
        message,
      );

    } finally {

      setIsConfirmingPrint(
        false,
      );
    }
  }


  function handleClosePrintNotification() {

    setPrintNotification(
      null,
    );
  }


  return {
    services,

    selectedService,
    selectedServiceId,

    isLoading,
    isConfirmingPrint,

    error,
    printNotification,

    handleServiceChange,
    handlePrintConfirmation,
    handleClosePrintNotification,
  };
}