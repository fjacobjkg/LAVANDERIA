import {
  useMemo,
  useState,
} from "react";

import type {
  MonthlyDelivery,
} from "../../types/monthly-deliveries.types";


const MOCK_DELIVERIES:
MonthlyDelivery[] = [
  {
    id: 122,

    code:
      "SRV-000122",

    client:
      "Luis Castillo",

    phone:
      "5201-8823",

    garments:
      10,

    receivedAt:
      "2026-08-12T09:20:00",

    deliveredAt:
      "2026-08-12T17:55:00",
  },
];


export function useMonthlyDeliveries() {

  const [
    selectedMonth,
    setSelectedMonth,
  ] =
    useState(
      "2026-08",
    );


  const [
    appliedMonth,
    setAppliedMonth,
  ] =
    useState(
      "2026-08",
    );


  const deliveries =
    useMemo(
      () =>
        MOCK_DELIVERIES.filter(
          (delivery) =>
            delivery.deliveredAt
              .startsWith(
                appliedMonth,
              ),
        ),

      [
        appliedMonth,
      ],
    );


  const totalGarments =
    deliveries.reduce(
      (
        total,
        delivery,
      ) =>
        total +
        delivery.garments,

      0,
    );


  function handleSearch() {
    setAppliedMonth(
      selectedMonth,
    );
  }


  return {
    selectedMonth,

    deliveries,

    deliveredServices:
      deliveries.length,

    totalGarments,

    setSelectedMonth,

    handleSearch,
  };
}