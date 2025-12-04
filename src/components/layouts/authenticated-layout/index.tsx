"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout, useCurrentUser } from "@/api/hooks";
import Navigation from "./components/navigation";
import ProfileDropdown from "./components/profile";
import Notifications from "./components/notifications";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarOpen");
      return saved !== null ? saved === "true" : true;
    }
    return true;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: userData } = useCurrentUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarOpen", String(newState));
    }
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push("/auth/login");
      },
    });
  };

  const user = {
    name: userData?.login || userData?.email || "User",
    email: userData?.email || "",
    avatar: "",
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Menu Button - Only show when menu is closed */}
      {!isMobileMenuOpen && (
        <button
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden fixed z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 flex flex-col h-full`}
      >
        <Navigation
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isMobile={true}
          onMobileNavClick={() => setIsMobileMenuOpen(false)}
        />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex ${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-col`}
      >
        <Navigation
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isMobile={false}
        />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 ml-12 md:ml-0">
            {/* Desktop Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleSidebar}
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Notifications />

            <ProfileDropdown
              user={user}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
            />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
