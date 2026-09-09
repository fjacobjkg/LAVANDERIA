import {
  useEffect,
  useState,
} from "react";

import {
  confirmDelivery,
  getDeliveryOptions,
  getDeliveryService,
  validateDeliveryQr,
} from "../../services/service.service";

import type {
  DeliveryService,
  DeliveryServiceOption,
  QrValidationStatus,
  QrValidationResult,
} from "../../types/delivery.types";


export function useDeliveryConfirmation() {
  const [
    services,
    setServices,
  ] =
    useState<DeliveryServiceOption[]>(
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
    useState<DeliveryService | null>(
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


  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState<string | null>(
      null,
    );


  const [
    isScannerOpen,
    setIsScannerOpen,
  ] =
    useState(false);


  const [
    qrValidationStatus,
    setQrValidationStatus,
  ] =
    useState<QrValidationStatus>(
      "IDLE",
    );


  const [
    qrValidationMessage,
    setQrValidationMessage,
  ] =
    useState(
      "Escanea el código QR para habilitar la confirmación de entrega.",
    );


  const [
    validatedQrToken,
    setValidatedQrToken,
  ] =
    useState<string | null>(
      null,
    );


  const [
    isConfirming,
    setIsConfirming,
  ] =
    useState(false);


  function resetQrValidation() {
    setQrValidationStatus(
      "IDLE",
    );

    setValidatedQrToken(
      null,
    );

    setQrValidationMessage(
      "Escanea el código QR para habilitar la confirmación de entrega.",
    );
  }


  async function loadService(
    serviceId: number,
  ) {
    const service =
      await getDeliveryService(
        serviceId,
      );


    setSelectedService(
      service,
    );

    setSelectedServiceId(
      serviceId,
    );
  }


  async function loadAvailableServices() {
    const options =
      await getDeliveryOptions();


    setServices(
      options,
    );


    if (
      options.length === 0
    ) {
      setSelectedServiceId(
        null,
      );

      setSelectedService(
        null,
      );

      return;
    }


    await loadService(
      options[0].id,
    );
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


        await loadAvailableServices();

      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los servicios.",
        );

      } finally {
        setIsLoading(
          false,
        );
      }
    }


    void loadInitialData();
  }, []);


  async function handleServiceChange(
    serviceId: number,
  ) {
    try {
      setIsLoading(
        true,
      );

      setError(
        null,
      );

      setSuccessMessage(
        null,
      );

      resetQrValidation();


      await loadService(
        serviceId,
      );

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo consultar el servicio.",
      );

    } finally {
      setIsLoading(
        false,
      );
    }
  }


  function handleOpenScanner() {
    if (!selectedService) {
      return;
    }


    setIsScannerOpen(
      true,
    );
  }


  function handleCloseScanner() {
    setIsScannerOpen(
      false,
    );
  }


async function handleQrScanned(
  qrToken: string,
): Promise<QrValidationResult> {
  if (!selectedService) {
    return {
      success: false,
      message:
        "No hay un servicio seleccionado.",
    };
  }


  try {
    setQrValidationStatus(
      "VALIDATING",
    );

    setQrValidationMessage(
      "Validando código QR...",
    );


    await validateDeliveryQr(
      selectedService.id,
      qrToken,
    );


    setValidatedQrToken(
      qrToken,
    );

    setQrValidationStatus(
      "VALID",
    );

    setQrValidationMessage(
      "Código QR verificado. La entrega puede ser confirmada.",
    );


    return {
      success: true,

      message:
        "Código QR verificado correctamente.",
    };

  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "El código QR no es válido.";


    setValidatedQrToken(
      null,
    );

    setQrValidationStatus(
      "INVALID",
    );

    setQrValidationMessage(
      message,
    );


    return {
      success: false,
      message,
    };
  }
}


  async function handleConfirmDelivery() {
    if (
      !selectedService ||
      !validatedQrToken ||
      qrValidationStatus !==
        "VALID"
    ) {
      return;
    }


    const deliveredCode =
      selectedService.code;


    try {
      setIsConfirming(
        true,
      );

      setError(
        null,
      );


      await confirmDelivery(
        selectedService.id,
        validatedQrToken,
      );


      resetQrValidation();


      setSuccessMessage(
        `Entrega del servicio ${deliveredCode} confirmada correctamente.`,
      );


      await loadAvailableServices();

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo confirmar la entrega.",
      );

    } finally {
      setIsConfirming(
        false,
      );
    }
  }


  const canConfirm =
    qrValidationStatus ===
      "VALID" &&
    validatedQrToken !== null &&
    selectedService !== null;


  return {
    services,

    selectedService,
    selectedServiceId,

    isLoading,
    error,
    successMessage,

    isScannerOpen,

    qrValidationStatus,
    qrValidationMessage,

    isConfirming,
    canConfirm,

    handleServiceChange,

    handleOpenScanner,
    handleCloseScanner,

    handleQrScanned,
    handleConfirmDelivery,
  };
}