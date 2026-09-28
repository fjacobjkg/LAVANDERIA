import type {
  HistoryControlTab,
} from "../../types/history-control.types";


interface HistoryControlTabsProps {
  activeTab: HistoryControlTab;

  onChange: (
    tab: HistoryControlTab,
  ) => void;
}


export function HistoryControlTabs({
  activeTab,
  onChange,
}: HistoryControlTabsProps) {
  return (
    <div
      className="history-control-tabs"
      role="tablist"
      aria-label="Historial y control"
    >

      <button
        type="button"
        role="tab"

        aria-selected={
          activeTab === "incidents"
        }

        className={`history-control-tab ${
          activeTab === "incidents"
            ? "history-control-tab--active"
            : ""
        }`}

        onClick={() =>
          onChange(
            "incidents",
          )
        }
      >
        Incidentes y correcciones
      </button>


      <button
        type="button"
        role="tab"

        aria-selected={
          activeTab === "history"
        }

        className={`history-control-tab ${
          activeTab === "history"
            ? "history-control-tab--active"
            : ""
        }`}

        onClick={() =>
          onChange(
            "history",
          )
        }
      >
        Historial de operación
      </button>

    </div>
  );
}