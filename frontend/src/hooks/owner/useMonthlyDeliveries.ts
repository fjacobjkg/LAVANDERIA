import { useEffect, useState } from "react";
import { getMonthlyDeliveries } from "../../services/owner/monthly-deliveries.service";
import type { MonthlyDeliveriesResponse } from "../../types/monthly-deliveries.types";
import { getInitialReportMonth } from "../../utils/owner-report-period";


export function useMonthlyDeliveries() {
  const [selectedMonth, setSelectedMonth] = useState(getInitialReportMonth);
  const [query, setQuery] = useState(() => ({ month: getInitialReportMonth(), page: 1, revision: 0 }));
  const [data, setData] = useState<MonthlyDeliveriesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    setData(null);
    getMonthlyDeliveries(query.month, query.page, controller.signal)
      .then((result) => { if (!controller.signal.aborted) setData(result); })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "No fue posible consultar las entregas.");
      })
      .finally(() => { if (!controller.signal.aborted) setIsLoading(false); });
    return () => controller.abort();
  }, [query]);

  return {
    selectedMonth, setSelectedMonth, appliedMonth: query.month, data, isLoading, error,
    handleSearch: () => setQuery((current) => ({ month: selectedMonth, page: 1, revision: current.revision + 1 })),
    handlePageChange: (page: number) => setQuery((current) => ({ ...current, page })),
  };
}
