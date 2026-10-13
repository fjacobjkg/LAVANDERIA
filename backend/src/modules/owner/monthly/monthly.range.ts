// fecha_entrega se escribe con new Date() y el adaptador serializa UTC.
// MySQL DATETIME no guarda zona. Guatemala (UTC-6): medianoche = 06:00 UTC.
export function getMonthRange(month: string) {
  const [yearText, monthText] = month.split("-");
  const year = Number(yearText);
  const index = Number(monthText) - 1;
  return { start: new Date(Date.UTC(year, index, 1, 6)), end: new Date(Date.UTC(year, index + 1, 1, 6)) };
}
