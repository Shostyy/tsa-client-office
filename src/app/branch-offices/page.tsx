"use client";

import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
} from "ag-grid-community";
import {
  useBranchOffices,
  useBranchOfficeUpdate,
} from "@/api/hooks/branch-office.hooks";
import { BranchOffice } from "@/api/types";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

import {
  AG_GRID_LOCALE_EN,
  AG_GRID_LOCALE_UA,
} from "@ag-grid-community/locale";

export const getAgGridLocale = (language: string) => {
  switch (language) {
    case "uk":
      return AG_GRID_LOCALE_UA;
    case "en":
    default:
      return AG_GRID_LOCALE_EN;
  }
};

export function BranchOffices() {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { data: branchOffices = [], isLoading } = useBranchOffices();
  const { initiateUpdate } = useBranchOfficeUpdate();

  const handleUpdate = async () => {
    try {
      await initiateUpdate();
    } catch (error) {
      console.error("Failed to start update:", error);
    }
  };

  // Configure theme based on current theme
  const gridTheme = useMemo(
    () =>
      themeQuartz.withParams({
        backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
        foregroundColor: theme === "dark" ? "#f9fafb" : "#111827",
        browserColorScheme: theme === "dark" ? "dark" : "light",
        headerBackgroundColor: theme === "dark" ? "#111827" : "#f9fafb",
        headerTextColor: theme === "dark" ? "#f9fafb" : "#111827",
        oddRowBackgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
        rowHoverColor: theme === "dark" ? "#374151" : "#f3f4f6",
      }),
    [theme],
  );

  // Dynamic locale based on current language
  const gridLocale = useMemo(
    () => getAgGridLocale(i18n.language),
    [i18n.language],
  );

  // Memoize column defs to update when language changes
  const columnDefs: ColDef<BranchOffice>[] = useMemo(
    () => [
      {
        field: "id",
        headerName: t("branchOffices.columns.id"),
        width: 100,
        sortable: true,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        resizable: true,
        minWidth: 80,
        maxWidth: 150,
      },
      {
        field: "name",
        headerName: t("branchOffices.columns.name"),
        flex: 1,
        sortable: true,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        resizable: true,
        minWidth: 150,
      },
    ],
    [t],
  );

  if (isLoading) {
    return <div className="p-2">{t("branchOffices.loading")}</div>;
  }

  return (
    <div className="flex flex-col h-full p-5">
      <div className="mb-5 flex-shrink-0">
        <button onClick={handleUpdate} className="mr-4">
          {t("branchOffices.updateButton")}
        </button>
        <span>
          {t("branchOffices.totalCount", { count: branchOffices.length })}
        </span>
      </div>

      <div className="flex-1 min-h-0">
        <AgGridReact
          key={i18n.language}
          rowData={branchOffices}
          columnDefs={columnDefs}
          theme={gridTheme}
          suppressColumnVirtualisation={true}
          localeText={gridLocale}
        />
      </div>
    </div>
  );
}

export default BranchOffices;
