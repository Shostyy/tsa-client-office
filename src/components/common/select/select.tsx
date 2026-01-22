import React, { useState, useMemo, useRef } from "react";
import { ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface VirtualizedSingleSelectProps<T, K extends keyof T> {
  data: T[];
  selectedValue: T[K] | null;
  onSelect: (value: T[K] | null) => void;
  selectAccessorKey: K;
  displayValueAccessorKey: keyof T;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  width?: string | number;
  popoverWidth?: string | number;
  allowClear?: boolean;
}

const ITEM_HEIGHT = 36;
const MAX_VISIBLE_ITEMS = 8;
const CONTAINER_HEIGHT = ITEM_HEIGHT * MAX_VISIBLE_ITEMS;

function VirtualizedSingleSelect<T, K extends keyof T>({
  data,
  selectedValue,
  onSelect,
  selectAccessorKey,
  displayValueAccessorKey,
  placeholder,
  searchPlaceholder = "Пошук...",
  className,
  width = 200,
  popoverWidth,
  allowClear = true,
}: VirtualizedSingleSelectProps<T, K>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setScrollTop(0);
      setSearch("");
    }
  };

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) => {
      const displayValue = String(item[displayValueAccessorKey] || "");
      return displayValue.toLowerCase().includes(search.toLowerCase());
    });
  }, [data, search, displayValueAccessorKey]);

  const selectedItem = useMemo(() => {
    return data.find((item) => item[selectAccessorKey] === selectedValue);
  }, [data, selectedValue, selectAccessorKey]);

  const handleSelect = (value: T[K]) => {
    onSelect(value);
    setOpen(false);
    setSearch("");
    setScrollTop(0);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(null);
  };

  const handleResetSearch = () => {
    setSearch("");
    setScrollTop(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  const endIndex = Math.min(
    startIndex + MAX_VISIBLE_ITEMS + 2,
    filteredData.length
  );
  const visibleItems = filteredData.slice(startIndex, endIndex);
  const offsetY = startIndex * ITEM_HEIGHT;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div style={{ width: width || "100%" }} className="w-fit">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            style={{ width: width || "100%" }}
            className={cn("justify-between h-10 px-3 py-2", className)}
          >
            <span
              className={cn(
                "truncate flex-1 text-left",
                !selectedItem && "text-muted-foreground"
              )}
            >
              {selectedItem
                ? String(selectedItem[displayValueAccessorKey])
                : placeholder || "Select..."}
            </span>
            <div className="flex items-center gap-1 ml-2 shrink-0">
              {allowClear && selectedItem && (
                <div onMouseDown={handleClear}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <X className="h-4 w-4 shrink-0 cursor-pointer hover:text-destructive" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clear</p>
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
            placeholder={searchPlaceholder}
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
                  <p>Reset Search</p>
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
              {visibleItems.map((item) => {
                const value = item[selectAccessorKey];
                const isSelected = value === selectedValue;
                return (
                  <div
                    key={String(value)}
                    className={cn(
                      "flex items-center px-3 cursor-pointer hover:bg-accent",
                      isSelected && "bg-accent"
                    )}
                    style={{ height: ITEM_HEIGHT }}
                    onClick={() => handleSelect(value)}
                  >
                    <span className="truncate">
                      {String(item[displayValueAccessorKey])}
                    </span>
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

export default VirtualizedSingleSelect;
