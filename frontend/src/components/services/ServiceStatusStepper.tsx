import type {
  ServiceStatus,
} from "../../types/service-tracking.types";

import "../../styles/service-status-stepper.css";

interface ServiceStatusStepperProps {
  currentStatus: ServiceStatus;
}

const steps: {
  key: ServiceStatus;
  label: string;
}[] = [
  {
    key: "RECIBIDA",
    label: "Recepción",
  },
  {
    key: "EN_PROCESO",
    label: "En proceso",
  },
  {
    key: "LISTA_PARA_RECOGER",
    label: "Lista para recoger",
  },
  {
    key: "ENTREGADA",
    label: "Entregada",
  },
];

export function ServiceStatusStepper({
  currentStatus,
}: ServiceStatusStepperProps) {
  const currentIndex =
    steps.findIndex(
      (step) =>
        step.key === currentStatus,
    );

  return (
    <div
      className="service-stepper"
      aria-label="Estado del servicio"
    >
      {steps.map((step, index) => {
          const isCompleted =
            index < currentIndex;

          const isActive =
            index === currentIndex;

          const stepClasses = [
            "service-stepper-step",

            `service-stepper-step--${step.key.toLowerCase()}`,

            isCompleted
              ? "service-stepper-step--completed"
              : "",

            isActive
              ? "service-stepper-step--active"
              : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={step.key}
              className={stepClasses}
            >
              <div className="service-stepper-track" />

              <div className="service-stepper-marker">
                <span />
              </div>

              <span className="service-stepper-label">
                {step.label}
              </span>
            </div>
          );
        },
      )}
    </div>
  );
}