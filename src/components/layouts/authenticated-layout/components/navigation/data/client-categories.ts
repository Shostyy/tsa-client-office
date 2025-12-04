import {
  Calculator,
  ShoppingBag,
  CreditCard,
  FileText,
  Gauge,
  TrendingUp,
  Sliders,
} from "lucide-react";
import { Category } from "../types";

export const clientCategories: Category[] = [
  {
    name: "Navigation.Calculations",
    icon: Calculator,
    children: [
      {
        name: "Navigation.Orders",
        href: "/orders",
        icon: ShoppingBag,
      },
      {
        name: "Navigation.Debts",
        href: "/debts",
        icon: CreditCard,
      },
    ],
  },
  {
    name: "Navigation.Reports",
    icon: FileText,
    children: [
      {
        name: "Navigation.ProducedReport",
        href: "/produced-report",
        icon: Gauge,
      },
      {
        name: "Navigation.CountersAndPrices",
        href: "/counters-drink-prices",
        icon: TrendingUp,
      },
      {
        name: "Navigation.CommercialEquipmentCtrl",
        href: "/commercial-equipment-controls",
        icon: Sliders,
      },
      {
        name: "Navigation.ProfitReport",
        href: "/profit-report",
        icon: Calculator,
      },
    ],
  },
];
