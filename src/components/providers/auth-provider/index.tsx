"use client";
import { useCurrentUser } from "@/api/hooks";
import { AuthenticatedLayout } from "@/components/layouts";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    data: userData,
    isPending: userDataPending,
    isError: userDataError,
  } = useCurrentUser();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasRedirected = useRef(false);

  const isAuthenticated = !!userData && !userDataError;

  const authRoutes = [
    "/auth/login",
    "/auth/complete-registration",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-email",
  ];

  const isAuthRoute = authRoutes.some((route) => pathname?.startsWith(route));

  useEffect(() => {
    hasRedirected.current = false;
  }, [pathname]);

  useEffect(() => {
    if (userDataPending || hasRedirected.current) return;

    if (isAuthenticated && isAuthRoute) {
      if (
        pathname?.startsWith("/auth/forgot-password") ||
        pathname?.startsWith("/auth/reset-password") ||
        pathname?.startsWith("/auth/verify-email")
      ) {
        return;
      }

      if (
        pathname?.startsWith("/auth/login") ||
        pathname?.startsWith("/auth/complete-registration")
      ) {
        hasRedirected.current = true;

        const returnUrl = searchParams?.get("returnUrl");
        router.push(returnUrl && returnUrl !== "/" ? returnUrl : "/dashboard");
        return;
      }
    }

    if (!isAuthenticated && !isAuthRoute) {
      hasRedirected.current = true;
      const returnUrl =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }
  }, [
    isAuthenticated,
    isAuthRoute,
    pathname,
    userDataPending,
    router,
    searchParams,
  ]);

  if (userDataPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (isAuthenticated) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
  }

  return null;
};

export default AuthProvider;
