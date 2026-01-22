import React, { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";
import { useCurrentUser } from "@/api/hooks";
import { adminCategories } from "./data/admin-categories";
import { clientCategories } from "./data/client-categories";
import { Category, isLinkCategory, isParentCategory } from "./types";
import { useTranslation } from "react-i18next";

const loadExpandedItems = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("navExpandedItems");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveExpandedItems = (items: string[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("navExpandedItems", JSON.stringify(items));
  } catch {
    console.error("Failed to save nav state");
  }
};

interface NavigationProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  isMobile?: boolean;
  onMobileNavClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  isSidebarOpen,
  isMobile = false,
  onMobileNavClick,
}) => {
  const { data: currentUser } = useCurrentUser();
  const { t } = useTranslation();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(() =>
    loadExpandedItems(),
  );

  const navItems: Category[] = useMemo(() => {
    const isAdmin = currentUser?.role.name === "ADMIN";

    if (isAdmin) {
      return adminCategories;
    }

    return clientCategories;
  }, [currentUser]);

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) => {
      const newItems = prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name];
      saveExpandedItems(newItems);
      return newItems;
    });
  };

  const isParentActive = (item: (typeof navItems)[number]) => {
    if (isLinkCategory(item)) {
      return pathname === item.href;
    }
    if (isParentCategory(item)) {
      return item.children.some((child) => pathname === child.href);
    }
    return false;
  };

  const isExactMatch = (href: string) => pathname === href;

  const handleParentClick = (name: string) => {
    toggleExpanded(name);
  };

  const truncateToTwoWords = (text: string) => {
    const words = text.split(" ");
    if (words.length <= 2) {
      return text;
    }
    return words.slice(0, 2).join(" ") + "...";
  };

  return (
    <TooltipProvider>
      <div className="h-16 flex items-center justify-center px-4 pt-4">
        {isMobile || isSidebarOpen ? (
          <>
            <Image
              src="/logo/logo-dark.svg"
              alt="Logo"
              width={150}
              height={52}
              className="object-contain dark:hidden"
            />
            <Image
              src="/logo/logo-light.svg"
              alt="Logo"
              width={150}
              height={52}
              className="hidden object-contain dark:block"
            />
          </>
        ) : (
          <>
            <Image
              src="/logo/logo-dark.svg"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain dark:hidden"
            />
            <Image
              src="/logo/logo-light.svg"
              alt="Logo"
              width={40}
              height={40}
              className="hidden object-contain dark:block"
            />
          </>
        )}
      </div>

      <nav
        className="flex-1 p-4 space-y-1 overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          nav::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isParentActive(item);

          if (isLinkCategory(item)) {
            const isExact = isExactMatch(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (isMobile && onMobileNavClick) {
                    onMobileNavClick();
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isMobile || isSidebarOpen
                    ? isExact
                      ? "bg-[#c1585c] text-white shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    : isExact
                      ? "bg-[#c1585c] text-white shadow-sm border-l-2 border-[#a04448] flex-col gap-0.5"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex-col gap-0.5"
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {isMobile || isSidebarOpen ? (
                  <span className="text-sm font-medium flex-1">
                    {t(item.name)}
                  </span>
                ) : (
                  <span className="text-[8px] text-center leading-tight w-full wrap-break-words hyphens-auto">
                    {truncateToTwoWords(t(item.name))}
                  </span>
                )}
              </Link>
            );
          }

          if (isParentCategory(item)) {
            const isExpanded = expandedItems.includes(item.name);

            return (
              <div key={item.name}>
                {/* Parent Item - FIXED HOVER STYLES */}
                <div
                  className={`w-full flex items-center gap-3 rounded-lg transition-all duration-200 cursor-pointer relative ${
                    isMobile || isSidebarOpen
                      ? isActive
                        ? "bg-[#c1585c]/10 dark:bg-[#c1585c]/20 text-[#c1585c] dark:text-[#d46d71] font-medium px-3 py-2"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 hover:shadow-lg flex-col gap-0.5 px-3 py-3 min-w-full"
                  }`}
                  onClick={() => handleParentClick(item.name)}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isMobile || isSidebarOpen ? (
                    <>
                      <span className="text-sm font-medium flex-1">
                        {t(item.name)}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
                          isExpanded ? "rotate-90" : ""
                        } ${
                          isActive
                            ? "text-[#c1585c] dark:text-[#d46d71]"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                    </>
                  ) : (
                    <span className="text-[9px] text-center leading-tight">
                      {truncateToTwoWords(t(item.name))}
                    </span>
                  )}
                </div>

                {/* Children */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded
                      ? "max-h-96 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className={`space-y-1 ${
                      isMobile || isSidebarOpen ? "ml-4" : "ml-0"
                    }`}
                  >
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = pathname === child.href;

                      const childLink = (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => {
                            if (isMobile && onMobileNavClick) {
                              onMobileNavClick();
                            }
                          }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors border-l-2 ${
                            isMobile || isSidebarOpen
                              ? isChildActive
                                ? "bg-[#c1585c]/10 dark:bg-[#c1585c]/20 text-[#c1585c] dark:text-[#d46d71] font-medium border-[#c1585c]"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent"
                              : isChildActive
                                ? "bg-[#c1585c] text-white shadow-sm justify-center border-transparent"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 justify-center border-transparent"
                          }`}
                        >
                          {ChildIcon && <ChildIcon className="w-4 h-4" />}
                          {(isMobile || isSidebarOpen) && (
                            <span>{t(child.name)}</span>
                          )}
                        </Link>
                      );

                      if (!isMobile && !isSidebarOpen) {
                        return (
                          <Tooltip key={child.name}>
                            <TooltipTrigger asChild>{childLink}</TooltipTrigger>
                            <TooltipContent side="right">
                              <p>{t(child.name)}</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      }

                      return childLink;
                    })}
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </nav>
    </TooltipProvider>
  );
};

export default Navigation;
