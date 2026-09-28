import type {
  OperationHistoryRecord,
} from "../../types/history-control.types";


interface OperationHistoryTimelineProps {
  records:
    OperationHistoryRecord[];
}


function formatDateTime(
  date: string,
) {
  return new Intl.DateTimeFormat(
    "es-GT",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",

      hour: "2-digit",
      minute: "2-digit",

      hour12: false,
    },
  ).format(
    new Date(date),
  );
}


export function OperationHistoryTimeline({
  records,
}: OperationHistoryTimelineProps) {

  if (
    records.length === 0
  ) {
    return (
      <div className="history-control-empty">
        No hay movimientos registrados.
      </div>
    );
  }


  return (
    <div className="operation-timeline">

      {records.map(
        (record) => (
          <article
            key={
              record.id
            }

            className="operation-timeline-item"
          >

            <div className="operation-timeline-date">
              {formatDateTime(
                record.occurredAt,
              )}
            </div>


            <div
              className="operation-timeline-marker"
              aria-hidden="true"
            >
              <span />
            </div>


            <div className="operation-timeline-content">

              <h3>
                {record.title}
              </h3>


              <p>
                {record.description}
              </p>


              <span>
                Responsable:{" "}
                {record.responsible}
              </span>

            </div>

          </article>
        ),
      )}

    </div>
  );
}