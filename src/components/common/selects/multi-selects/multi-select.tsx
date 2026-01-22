import React, { useState, useMemo, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, X, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface VirtualizedMultiSelectProps<T, K extends keyof T> {
  data: T[];
  selectedValues: T[K][];
  onSelect: (values: T[K][]) => void;
  selectAccessorKey: K;
  displayValueAccessorKey: keyof T;
  enableSelectAll?: boolean;
  placeholder?: string;
  searchTranslationKey?: string;
  className?: string;
  width?: string | number;
  popoverWidth?: string | number;
  onResetAll?: () => void;
}

const ITEM_HEIGHT = 44;
const MAX_VISIBLE_ITEMS = 8;
const CONTAINER_HEIGHT = ITEM_HEIGHT * MAX_VISIBLE_ITEMS;

function VirtualizedMultiSelect<T, K extends keyof T>({
  data,
  selectedValues,
  onSelect,
  selectAccessorKey,
  displayValueAccessorKey,
  enableSelectAll = true,
  placeholder,
  searchTranslationKey = "Common.Search",
  className,
  width = 200,
  popoverWidth,
  onResetAll,
}: VirtualizedMultiSelectProps<T, K>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLButtonElement>(null);
  const [visibleChipsCount, setVisibleChipsCount] = useState(3);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) => {
      const displayValue = String(item[displayValueAccessorKey] || "");
      return displayValue.toLowerCase().includes(search.toLowerCase());
    });
  }, [data, search, displayValueAccessorKey]);

  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  const allSelected = useMemo(
    () => data.length > 0 && selectedValues.length === data.length,
    [data.length, selectedValues.length]
  );

  const someSelected = useMemo(
    () => selectedValues.length > 0 && selectedValues.length < data.length,
    [selectedValues.length, data.length]
  );

  const handleToggleAll = () => {
    if (allSelected) {
      onSelect([]);
    } else {
      onSelect(data.map((item) => item[selectAccessorKey]));
    }
  };

  const handleToggleItem = (value: T[K]) => {
    const newSelected = selectedSet.has(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelect(newSelected);
  };

  const handleRemove = (value: T[K], e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(selectedValues.filter((v) => v !== value));
  };

  const handleResetAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    onSelect([]);
    if (onResetAll) {
      onResetAll();
    }
  };

  const handleResetSearch = () => {
    setSearch("");
  };

  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  const endIndex = Math.min(
    startIndex + MAX_VISIBLE_ITEMS + 2,
    filteredData.length
  );
  const visibleItems = filteredData.slice(startIndex, endIndex);
  const offsetY = startIndex * ITEM_HEIGHT;

  const selectedItems = useMemo(() => {
    return data.filter((item) => selectedSet.has(item[selectAccessorKey]));
  }, [data, selectedSet, selectAccessorKey]);

  useEffect(() => {
    if (!containerRef.current || selectedItems.length === 0) return;

    const calculateVisibleChips = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const controlsWidth = 60;
      const availableWidth = containerWidth - controlsWidth - 24;

      const tempContainer = document.createElement("div");
      tempContainer.style.display = "flex";
      tempContainer.style.gap = "4px";
      tempContainer.style.visibility = "hidden";
      tempContainer.style.position = "absolute";
      document.body.appendChild(tempContainer);

      let totalWidth = 0;
      let count = 0;

      for (let i = 0; i < selectedItems.length; i++) {
        const badge = document.createElement("span");
        badge.className =
          "inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold";
        badge.textContent =
          String(selectedItems[i][displayValueAccessorKey]) + " ×";
        tempContainer.appendChild(badge);

        const badgeWidth = badge.offsetWidth;

        if (totalWidth + badgeWidth > availableWidth) {
          const moreBadge = document.createElement("span");
          moreBadge.className =
            "inline-flex items-center gap-1 rounded-md border px-2.5 py-0.5 text-xs font-semibold";
          moreBadge.textContent = `+${selectedItems.length - count} more`;
          tempContainer.appendChild(moreBadge);

          if (
            totalWidth + moreBadge.offsetWidth <= availableWidth &&
            count > 0
          ) {
            break;
          } else if (count === 0) {
            count = 0;
            break;
          } else {
            count--;
            break;
          }
        }

        totalWidth += badgeWidth + 4;
        count++;
      }

      document.body.removeChild(tempContainer);
      setVisibleChipsCount(count);
    };

    calculateVisibleChips();
    window.addEventListener("resize", calculateVisibleChips);
    return () => window.removeEventListener("resize", calculateVisibleChips);
  }, [selectedItems, displayValueAccessorKey]);

  const displayedChips = selectedItems.slice(0, visibleChipsCount);
  const remainingCount = selectedItems.length - displayedChips.length;
  const remainingItems = selectedItems.slice(visibleChipsCount);
  const showCountOnly = visibleChipsCount === 0 && selectedItems.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div style={{ width: width || "100%" }} className="w-fit">
          <Button
            ref={containerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            style={{ width: width || "100%" }}
            className={cn("justify-between h-10 px-3 py-2", className)}
          >
            <div className="flex flex-nowrap gap-1 flex-1 items-center overflow-hidden min-w-0">
              {selectedItems.length === 0 ? (
                <span className="text-muted-foreground truncate">
                  {placeholder || t("Common.Select")}
                </span>
              ) : showCountOnly ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm cursor-help">
                        {selectedItems.length} selected
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs !bg-popover !text-popover-foreground border border-border">
                      <div className="flex flex-wrap gap-1">
                        {selectedItems.map((item) => (
                          <Badge
                            key={String(item[selectAccessorKey])}
                            variant="outline"
                            className="text-xs"
                          >
                            {String(item[displayValueAccessorKey])}
                          </Badge>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <>
                  {displayedChips.map((item) => (
                    <Badge
                      key={String(item[selectAccessorKey])}
                      variant="secondary"
                      className="gap-1 shrink-0"
                    >
                      <span className="truncate max-w-[150px]">
                        {String(item[displayValueAccessorKey])}
                      </span>
                      <X
                        data-badge-close
                        className="h-3 w-3 cursor-pointer hover:text-destructive shrink-0"
                        onClick={(e) =>
                          handleRemove(item[selectAccessorKey], e)
                        }
                      />
                    </Badge>
                  ))}
                  {remainingCount > 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="secondary"
                            className="cursor-help shrink-0"
                          >
                            +{remainingCount} more
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs !bg-popover !text-popover-foreground border border-border">
                          <div className="flex flex-wrap gap-1">
                            {remainingItems.map((item) => (
                              <Badge
                                key={String(item[selectAccessorKey])}
                                variant="outline"
                                className="text-xs"
                              >
                                {String(item[displayValueAccessorKey])}
                              </Badge>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-1 ml-2 shrink-0">
              {selectedItems.length > 0 && (
                <div onMouseDown={handleResetAll}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <X className="h-4 w-4 shrink-0 cursor-pointer hover:text-destructive" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t("Common.ResetAll")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 bg-popover"
        style={{ width: popoverWidth || width }}
        align="start"
      >
        <div className="p-2 relative">
          <Input
            placeholder={t(searchTranslationKey)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pr-8"
          />
          {search && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <X
                    className="h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:text-destructive"
                    onClick={handleResetSearch}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("Common.ResetSearch")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div
          ref={scrollContainerRef}
          className="overflow-auto border-t"
          style={{ height: CONTAINER_HEIGHT }}
          onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        >
          <div
            style={{
              height: filteredData.length * ITEM_HEIGHT,
              position: "relative",
            }}
          >
            <div
              style={{
                transform: `translateY(${offsetY}px)`,
                position: "absolute",
                width: "100%",
              }}
            >
              {enableSelectAll && !search && startIndex === 0 && (
                <div
                  className={cn(
                    "flex items-center px-3 cursor-pointer hover:bg-accent",
                    allSelected && "bg-accent"
                  )}
                  style={{ height: ITEM_HEIGHT }}
                  onClick={handleToggleAll}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      allSelected
                        ? "bg-primary text-primary-foreground"
                        : someSelected
                        ? "bg-primary/50 text-primary-foreground"
                        : "opacity-50"
                    )}
                  >
                    {allSelected ? (
                      <Minus className="h-3 w-3" />
                    ) : someSelected ? (
                      <Check className="h-3 w-3" />
                    ) : null}
                  </div>
                  <span className="font-medium">
                    {allSelected
                      ? t("Common.CancelSelection")
                      : t("Common.SelectAll")}
                  </span>
                </div>
              )}
              {visibleItems.map((item) => {
                const value = item[selectAccessorKey];
                const isSelected = selectedSet.has(value);
                return (
                  <div
                    key={String(value)}
                    className={cn(
                      "flex items-center px-3 cursor-pointer hover:bg-accent",
                      isSelected && "bg-accent"
                    )}
                    style={{ height: ITEM_HEIGHT }}
                    onClick={() => handleToggleItem(value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span>{String(item[displayValueAccessorKey])}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default VirtualizedMultiSelect;
