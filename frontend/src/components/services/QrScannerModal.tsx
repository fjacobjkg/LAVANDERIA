import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  BrowserQRCodeReader,
} from "@zxing/browser";

import type {
  QrValidationResult,
} from "../../types/delivery.types";

import {
  Button,
} from "../Button";

import {
  Modal,
} from "../Modal";


interface QrScannerModalProps {
  isOpen: boolean;

  onClose: () => void;

  onScanned: (
    qrToken: string,
  ) => Promise<QrValidationResult>;
}


type ScannerStatus =
  | "SCANNING"
  | "VALIDATING"
  | "ERROR";


export function QrScannerModal({
  isOpen,
  onClose,
  onScanned,
}: QrScannerModalProps) {

  const videoRef =
    useRef<HTMLVideoElement | null>(
      null,
    );


  /*
   * Conservamos las funciones actuales
   * sin obligar a reiniciar la cámara
   * en cada render del componente padre.
   */
  const onScannedRef =
    useRef(
      onScanned,
    );


  const onCloseRef =
    useRef(
      onClose,
    );


  const hasScannedRef =
    useRef(false);


  const controlsRef =
    useRef<{
      stop: () => void;
    } | null>(
      null,
    );


  const [
    scannerStatus,
    setScannerStatus,
  ] =
    useState<ScannerStatus>(
      "SCANNING",
    );


  const [
    scannerMessage,
    setScannerMessage,
  ] =
    useState(
      "Enfoca el código QR adherido a la bolsa o canasto.",
    );


  const [
    scanAttempt,
    setScanAttempt,
  ] =
    useState(0);


  /*
   * Actualizar referencia de onScanned.
   */
  useEffect(() => {
    onScannedRef.current =
      onScanned;
  }, [onScanned]);


  /*
   * Actualizar referencia de onClose.
   */
  useEffect(() => {
    onCloseRef.current =
      onClose;
  }, [onClose]);


  /*
   * Cámara y lectura QR.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }


    hasScannedRef.current =
      false;


    setScannerStatus(
      "SCANNING",
    );


    setScannerMessage(
      "Enfoca el código QR adherido a la bolsa o canasto.",
    );


    const reader =
      new BrowserQRCodeReader();


    let controls:
      | {
          stop: () => void;
        }
      | undefined;


    let cancelled =
      false;


    async function processQr(
      qrToken: string,
    ) {

      /*
       * Detener lectura mientras
       * el backend valida el QR.
       */
      controls?.stop();

      controlsRef.current?.stop();


      setScannerStatus(
        "VALIDATING",
      );


      setScannerMessage(
        "Leyendo y validando código QR...",
      );


      try {
        const result =
          await onScannedRef.current(
            qrToken,
          );


        if (cancelled) {
          return;
        }


        /*
         * QR correcto:
         * cerrar inmediatamente.
         */
        if (result.success) {
          onCloseRef.current();

          return;
        }


        /*
         * QR incorrecto:
         * mantener modal abierto.
         */
        setScannerStatus(
          "ERROR",
        );


        setScannerMessage(
          result.message,
        );

      } catch {
        if (cancelled) {
          return;
        }


        setScannerStatus(
          "ERROR",
        );


        setScannerMessage(
          "No se pudo validar el código QR.",
        );
      }
    }


    async function startScanner() {
      if (!videoRef.current) {
        return;
      }


      try {
        controls =
          await reader.decodeFromConstraints(
            {
              audio: false,

              video: {
                facingMode: {
                  ideal:
                    "environment",
                },
              },
            },

            videoRef.current,

            (result) => {
              if (
                !result ||
                hasScannedRef.current
              ) {
                return;
              }


              hasScannedRef.current =
                true;


              void processQr(
                result.getText(),
              );
            },
          );


        if (cancelled) {
          controls.stop();

          return;
        }


        controlsRef.current =
          controls;

      } catch (error) {
        if (cancelled) {
          return;
        }


        console.error(
          "No se pudo abrir la cámara:",
          error,
        );


        setScannerStatus(
          "ERROR",
        );


        setScannerMessage(
          "No se pudo abrir la cámara. Revisa los permisos del navegador.",
        );
      }
    }


    void startScanner();


    return () => {
      cancelled =
        true;


      controls?.stop();

      controlsRef.current?.stop();

      controlsRef.current =
        null;
    };

  }, [
    isOpen,
    scanAttempt,
  ]);


  function handleRetry() {
    hasScannedRef.current =
      false;


    setScanAttempt(
      (current) =>
        current + 1,
    );
  }


  return (
    <Modal
      isOpen={
        isOpen
      }

      title="Escanear código QR"

      onClose={
        onClose
      }
    >

      <div className="qr-scanner-modal">

        <div className="qr-scanner-camera">

          <video
            ref={
              videoRef
            }

            className="qr-scanner-video"

            muted

            playsInline
          />


          <div
            className={
              `qr-scanner-frame qr-scanner-frame--${scannerStatus.toLowerCase()}`
            }

            aria-hidden="true"
          />

        </div>


        <div
          className={
            `qr-scanner-feedback qr-scanner-feedback--${scannerStatus.toLowerCase()}`
          }

          aria-live="polite"
        >

          {scannerStatus ===
            "VALIDATING" && (
            <span
              className="qr-scanner-loader"
              aria-hidden="true"
            />
          )}


          {scannerStatus ===
            "ERROR" && (
            <span
              className="qr-scanner-feedback-icon"
              aria-hidden="true"
            >
              !
            </span>
          )}


          <span>
            {scannerMessage}
          </span>

        </div>


        <div className="qr-scanner-actions">

          {scannerStatus ===
            "ERROR" && (
            <Button
              type="button"

              onClick={
                handleRetry
              }
            >
              Escanear nuevamente
            </Button>
          )}


          <Button
            type="button"

            variant="secondary"

            disabled={
              scannerStatus ===
              "VALIDATING"
            }

            onClick={
              onClose
            }
          >
            Cancelar
          </Button>

        </div>

      </div>

    </Modal>
  );
}