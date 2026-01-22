import {
  Users,
  UserPlus,
  Shield,
  Activity,
  BookOpen,
  Building2,
  User,
  Store,
  Layers,
  Coffee,
  DollarSign,
  Package,
  Box,
  UtensilsCrossed,
  ShoppingBag,
  CreditCard,
  FileText,
  Gauge,
  Calculator,
  TrendingUp,
  Settings,
  Mail,
  FileSearch,
  Sliders,
} from "lucide-react";
import { Category } from "../types";

export const adminCategories: Category[] = [
  {
    name: "Navigation.UserInfo",
    icon: Users,
    children: [
      {
        name: "Navigation.Users",
        href: "/users",
        icon: Users,
      },
      {
        name: "Navigation.UserRegistration",
        href: "/register",
        icon: UserPlus,
      },
      {
        name: "Navigation.Roles",
        href: "/roles",
        icon: Shield,
      },
      {
        name: "Navigation.UsersSessions",
        href: "/user-sessions",
        icon: Activity,
      },
    ],
  },
  {
    name: "Navigation.References",
    icon: BookOpen,
    children: [
      {
        name: "Navigation.Specifications",
        href: "/specifications",
        icon: FileText,
      },
      {
        name: "Navigation.BranchOffices",
        href: "/branch-offices",
        icon: Building2,
      },
      {
        name: "Navigation.Customers",
        href: "/customers",
        icon: User,
      },
      {
        name: "Navigation.TradePoints",
        href: "/trade-points",
        icon: Store,
      },
      {
        name: "Navigation.Categories",
        href: "/categories",
        icon: Layers,
      },
      {
        name: "Navigation.Products",
        href: "/products",
        icon: Coffee,
      },
      {
        name: "Navigation.ProductPrices",
        href: "/product-prices",
        icon: DollarSign,
      },
      {
        name: "Navigation.ProductRemains",
        href: "/product-remains",
        icon: Package,
      },
      {
        name: "Navigation.Materials",
        href: "/materials",
        icon: Box,
      },
      {
        name: "Navigation.Models",
        href: "/models",
        icon: Layers,
      },
      {
        name: "Navigation.CommercialEquipment",
        href: "/commercial-equipment",
        icon: UtensilsCrossed,
      },
    ],
  },
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
        name: "Navigation.CommercialEquipmentCtrl",
        href: "/commercial-equipment-controls",
        icon: Sliders,
      },
      {
        name: "Navigation.CountersAndPrices",
        href: "/counters-drink-prices",
        icon: TrendingUp,
      },
      {
        name: "Navigation.ProfitReport",
        href: "/profit-report",
        icon: Calculator,
      },
    ],
  },
  {
    name: "Navigation.Settings",
    icon: Settings,
    children: [
      {
        name: "Navigation.PostServer",
        href: "/postserver",
        icon: Mail,
      },
      {
        name: "Navigation.Logs",
        href: "/logs",
        icon: FileSearch,
      },
      {
        name: "Navigation.UsersMethods",
        href: "/methods-settings",
        icon: Settings,
      },
    ],
  },
];
