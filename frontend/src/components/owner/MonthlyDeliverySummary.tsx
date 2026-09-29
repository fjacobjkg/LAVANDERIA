interface MonthlyDeliverySummaryProps {
  deliveredServices: number;

  totalGarments: number;
}


export function MonthlyDeliverySummary({
  deliveredServices,
  totalGarments,
}: MonthlyDeliverySummaryProps) {

  return (
    <div className="monthly-summary">

      <article className="monthly-summary-card">

        <span>
          Servicios entregados
        </span>

        <strong>
          {deliveredServices}
        </strong>

      </article>


      <article className="monthly-summary-card">

        <span>
          Total de prendas
        </span>

        <strong>
          {totalGarments}
        </strong>

      </article>

    </div>
  );
}